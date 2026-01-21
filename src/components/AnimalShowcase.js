import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

const RARITY_COLORS = {
    Common: COLORS.ink,
    Rare: '#3498db',
    Legendary: COLORS.neonGold,
};

const AnimalSlot = ({ animal, isEmpty, onPress }) => {
    if (isEmpty) {
        return (
            <TouchableOpacity style={styles.emptySlot} onPress={onPress}>
                <Ionicons name="add" size={24} color={COLORS.paperDark} />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.animalSlot} onPress={onPress}>
            <Text style={styles.emoji}>{animal.emoji}</Text>
            <Text style={styles.animalName} numberOfLines={1}>{animal.name}</Text>
            <Text style={[styles.rarity, { color: RARITY_COLORS[animal.rarity] || COLORS.ink }]}>
                {animal.rarity}
            </Text>
            {animal.shiny && (
                <View style={styles.shinyBadge}>
                    <Ionicons name="sparkles" size={12} color={COLORS.neonGold} />
                </View>
            )}
        </TouchableOpacity>
    );
};

export const AnimalShowcase = ({
    showcaseAnimals = [],
    allAnimals = [],
    onEditShowcase
}) => {
    // Get full animal objects for showcase
    const showcaseData = showcaseAnimals.map(id =>
        allAnimals.find(a => a.id === id)
    ).filter(Boolean);

    // Fill empty slots
    const slots = [...showcaseData];
    while (slots.length < 3) {
        slots.push(null);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Ma Vitrine</Text>
                <TouchableOpacity onPress={onEditShowcase}>
                    <Ionicons name="settings-outline" size={20} color={COLORS.rust} />
                </TouchableOpacity>
            </View>

            <View style={styles.slotsContainer}>
                {slots.map((animal, index) => (
                    <AnimalSlot
                        key={index}
                        animal={animal}
                        isEmpty={!animal}
                        onPress={onEditShowcase}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.s,
        paddingLeft: SPACING.s,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.ink,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.neonGold,
        paddingLeft: SPACING.s,
    },
    slotsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.s,
    },
    animalSlot: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: SPACING.m,
        padding: SPACING.m,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.neonGreen,
        position: 'relative',
    },
    emptySlot: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: SPACING.m,
        padding: SPACING.m,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.paperDark,
        borderStyle: 'dashed',
        minHeight: 100,
    },
    emoji: {
        fontSize: 32,
        marginBottom: SPACING.xs,
    },
    animalName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.ink,
        textAlign: 'center',
    },
    rarity: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 2,
    },
    shinyBadge: {
        position: 'absolute',
        top: SPACING.xs,
        right: SPACING.xs,
    },
});
