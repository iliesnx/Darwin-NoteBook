import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { COLORS, SPACING } from '../constants/theme';
import { MOCK_ANIMALS } from '../data/mockCollection';

// --- 3D Components ---

const RotatingCube = ({ color, position }) => {
    const mesh = useRef(null);
    useFrame((state, delta) => {
        if (mesh.current) mesh.current.rotation.y += delta;
    });
    return (
        <mesh position={position} ref={mesh}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

const BouncingSphere = ({ color, position }) => {
    const mesh = useRef(null);
    useFrame((state) => {
        if (mesh.current) {
            const t = state.clock.getElapsedTime();
            mesh.current.position.y = position[1] + Math.sin(t * 2) * 0.2;
        }
    });
    return (
        <mesh position={position} ref={mesh}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

const BattleScene = ({ myColor, opponentColor }) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 5, 5]} intensity={1} />

            {/* My Creature (Left/Bottom) */}
            <RotatingCube color={myColor || 'green'} position={[-1.5, -0.5, 0]} />

            {/* Opponent (Right/Top) */}
            <BouncingSphere color={opponentColor || 'red'} position={[1.5, 1, -1]} />
        </>
    );
};

// --- Main Screen ---

export const BattleScreen = () => {
    const [gameState, setGameState] = useState('LOBBY'); // LOBBY, BATTLE, RESULT
    const [log, setLog] = useState([]);

    // Mock Data for colors (to represent types)
    const TYPE_COLORS = { Forest: '#2E8B57', City: '#808080', Coast: '#00BFFF', Desert: '#EDC9AF' };

    const startBattle = () => {
        setGameState('BATTLE');
        setLog(["Battle Started!", "Select a move..."]);
    };

    const attack = () => {
        setLog(prev => [...prev, "You attacked!", "Opponent took damage."]);
        // Mock end battle logic
        setTimeout(() => {
            setLog(prev => [...prev, "Victory!"]);
            setGameState('RESULT');
        }, 2000);
    };

    return (
        <View style={styles.container}>
            {/* TOP SCREEN: 3D ACTION */}
            <View style={styles.topScreen}>
                <Canvas>
                    <BattleScene myColor={COLORS.neonGreen} opponentColor={COLORS.danger} />
                </Canvas>
                {/* HUD Overlay */}
                <View style={styles.hud}>
                    <Text style={styles.hudText}>PvP Arena</Text>
                </View>
            </View>

            {/* SPLIT BAR */}
            <View style={styles.hinge} />

            {/* BOTTOM SCREEN: TACTICAL CONTROLS */}
            <View style={styles.bottomScreen}>
                {gameState === 'LOBBY' ? (
                    <View style={styles.center}>
                        <Text style={styles.text}>Waiting for challenger...</Text>
                        <TouchableOpacity style={styles.btnBig} onPress={startBattle}>
                            <Text style={styles.btnText}>START DUEL</Text>
                        </TouchableOpacity>
                    </View>
                ) : gameState === 'RESULT' ? (
                    <View style={styles.center}>
                        <Text style={styles.textWin}>VICTORY!</Text>
                        <TouchableOpacity style={styles.btnBig} onPress={() => setGameState('LOBBY')}>
                            <Text style={styles.btnText}>RETURN</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // BATTLE CONTROLS
                    <View style={styles.controlsGrid}>
                        <View style={styles.logBox}>
                            {log.map((l, i) => <Text key={i} style={styles.logLine}>{l}</Text>)}
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.actionBtn} onPress={attack}>
                                <Text style={styles.actionText}>ATTACK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.base }]} onPress={() => setLog(p => [...p, "Defending..."])}>
                                <Text style={styles.actionText}>DEFEND</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FFD700' }]} onPress={() => setLog(p => [...p, "Using Item..."])}>
                                <Text style={[styles.actionText, { color: COLORS.ink }]}>ITEM</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.ink }]} onPress={() => setGameState('LOBBY')}>
                                <Text style={styles.actionText}>RUN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        paddingTop: 10,
    },
    topScreen: {
        flex: 1, // 50% height
        backgroundColor: '#000',
        borderRadius: 20,
        margin: 5,
        marginBottom: 0,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#444',
    },
    bottomScreen: {
        flex: 1, // 50% height
        backgroundColor: COLORS.paper,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        margin: 5,
        marginTop: 0,
        borderRadius: 20,
        padding: SPACING.m,
        borderWidth: 4,
        borderColor: '#444',
        borderTopWidth: 0,
    },
    hinge: {
        height: 30,
        backgroundColor: '#111',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#333',
        marginHorizontal: 10,
        borderRadius: 5,
    },
    hud: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    hudText: {
        color: COLORS.neonGreen,
        fontWeight: 'bold',
        fontSize: 18,
        textShadowColor: COLORS.neonGreen,
        textShadowRadius: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: COLORS.ink,
        fontSize: 18,
        marginBottom: 20,
    },
    textWin: {
        color: COLORS.neonGold,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    btnBig: {
        backgroundColor: COLORS.ink,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    btnText: {
        color: COLORS.paper,
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Controls
    controlsGrid: {
        flex: 1,
    },
    logBox: {
        height: 100,
        backgroundColor: '#eee',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    logLine: {
        fontSize: 12,
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'space-between',
    },
    actionBtn: {
        width: '48%',
        height: 55,
        backgroundColor: COLORS.danger,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.1)',
        marginBottom: 10,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
