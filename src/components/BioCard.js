import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export const BioCard = ({ animal, onPress }) => {
    const isRare = animal.rarity === 'Rare' || animal.rarity === 'Legendary';
    const borderColor = isRare ? COLORS.neonGold : COLORS.ink;

    return (
        <TouchableOpacity onPress={onPress} style={[styles.card, { borderColor }]}>
            <View style={styles.imageContainer}>
                {/* Placeholder for captured image */}
                <View style={styles.placeholderImage}>
                    <Text style={styles.emoji}>{animal.emoji || '🐾'}</Text>
                </View>
                {animal.shiny && <View style={styles.shinyBadge}><Text>✨</Text></View>}
            </View>

            <View style={styles.info}>
                <Text style={styles.name}>{animal.name}</Text>
                <Text style={styles.rarity}>{animal.rarity}</Text>

                <View style={styles.statsRow}>
                    <Text style={styles.stat}>⚡ {animal.stats?.speed}</Text>
                    <Text style={styles.stat}>🛡️ {animal.stats?.defense}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: SPACING.s,
        borderWidth: 2,
        margin: SPACING.xs,
        width: '45%', // Approx 2 columns
        overflow: 'hidden',
        elevation: 3, // Shadow for Android
        shadowColor: COLORS.ink, // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    imageContainer: {
        height: 100,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderImage: {
        // In real app, Image component
    },
    emoji: {
        fontSize: 40,
    },
    shinyBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    info: {
        padding: SPACING.s,
    },
    name: {
        fontWeight: 'bold',
        color: COLORS.ink,
        fontSize: 14,
    },
    rarity: {
        fontSize: 10,
        color: COLORS.rust,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stat: {
        fontSize: 12,
        color: COLORS.ink,
    },
});
