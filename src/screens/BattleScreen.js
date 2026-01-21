import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LogBox, Platform, Animated } from 'react-native';

// Ignore specific ExpoGL warnings that are spammy but harmless
const originalLog = console.log;
console.log = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('EXGL: gl.pixelStorei')) return;
    originalLog(...args);
};

// Ignore specific ExpoGL warnings that are spammy but harmless
LogBox.ignoreLogs(['EXGL: gl.pixelStorei()']);
import { Canvas, useFrame, useLoader } from '@react-three/fiber/native';
import { useGLTF, useAnimations } from '@react-three/drei/native';
import * as THREE from 'three';
import { COLORS, SPACING } from '../constants/theme';
import { MOCK_ANIMALS } from '../data/mockCollection';

// Preload Models to avoid glitches
// Note: In a real app, use asset management. Here we require them directly.
// Assuming files are at assets/models/Wolf.glb and assets/models/Frog.glb
// We need to require them to get the internal URI for Expo
const WolfModel = require('../../assets/models/Wolf.glb');
const FrogModel = require('../../assets/models/Frog.glb');

// --- 3D Components ---

const HealParticles = ({ count = 15, color = '#38ef7d' }) => {
    // Simple particle system: Rising green spheres
    const [particles] = useState(() => Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 1.5,
        speed: 0.02 + Math.random() * 0.04,
        scale: Math.random() * 0.15 + 0.05
    })));

    const meshRefs = useRef([]);

    useFrame(() => {
        meshRefs.current.forEach((ref, i) => {
            if (ref) {
                ref.position.y += particles[i].speed;
                // Fade out as they go up
                if (ref.material.opacity > 0) ref.material.opacity -= 0.015;

                // Reset if loop needed (but we usually unmount, handled by parent timer)
                // For a single burst, just letting them fade is fine.
                // If we want continuous stream during the 1s animation:
                if (ref.material.opacity <= 0) {
                    ref.position.y = particles[i].y;
                    ref.material.opacity = 1;
                }
            }
        });
    });

    return (
        <group>
            {particles.map((p, i) => (
                <mesh
                    key={i}
                    ref={el => meshRefs.current[i] = el}
                    position={[p.x, p.y, p.z]}
                    scale={[p.scale, p.scale, p.scale]}
                >
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshBasicMaterial color={color} transparent opacity={1} />
                </mesh>
            ))}
        </group>
    );
};

// --- Custom Shaders (hooked into StandardMaterial for Shadows) ---

const useGrassMaterial = () => {
    const materialRef = useRef();

    useEffect(() => {
        if (materialRef.current) {
            // Need to set needsUpdate to ensure onBeforeCompile is called if swapped
            materialRef.current.needsUpdate = true;

            materialRef.current.onBeforeCompile = (shader) => {
                shader.uniforms.colorA = { value: new THREE.Color('#a8e063') };
                shader.uniforms.colorB = { value: new THREE.Color('#56ab2f') };

                shader.vertexShader = `
                    varying vec2 vUv;
                    ${shader.vertexShader}
                `.replace(
                    '#include <begin_vertex>',
                    `
                    #include <begin_vertex>
                    vUv = uv;
                    `
                );

                shader.fragmentShader = `
                    uniform vec3 colorA;
                    uniform vec3 colorB;
                    varying vec2 vUv;

                    // Pseudo-random function
                    float random (in vec2 st) {
                        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                    }

                    // 2D Noise
                    float noise (in vec2 st) {
                        vec2 i = floor(st);
                        vec2 f = fract(st);

                        // Four corners in 2D of a tile
                        float a = random(i);
                        float b = random(i + vec2(1.0, 0.0));
                        float c = random(i + vec2(0.0, 1.0));
                        float d = random(i + vec2(1.0, 1.0));

                        vec2 u = f * f * (3.0 - 2.0 * f);

                        return mix(a, b, u.x) +
                                (c - a)* u.y * (1.0 - u.x) +
                                (d - b) * u.x * u.y;
                    }

                    // Fractal Brownian Motion
                    #define OCTAVES 4
                    float fbm (in vec2 st) {
                        float value = 0.0;
                        float amplitude = 0.5;
                        float frequency = 0.;
                        for (int i = 0; i < OCTAVES; i++) {
                            value += amplitude * noise(st);
                            st *= 2.;
                            amplitude *= 0.5;
                        }
                        return value;
                    }

                    ${shader.fragmentShader}
                `.replace(
                    '#include <color_fragment>',
                    `
                    #include <color_fragment>
                    
                    // Scale UVs for noise detail
                    vec2 st = vUv * 15.0; // Increased scale for more detail
                    float n = fbm(st);
                    
                    // Mix noise color
                    vec3 noiseColor = mix(colorB, colorA, n);
                    
                    // Apply to diffuse color (which is white base)
                    diffuseColor.rgb = noiseColor; 
                    `
                );
            };
        }
    }, []);

    // Initial color is green to fallback safely if shader doesn't compile immediately
    return <meshStandardMaterial ref={materialRef} color="#a8e063" />;
};

const AnimatedAnimal = ({ modelUri, animationMap, position, rotation, scale, action, isOpponent }) => {
    const group = useRef();
    const { scene, animations } = useGLTF(modelUri);
    const { actions, names } = useAnimations(animations, group);
    const [showHealEffect, setShowHealEffect] = useState(false);

    // Debug: Log available animations to find the correct names for Frog
    useEffect(() => {
        // console.log(`[3D] Loaded animations for ${isOpponent ? 'Opponent' : 'Player'}:`, names);

        // Enable Shadows on meshes
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [names, isOpponent, scene]);


    // Play Animations based on Action State
    useEffect(() => {
        // Map generic action (IDLE, ATTACK, HIT, DEATH) to specific model animation name
        // Default to IDLE if action not found or HIT (since HIT is procedural + color)
        let animKey = animationMap[action];

        // Handle random choice if array
        if (Array.isArray(animKey)) {
            animKey = animKey[Math.floor(Math.random() * animKey.length)];
        }

        const actionToPlay = actions[animKey];

        if (actionToPlay) {
            // Stop others
            Object.values(actions).forEach(a => {
                if (a !== actionToPlay) a.fadeOut(0.3);
            });

            // Play new
            actionToPlay.reset().fadeIn(0.3).play();

            // If Attack/Death, maybe clamp? For now loop is fine for Idle/Attack(sometimes)
            if (action === 'ATTACK' || action === 'HIT' || action === 'HEAL') {
                actionToPlay.setLoop(THREE.LoopOnce);
                actionToPlay.clampWhenFinished = true;
                // Auto reset to idle happens via parent state logic usually, 
                // but here parent sets 'ATTACK' for specific duration.
            } else if (action === 'DEATH') {
                actionToPlay.setLoop(THREE.LoopOnce);
                actionToPlay.clampWhenFinished = true;
            } else {
                actionToPlay.setLoop(THREE.LoopRepeat);
            }
        }
    }, [action, actions, animationMap]);

    // Visual Effects (Red Flash on HIT, Particles on HEAL)
    useEffect(() => {
        if (action === 'HIT') {
            setShowHealEffect(false);
            scene.traverse((child) => {
                if (child.isMesh) {
                    // Flash White using Emissive
                    child.material.emissive = new THREE.Color('white');
                    child.material.emissiveIntensity = 5; // Bright flash
                }
            });

            const timeout = setTimeout(() => {
                scene.traverse((child) => {
                    if (child.isMesh) {
                        child.material.emissive = new THREE.Color('black');
                        child.material.emissiveIntensity = 0;
                    }
                });
            }, 100); // 100ms flash

            return () => clearTimeout(timeout);
        } else if (action === 'HEAL') {
            setShowHealEffect(true);
            const timeout = setTimeout(() => {
                setShowHealEffect(false);
            }, 1500); // Particles last 1.5s
            return () => clearTimeout(timeout);
        } else {
            setShowHealEffect(false);
        }
    }, [action, scene]);

    // Procedural Shake Effects
    useFrame((state, delta) => {
        if (action === 'HIT' && group.current) {
            // Flash effect logic could go here if modifying material directly
            // Or simple shake
            group.current.position.x = position[0] + (Math.random() - 0.5) * 0.2;
        } else if (group.current) {
            // Reset position (dampened)
            group.current.position.x = position[0];
        }
    });

    return (
        <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
            <primitive object={scene} />
            {showHealEffect && <HealParticles count={20} />}
        </group>
    );
};

const BattleScene = ({ playerAction, opponentAction, myHp, opHp }) => {
    return (
        <>
            {/* Natural Outdoor Lighting */}
            <hemisphereLight intensity={0.6} groundColor="#a8e063" skyColor="#00B4DB" />
            <directionalLight
                position={[-5, 12, 5]} // Angled for better shadows on ground
                intensity={1.5}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={0.1}
                shadow-camera-far={50}
                shadow-camera-left={-20} // Widen shadow camera
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
            />

            {/* Trees Removed (User Request) */}

            {/* Player: WOLF */}
            <AnimatedAnimal
                modelUri={WolfModel}
                animationMap={{
                    IDLE: 'Idle',
                    ATTACK: 'Attack',
                    DEATH: 'Death',
                    HIT: ['Idle_HitReact_Right', 'Idle_HitReact_Left'],
                    HEAL: 'Idle' // Re-use Idle for Heal but with Green Flash
                }}
                position={[-1.5, -2, 5]} // Moved back a bit more (4 -> 5)
                rotation={[0, 3.0, 0]}
                scale={[1.5, 1.5, 1.5]}
                action={playerAction}
                isOpponent={false}
            />

            {/* Opponent: FROG */}
            <AnimatedAnimal
                modelUri={FrogModel}
                animationMap={{
                    IDLE: 'FrogArmature|Frog_Idle',
                    ATTACK: 'FrogArmature|Frog_Attack',
                    DEATH: 'FrogArmature|Frog_Death',
                    HEAL: 'FrogArmature|Frog_Idle'
                }}
                position={[1.5, -2, -2]}
                rotation={[0, -0.5, 0]}
                scale={[0.3, 0.3, 0.3]}
                action={opponentAction}
                isOpponent={true}
            />

            {/* Environment: Grass Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                {useGrassMaterial()}
            </mesh>

            {/* Grid removed as requested */}
        </>
    );
};

// --- Main Screen ---

import { LinearGradient } from 'expo-linear-gradient';

// --- Frutiger Aero Components ---

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// 1. Glossy Button with "Gel" shine
const GlossyButton = ({ onPress, title, colors, style, disabled }) => (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.glossyBtnContainer, style, disabled && { opacity: 0.5 }]}>
        <LinearGradient
            colors={colors || ['#4facfe', '#00f2fe']} // Default Blue Sky
            style={styles.glossyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            {/* Top Shine (The "Gel" effect) */}
            <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.1)']}
                style={styles.topShine}
            />
            <Text style={styles.glossyBtnText}>{title}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

// 2. Glass Panel for HUD
const GlassPanel = ({ children, style }) => (
    <View style={[styles.glassPanel, style]}>
        {/* White Border Overlay for Glass feel */}
        <View style={styles.glassBorder} />
        {children}
    </View>
);

// 3. Animated Health Bar
const HealthBar = ({ hp }) => {
    const animatedHp = useRef(new Animated.Value(hp)).current;

    useEffect(() => {
        Animated.timing(animatedHp, {
            toValue: hp,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [hp]);

    const widthInterpolation = animatedHp.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    const color1 = hp < 30 ? '#ff4b1f' : '#11998e';
    const color2 = hp < 30 ? '#ff9068' : '#38ef7d';

    return (
        <View style={styles.hpBarTube}>
            <AnimatedLinearGradient
                colors={[color1, color2]}
                style={[styles.hpBarLiquid, { width: widthInterpolation }]}
            />
            <View style={styles.tubeShine} />
        </View>
    );
};


// --- Main Screen ---

export const BattleScreen = () => {
    const [gameState, setGameState] = useState('LOBBY');

    // Stats
    const [myHp, setMyHp] = useState(100);
    const [opHp, setOpHp] = useState(100);
    const [myLevel, setMyLevel] = useState(12);
    const [opLevel, setOpLevel] = useState(10);

    // Inventory
    const [inventory, setInventory] = useState({
        potion: 3
    });

    // Animation States
    const [playerAction, setPlayerAction] = useState('IDLE');
    const [opponentAction, setOpponentAction] = useState('IDLE');
    const [isDefending, setIsDefending] = useState(false);

    const startBattle = () => {
        setGameState('BATTLE');
        // Ensure fresh state on start
        setMyHp(100);
        setOpHp(100);
        setOpLevel(Math.floor(Math.random() * 5) + 10); // Random Level 10-14
        setPlayerAction('IDLE');
        setOpponentAction('IDLE');
        setBattleMsg("Que voulez-vous faire ?");
        // Reset Potions for demo if needed, or keep persistent? Reset for now.
        setInventory({ potion: 3 });
        setIsDefending(false);
    };

    const resetToLobby = () => {
        setGameState('LOBBY');
        // Reset visuals immediately so background 3D scene looks "peaceful"
        setPlayerAction('IDLE');
        setOpponentAction('IDLE');
        setMyHp(100);
        setOpHp(100);
        setBattleMsg("Que voulez-vous faire ?");
        setIsDefending(false);
    };

    // Battle Logic
    const [battleMsg, setBattleMsg] = useState("Que voulez-vous faire ?");

    const opponentTurn = () => {
        setTimeout(() => {
            setOpponentAction('IDLE');
            // 3. Opponent Attacks Back
            setOpponentAction('ATTACK');
            setBattleMsg("L'adversaire attaque !");

            setTimeout(() => {
                setOpponentAction('IDLE');

                // Player takes dmg
                let dmg2 = 10 + Math.floor(Math.random() * 10);

                // Defense Logic
                if (isDefending) {
                    dmg2 = Math.floor(dmg2 / 2);
                    setBattleMsg("Défense réussie !");
                }

                const newMyHp = Math.max(0, myHp - dmg2);
                setMyHp(newMyHp);

                setPlayerAction('HIT');
                setBattleMsg(isDefending ? `Vous bloquez ! -${dmg2} PV` : `Vous perdez ${dmg2} PV !`);

                // Reset defense after turn
                setIsDefending(false);

                if (newMyHp <= 0) {
                    setTimeout(() => {
                        setPlayerAction('DEATH');
                        setTimeout(() => setGameState('RESULT'), 2500);
                    }, 500);
                } else {
                    setTimeout(() => {
                        setPlayerAction('IDLE');
                        setBattleMsg("Que voulez-vous faire ?");
                    }, 1000);
                }
            }, 800);

        }, 1000);
    };

    const usePotion = () => {
        if (playerAction !== 'IDLE' || opponentAction !== 'IDLE') return;
        if (inventory.potion <= 0) {
            setBattleMsg("Plus de potions !");
            setTimeout(() => setBattleMsg("Que voulez-vous faire ?"), 1000);
            return;
        }

        setInventory(prev => ({ ...prev, potion: prev.potion - 1 }));

        // HEAL Logic
        setIsDefending(false); // Reset defense if healing (though shouldn't be active)
        setPlayerAction('HEAL');
        setBattleMsg("Vous utilisez une Potion !");

        setTimeout(() => {
            const healAmount = 30;
            setMyHp(prev => Math.min(100, prev + healAmount));
            setBattleMsg(`Vous récupérez ${healAmount} PV !`);

            // Wait for heal anim
            setTimeout(() => {
                setPlayerAction('IDLE');
                opponentTurn();
            }, 1000);
        }, 500);
    };

    const defend = () => {
        if (playerAction !== 'IDLE' || opponentAction !== 'IDLE') return;

        setIsDefending(true);
        setBattleMsg("Vous vous mettez en garde !");

        // Short delay before opponent turn
        setTimeout(() => {
            opponentTurn();
        }, 1000);
    };

    const attack = () => {
        if (playerAction !== 'IDLE' || opponentAction !== 'IDLE') return;

        // 1. Player Attacks
        setIsDefending(false);
        setPlayerAction('ATTACK');
        setBattleMsg("Vous utilisez Charge !");

        setTimeout(() => {
            setPlayerAction('IDLE');
            // Dmg logic
            const dmg = 15 + Math.floor(Math.random() * 10);
            const newOpHp = Math.max(0, opHp - dmg);
            setOpHp(newOpHp);

            // 2. Opponent get Hit
            setOpponentAction('HIT');
            setBattleMsg(`L'adversaire perd ${dmg} PV !`);

            if (newOpHp <= 0) {
                setTimeout(() => {
                    setOpponentAction('DEATH');
                    setBattleMsg("L'adversaire est K.O. !");
                    setTimeout(() => setGameState('RESULT'), 2500);
                }, 500);
                return;
            }

            opponentTurn();

        }, 500);
    };

    return (
        <LinearGradient
            colors={['#87CEEB', '#E0F7FA']} // Sky Blue background
            style={styles.container}
        >
            {/* TOP SCREEN: 3D ACTION */}
            <View style={styles.topScreen}>
                {/* Dynamic Sky Background for 3D Scene */}
                <LinearGradient
                    colors={['#2980B9', '#6DD5FA', '#FFFFFF']} // Realistic Sky Gradient
                    style={StyleSheet.absoluteFillObject}
                />
                <Canvas shadows camera={{ position: [0, 3, 10], fov: 45 }}>
                    <BattleScene
                        myColor={COLORS.neonGreen}
                        opponentColor={COLORS.danger}
                        playerAction={playerAction}
                        opponentAction={opponentAction}
                        myHp={myHp}
                        opHp={opHp}
                    />
                </Canvas>

                {/* HUD Overlay with Glassmorphism */}
                <View style={styles.hudOverlay}>
                    {/* Opponent HP */}
                    <GlassPanel style={styles.hpBoxOpponent}>
                        <View style={styles.nameRow}>
                            <Text style={styles.hpName}>Toxic Frog</Text>
                            <Text style={styles.lvlText}>Lv.{opLevel}</Text>
                        </View>
                        <View style={styles.hpRow}>
                            <Text style={styles.hpText}>PV</Text>
                            <HealthBar hp={opHp} />
                        </View>
                        <Text style={styles.hpNum}>{opHp}/100</Text>
                    </GlassPanel>

                    {/* Player HP */}
                    <GlassPanel style={styles.hpBoxPlayer}>
                        <View style={styles.nameRow}>
                            <Text style={styles.hpName}>Alpha Wolf</Text>
                            <Text style={styles.lvlText}>Lv.{myLevel}</Text>
                        </View>
                        <View style={styles.hpRow}>
                            <Text style={styles.hpText}>PV</Text>
                            <HealthBar hp={myHp} />
                        </View>
                        <Text style={styles.hpNum}>{myHp}/100</Text>
                    </GlassPanel>
                </View>
            </View>

            {/* SPLIT BAR (Aero Styling) */}
            <View style={styles.hingeContainer}>
                <LinearGradient colors={['#ccc', '#fff', '#ccc']} style={styles.hingeChrome} />
            </View>

            {/* BOTTOM SCREEN: TACTICAL CONTROLS */}
            <GlassPanel style={styles.bottomScreen}>
                {gameState === 'LOBBY' ? (
                    <View style={styles.center}>
                        <Text style={styles.textAero}>En attente d'un adversaire...</Text>
                        <GlossyButton title="COMMENCER DUEL" onPress={startBattle} style={{ width: 220 }} />
                    </View>
                ) : gameState === 'RESULT' ? (
                    <View style={styles.center}>
                        <Text style={styles.textWin}>{myHp > 0 ? "VICTOIRE !" : "DÉFAITE..."}</Text>
                        <GlossyButton title="RETOUR" onPress={resetToLobby} colors={['#FF8008', '#FFC837']} style={{ width: 200 }} />
                    </View>
                ) : (
                    // BATTLE CONTROLS
                    <View style={styles.controlsGrid}>
                        {/* Info Box - Digital Screen Look */}
                        <View style={styles.digitalScreen}>
                            <LinearGradient colors={['#000', '#222']} style={StyleSheet.absoluteFillObject} />
                            <Text style={styles.digitalText}>{battleMsg}</Text>
                        </View>

                        <View style={styles.actions}>
                            <GlossyButton
                                title="ATTAQUE"
                                onPress={attack}
                                disabled={battleMsg !== "Que voulez-vous faire ?"}
                                colors={['#FF416C', '#FF4B2B']} // Red
                                style={styles.gridBtn}
                            />
                            <GlossyButton
                                title="DÉFENSE"
                                onPress={defend}
                                disabled={battleMsg !== "Que voulez-vous faire ?"}
                                colors={['#42275a', '#734b6d']} // Purple
                                style={styles.gridBtn}
                            />
                            <GlossyButton
                                title={`POTION (${inventory.potion})`} // Items
                                onPress={usePotion}
                                disabled={battleMsg !== "Que voulez-vous faire ?"}
                                colors={['#FDC830', '#F37335']} // Orange
                                style={styles.gridBtn}
                            />
                            <GlossyButton
                                title="FUITE"
                                onPress={() => setGameState('LOBBY')}
                                colors={['#bdc3c7', '#2c3e50']} // Grey
                                style={styles.gridBtn}
                            />
                        </View>
                    </View>
                )}
            </GlassPanel>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40, // More space for notches
    },
    topScreen: {
        flex: 1, // Balanced 1:1 split
        margin: 10,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    bottomScreen: {
        flex: 1, // More space for controls
        margin: 10,
        borderRadius: 20,
        padding: SPACING.m,
        paddingBottom: 50, // Lift content up significantly
        overflow: 'hidden',
        justifyContent: 'flex-start', // Align to top
    },
    glassPanel: {
        backgroundColor: 'rgba(255, 255, 255, 0.65)', // Milky glass
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.9)',
        overflow: 'hidden', // Contain the blur/border effects
    },
    glassBorder: {
        ...StyleSheet.absoluteFillObject,
        borderColor: 'rgba(255,255,255,0.8)',
        borderWidth: 2,
        borderRadius: 15,
    },
    hingeContainer: {
        height: 20,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    hingeChrome: {
        height: 10,
        borderRadius: 5,
        opacity: 0.8,
    },

    // Glossy Buttons
    glossyBtnContainer: {
        height: 50,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden',
    },
    glossyGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topShine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%', // Top half only
        borderBottomLeftRadius: 25, // Curve it
        borderBottomRightRadius: 25,
    },
    glossyBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowRadius: 2,
        zIndex: 1,
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto', // Aero Font
        fontStyle: 'italic',
    },
    gridBtn: {
        width: '48%',
        marginBottom: 10,
    },

    // HUD
    hudOverlay: {
        ...StyleSheet.absoluteFillObject,
        padding: 15,
        justifyContent: 'space-between',
    },
    hpBoxOpponent: {
        padding: 10,
        width: 170, // Slightly wider for Level
        alignSelf: 'flex-start',
    },
    hpBoxPlayer: {
        padding: 10,
        width: 180,
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 5,
    },
    hpName: {
        fontWeight: '800',
        fontSize: 14,
        color: '#333',
        textShadowColor: 'white',
        textShadowRadius: 1,
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto', // Aero Font
        fontStyle: 'italic',
    },
    lvlText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#555',
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto', // Aero Font
        fontStyle: 'italic',
    },
    hpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    hpText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#555',
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto',
    },
    hpBarTube: {
        flex: 1,
        height: 14,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 7,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    hpBarLiquid: {
        height: '100%',
        borderRadius: 7,
    },
    tubeShine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    hpNum: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 2,
        color: '#444',
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto',
    },

    // Controls
    controlsGrid: {
        flex: 1,
        justifyContent: 'center', // Center content in the available space
        gap: 20, // Add space between info box and buttons
    },
    infoBox: {
        marginBottom: 10,
    },
    digitalScreen: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#555',
        marginBottom: 15,
        minHeight: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    digitalText: {
        color: '#00ff00', // Matrix Green
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto', // Aero Font
        fontStyle: 'italic',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: '#00ff00',
        textShadowRadius: 5,
    },
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    // General
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textAero: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textShadowColor: 'white',
        textShadowRadius: 2,
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto', // Aero Font
        fontStyle: 'italic',
    },
    textWin: {
        color: '#E0F7FA',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textShadowColor: '#00B4DB',
        textShadowRadius: 10,
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto', // Aero Font
        fontStyle: 'italic',
    },
});
