import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BackgroundWrapper } from '../components/BackgroundWrapper';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen = () => {
    return (
        <BackgroundWrapper>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.avatarLarge} />
                        <Text style={styles.username}>Explorer_One</Text>
                        <Text style={styles.rank}>Rank: Master Naturalist</Text>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>124</Text>
                                <Text style={styles.statLabel}>Captures</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>45</Text>
                                <Text style={styles.statLabel}>Tamed</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>1.2k</Text>
                                <Text style={styles.statLabel}>Bio-Tokens</Text>
                            </View>
                        </View>
                    </View>

                    {/* Daily Tasks */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Daily Missions</Text>

                        <View style={styles.taskCard}>
                            <Ionicons name="checkbox-outline" size={24} color={COLORS.rust} />
                            <View style={styles.taskInfo}>
                                <Text style={styles.taskText}>Capture 1 Insect Type</Text>
                                <Text style={styles.rewardText}>Reward: 1x Capture Net</Text>
                            </View>
                        </View>

                        <View style={styles.taskCard}>
                            <Ionicons name="square-outline" size={24} color={COLORS.rust} />
                            <View style={styles.taskInfo}>
                                <Text style={styles.taskText}>Win 3 Battles</Text>
                                <Text style={styles.rewardText}>Reward: 50 Bio-Tokens</Text>
                            </View>
                        </View>
                    </View>

                    {/* Marketplace */}
                    <View style={styles.section}>
                        <View style={styles.marketHeader}>
                            <Text style={styles.sectionTitle}>Black Market</Text>
                            <TouchableOpacity>
                                <Text style={styles.link}>View All</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.marketRow}>
                            <View style={styles.marketItem}>
                                <Text style={styles.marketEmoji}>🥚</Text>
                                <Text style={styles.marketName}>Mystery Egg</Text>
                                <Text style={styles.price}>500 BT</Text>
                            </View>
                            <View style={styles.marketItem}>
                                <Text style={styles.marketEmoji}>⚡</Text>
                                <Text style={styles.marketName}>Time Battery</Text>
                                <Text style={styles.price}>100 BT</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </BackgroundWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    scrollContent: {
        paddingBottom: 100,
        paddingHorizontal: SPACING.m,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.neonGreen,
        marginBottom: SPACING.s,
        borderWidth: 4,
        borderColor: COLORS.paperDark,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    rank: {
        fontSize: 14,
        color: COLORS.rust,
        marginBottom: SPACING.m,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: SPACING.s,
        padding: SPACING.m,
    },
    statItem: {
        alignItems: 'center',
    },
    statVal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.rust,
    },
    section: {
        marginBottom: SPACING.l,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.ink,
        marginBottom: SPACING.s,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.neonGold,
        paddingLeft: SPACING.s,
    },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.paper,
        padding: SPACING.m,
        borderRadius: SPACING.s,
        marginBottom: SPACING.s,
        elevation: 2,
    },
    taskInfo: {
        marginLeft: SPACING.m,
    },
    taskText: {
        fontSize: 16,
        color: COLORS.ink,
    },
    rewardText: {
        fontSize: 12,
        color: COLORS.success,
        fontWeight: 'bold',
    },
    marketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    link: {
        color: COLORS.neonGreen,
        fontWeight: 'bold',
    },
    marketRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    marketItem: {
        width: '48%',
        backgroundColor: COLORS.cyberBlack,
        borderRadius: SPACING.s,
        padding: SPACING.m,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.neonGreen,
    },
    marketEmoji: {
        fontSize: 32,
        marginBottom: SPACING.s,
    },
    marketName: {
        color: COLORS.neonGreen,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        color: COLORS.neonGold,
        fontWeight: 'bold',
    },
});
