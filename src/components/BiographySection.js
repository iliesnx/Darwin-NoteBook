import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export const BiographySection = ({
    username,
    rank,
    biography,
    onEditPress
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.rank}>{rank}</Text>

            {biography ? (
                <Text style={styles.biography}>{biography}</Text>
            ) : (
                <Text style={styles.biographyPlaceholder}>Ajouter une biographie...</Text>
            )}

            <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
                <Ionicons name="pencil" size={16} color={COLORS.paper} />
                <Text style={styles.editButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        marginBottom: SPACING.m,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    rank: {
        fontSize: 14,
        color: COLORS.rust,
        marginBottom: SPACING.s,
    },
    biography: {
        fontSize: 14,
        color: COLORS.ink,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: SPACING.m,
    },
    biographyPlaceholder: {
        fontSize: 14,
        color: COLORS.rust,
        fontStyle: 'italic',
        marginBottom: SPACING.m,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.neonGreen,
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
        borderRadius: 20,
        gap: SPACING.xs,
    },
    editButtonText: {
        color: COLORS.paper,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
