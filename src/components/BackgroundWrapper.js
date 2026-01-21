import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

export const BackgroundWrapper = ({ children, style }) => {
    return (
        <View style={[styles.container, style]}>
            {/* 1. Base Paper Layer */}
            <View style={styles.paperLayer} />

            {/* 2. Holographic Gradient Overlay */}
            <LinearGradient
                colors={[COLORS.hologramOverlay, 'transparent', COLORS.hologramOverlay]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hologramLayer}
                pointerEvents="none"
            />

            {/* 3. Scanline/Grid Effect (Optional, simulated with simple lines or borders) */}

            {/* Content */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.paper, // Fallback
    },
    paperLayer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.paper,
        // In a real app, we'd add an ImageBackground here with a noise texture
    },
    hologramLayer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.6,
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
});
