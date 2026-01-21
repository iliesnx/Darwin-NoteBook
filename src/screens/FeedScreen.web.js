import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { BackgroundWrapper } from '../components/BackgroundWrapper';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const MOCK_POSTS = [
    { id: '1', user: 'EcoWarrior99', action: 'Captured a Neon Fox!', likes: 24, comments: 2, time: '2h ago', scope: 'GLOBAL' },
    { id: '2', user: 'SolarSage', action: 'Tamed a Legendary Solar Hawk.', likes: 156, comments: 45, time: '5h ago', scope: 'GLOBAL' },
    { id: '3', user: 'CityScout', action: 'Found a rare Glitch Moth in Sector 7.', likes: 89, comments: 12, time: '1d ago', scope: 'FRIENDS' },
];

export const FeedScreen = () => {
    const [viewMode, setViewMode] = useState('LIST');
    const [feedFilter, setFeedFilter] = useState('GLOBAL');

    const filteredPosts = MOCK_POSTS.filter(post =>
        feedFilter === 'GLOBAL' ? true : post.scope === 'FRIENDS'
    );

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <View style={styles.avatar} />
                <View>
                    <Text style={styles.username}>{item.user}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
            </View>

            <Text style={styles.postContent}>{item.action}</Text>

            <View style={styles.placeholderImage}>
                <Ionicons name="image-outline" size={48} color={COLORS.paper} />
            </View>

            <View style={styles.actions}>
                <View style={styles.actionBtn}>
                    <Ionicons name="heart-outline" size={20} color={COLORS.danger} />
                    <Text style={styles.actionText}>{item.likes}</Text>
                </View>
                <View style={styles.actionBtn}>
                    <Ionicons name="chatbubble-outline" size={20} color={COLORS.ink} />
                    <Text style={styles.actionText}>{item.comments}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <BackgroundWrapper>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Global Network</Text>
                    <TouchableOpacity
                        style={styles.toggleBtn}
                        onPress={() => setViewMode(viewMode === 'LIST' ? 'MAP' : 'LIST')}
                    >
                        <Ionicons
                            name={viewMode === 'LIST' ? 'map-outline' : 'list-outline'}
                            size={24}
                            color={COLORS.ink}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            feedFilter === 'GLOBAL' && styles.filterChipActive,
                        ]}
                        onPress={() => setFeedFilter('GLOBAL')}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                feedFilter === 'GLOBAL' && styles.filterChipTextActive,
                            ]}
                        >
                            Global
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            feedFilter === 'FRIENDS' && styles.filterChipActive,
                        ]}
                        onPress={() => setFeedFilter('FRIENDS')}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                feedFilter === 'FRIENDS' && styles.filterChipTextActive,
                            ]}
                        >
                            Amis
                        </Text>
                    </TouchableOpacity>
                </View>

                {viewMode === 'LIST' ? (
                    <FlatList
                        data={filteredPosts}
                        renderItem={renderPost}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                    />
                ) : (
                    <View style={styles.mapContainer}>
                        <View style={[styles.map, styles.webMapFallback]}>
                            <Ionicons name="map-outline" size={64} color={COLORS.neonGreen} />
                            <Text style={styles.webMapText}>La carte est disponible uniquement sur mobile</Text>
                            <Text style={styles.webMapSubtext}>Ouvrez le projet dans Expo Go pour voir la carte</Text>
                        </View>
                    </View>
                )}
            </View>
        </BackgroundWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.m,
        position: 'relative',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.ink,
        textAlign: 'center',
    },
    toggleBtn: {
        position: 'absolute',
        right: SPACING.m,
        padding: SPACING.s,
        backgroundColor: COLORS.neonGreen,
        borderRadius: SPACING.s,
    },
    list: {
        paddingHorizontal: SPACING.m,
        paddingBottom: 100,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: SPACING.s,
        gap: SPACING.s,
    },
    filterChip: {
        paddingHorizontal: SPACING.m,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.ink,
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
    filterChipActive: {
        backgroundColor: COLORS.neonGreen,
        borderColor: COLORS.neonGreen,
    },
    filterChipText: {
        color: COLORS.ink,
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: COLORS.ink,
        fontWeight: '700',
    },
    postCard: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: SPACING.s,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.ink,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.neonGreen,
        marginRight: SPACING.s,
    },
    username: {
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    time: {
        fontSize: 12,
        color: COLORS.rust,
    },
    postContent: {
        fontSize: 16,
        color: COLORS.ink,
        marginBottom: SPACING.s,
    },
    placeholderImage: {
        height: 150,
        backgroundColor: COLORS.ink,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SPACING.s,
        marginBottom: SPACING.s,
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        paddingTop: SPACING.s,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SPACING.l,
    },
    actionText: {
        marginLeft: 4,
        color: COLORS.ink,
    },
    mapContainer: {
        flex: 1,
        marginHorizontal: SPACING.m,
        marginBottom: 100,
        borderRadius: SPACING.m,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLORS.neonGold,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    webMapFallback: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: SPACING.m,
    },
    webMapText: {
        color: COLORS.neonGreen,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: SPACING.s,
    },
    webMapSubtext: {
        color: COLORS.paper,
        fontSize: 14,
        textAlign: 'center',
        marginTop: SPACING.s,
    },
});
