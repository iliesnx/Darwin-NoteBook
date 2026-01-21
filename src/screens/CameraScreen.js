import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { VisionService } from '../services/VisionService';

export const CameraScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedAnimal, setCapturedAnimal] = useState(null);
    const [tamingTimer, setTamingTimer] = useState(0);
    const [isTaming, setIsTaming] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const cameraRef = useRef(null);

    // Solarpunk HUD Elements
    const HUDOverlay = () => (
        <View style={styles.hudContainer} pointerEvents="none">
            {/* Corner Accents */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Center Crosshair */}
            <View style={styles.crosshair}>
                <View style={styles.crosshairLineV} />
                <View style={styles.crosshairLineH} />
            </View>
        </View>
    );

    const capturePhoto = async () => {
        if (cameraRef.current) {
            try {
                // Real Capture
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
                console.log("[Camera] Captured:", photo.uri);
                startTamingProcess(photo.uri);
            } catch (e) {
                console.error(e);
                Alert.alert("Error", "Could not capture photo.");
            }
        }
    };

    const startTamingProcess = async (uri) => {
        setIsAnalyzing(true); // Start Loading UI

        // Analyze Image (Async)
        // We delay slightly to let UI render if needed, and to ensure model is loaded.
        const creature = await VisionService.analyzeImage(uri);

        setIsAnalyzing(false); // Stop Loading UI
        setCapturedAnimal(creature);

        setIsTaming(true); // Start Taming Gameplay

        // Difficulty based on Rarity (returned by AI)
        const isRare = creature.rarity === 'Rare' || creature.rarity === 'Legendary';
        const time = isRare ? 10 : 3;
        setTamingTimer(time);
    };

    useEffect(() => {
        let interval;
        if (isTaming && tamingTimer > 0) {
            interval = setInterval(() => {
                setTamingTimer((prev) => prev - 1);
            }, 1000);
        } else if (isTaming && tamingTimer === 0) {
            setIsTaming(false);

            // Taming Complete - Save Capture
            const saveCapture = async () => {
                if (!capturedAnimal) return;

                try {
                    // 1. Get existing collection
                    const stored = await AsyncStorage.getItem('user_collection');
                    const currentCollection = stored ? JSON.parse(stored) : [];

                    // 2. Add new animal
                    const updatedCollection = [...currentCollection, capturedAnimal];

                    // 3. Save back
                    await AsyncStorage.setItem('user_collection', JSON.stringify(updatedCollection));

                    Alert.alert(
                        "DNA Acquired!",
                        `You have successfully tamed a ${capturedAnimal.name} (${capturedAnimal.scientificName}).`
                    );
                } catch (e) {
                    console.error("Failed to save creature", e);
                }
            };

            saveCapture();
        }
        return () => clearInterval(interval);
    }, [isTaming, tamingTimer, capturedAnimal]);

    const useAccelerator = () => {
        setTamingTimer(0);
    };

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.button}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isAnalyzing ? (
                // Analyzing State
                <View style={styles.tamingContainer}>
                    <LinearGradient
                        colors={[COLORS.cyberBlack, COLORS.ink]}
                        style={StyleSheet.absoluteFill}
                    />
                    <Text style={styles.tameTitle}>SCANNING BIO-DATA...</Text>
                    <View style={styles.timerCircle}>
                        <Text style={[styles.timerText, { fontSize: 24 }]}>...</Text>
                    </View>
                    <Text style={styles.statusText}>Identifying Species...</Text>
                </View>
            ) : isTaming ? (
                // Taming Mode (Holographic Overlay)
                <View style={styles.tamingContainer}>
                    <LinearGradient
                        colors={[COLORS.cyberBlack, COLORS.ink]}
                        style={StyleSheet.absoluteFill}
                    />
                    <Text style={styles.tameTitle}>Subject Identified: {capturedAnimal?.name}</Text>
                    <View style={styles.timerCircle}>
                        <Text style={styles.timerText}>{tamingTimer}s</Text>
                    </View>
                    <Text style={styles.statusText}>Taming in progress...</Text>

                    <TouchableOpacity style={styles.acceleratorButton} onPress={useAccelerator}>
                        <Text style={styles.acceleratorText}>⚡ USE ACCELERATOR</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Camera Mode
                <View style={{ flex: 1 }}>
                    <CameraView style={styles.camera} ref={cameraRef} facing="back" />
                    <HUDOverlay />
                    <View style={styles.controlsContainer}>
                        <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
                            <View style={styles.captureInner} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.cyberBlack,
    },
    camera: {
        flex: 1,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: COLORS.paper,
    },
    button: {
        alignSelf: 'center',
        padding: SPACING.m,
        backgroundColor: COLORS.neonGreen,
        borderRadius: SPACING.s,
    },
    buttonText: {
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    // HUD
    hudContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: COLORS.neonGreen,
        borderWidth: 2,
    },
    cornerTL: { top: 40, left: 20, borderRightWidth: 0, borderBottomWidth: 0 },
    cornerTR: { top: 40, right: 20, borderLeftWidth: 0, borderBottomWidth: 0 },
    cornerBL: { bottom: 120, left: 20, borderRightWidth: 0, borderTopWidth: 0 },
    cornerBR: { bottom: 120, right: 20, borderLeftWidth: 0, borderTopWidth: 0 },

    crosshair: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crosshairLineV: { width: 2, height: 20, backgroundColor: COLORS.neonGold },
    crosshairLineH: { width: 20, height: 2, backgroundColor: COLORS.neonGold, position: 'absolute' },

    // Controls
    controlsContainer: {
        position: 'absolute',
        bottom: 30, // Above the tab bar which wraps this screen? 
        // Wait, tab bar is 90px height and floated. We need to be careful with layout.
        // The screen takes full height, but tab bar is absolute.
        // We should put the capture button HIGHER or center it if we are hiding tab bar?
        // Actually, the main Tab Button navigates HERE. 
        // We can put a "Real" capture button here or trigger immediately.
        // Let's put a distinct button for now.
        alignSelf: 'center',
        marginBottom: 100, // Clear the tab bar
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.paper,
    },
    captureInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.paper,
    },

    // Taming UI
    tamingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tameTitle: {
        color: COLORS.neonGreen,
        fontSize: 20,
        fontFamily: 'Courier',
        marginBottom: SPACING.xl,
    },
    timerCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: COLORS.neonGold,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    timerText: {
        color: COLORS.neonGold,
        fontSize: 48,
        fontWeight: 'bold',
    },
    statusText: {
        color: COLORS.paper,
        marginBottom: SPACING.xl,
    },
    acceleratorButton: {
        backgroundColor: COLORS.danger,
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
        borderRadius: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.paper,
    },
    acceleratorText: {
        color: COLORS.paper,
        fontWeight: 'bold',
    },
});
