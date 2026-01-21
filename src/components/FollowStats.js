import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export const FollowStats = ({
    followers,
    following,
    onFollowersPress,
    onFollowingPress
}) => {
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.statItem} onPress={onFollowersPress}>
                <Text style={styles.statValue}>{formatNumber(followers)}</Text>
                <Text style={styles.statLabel}>Abonnés</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.statItem} onPress={onFollowingPress}>
                <Text style={styles.statValue}>{formatNumber(following)}</Text>
                <Text style={styles.statLabel}>Abonnements</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: SPACING.m,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        marginVertical: SPACING.s,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    statLabel: {
        fontSize: 13,
        color: COLORS.rust,
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: COLORS.paperDark,
    },
});
