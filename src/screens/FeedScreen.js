import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { BackgroundWrapper } from '../components/BackgroundWrapper';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

// Only import native modules on native platforms
let MapView, Marker, UrlTile, Location;
if (Platform.OS !== 'web') {
    MapView = require('react-native-maps').default;
    Marker = require('react-native-maps').Marker;
    UrlTile = require('react-native-maps').UrlTile;
    Location = require('expo-location');
}

const MOCK_POSTS = [
    { id: '1', user: 'EcoWarrior99', action: 'Captured a Neon Fox!', likes: 24, comments: 2, time: '2h ago', lat: 48.8566, lon: 2.3522, scope: 'GLOBAL' },
    { id: '2', user: 'SolarSage', action: 'Tamed a Legendary Solar Hawk.', likes: 156, comments: 45, time: '5h ago', lat: 48.8606, lon: 2.3376, scope: 'GLOBAL' },
    { id: '3', user: 'CityScout', action: 'Found a rare Glitch Moth in Sector 7.', likes: 89, comments: 12, time: '1d ago', lat: 48.8529, lon: 2.3499, scope: 'FRIENDS' },
];

export const FeedScreen = () => {
    const [viewMode, setViewMode] = useState('LIST'); // LIST or MAP
    const [feedFilter, setFeedFilter] = useState('GLOBAL'); // GLOBAL or FRIENDS
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const { language } = useLanguage();

    const texts = language === 'fr' ? {
        title: 'Réseau global',
        filterGlobal: 'Global',
        filterFriends: 'Amis',
        mapOnlyMobile: 'La carte est disponible uniquement sur mobile',
        mapOnlyMobileSub: 'Testez sur Expo Go pour voir la carte',
    } : {
        title: 'Global Network',
        filterGlobal: 'Global',
        filterFriends: 'Friends',
        mapOnlyMobile: 'Map is available on mobile only',
        mapOnlyMobileSub: 'Open in Expo Go to see the map',
    };

    useEffect(() => {
        (async () => {
            if (viewMode === 'MAP' && !location) {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    Alert.alert("Permission denied", "We need location access to show your area.");
                    return;
                }

                try {
                    let location = await Location.getCurrentPositionAsync({});
                    setLocation(location);
                } catch (e) {
                    Alert.alert("Error", "Could not fetch location.");
                }
            }
        })();
    }, [viewMode]);

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
                    <Text style={styles.title}>{texts.title}</Text>
                    <TouchableOpacity
                        style={styles.toggleBtn}
                        onPress={() => setViewMode(viewMode === 'LIST' ? 'MAP' : 'LIST')}
                    >
                        <Ionicons
                            name={viewMode === 'LIST' ? "map-outline" : "list-outline"}
                            size={24}
                            color={COLORS.ink}
                        />
                    </TouchableOpacity>
                </View>

                {viewMode === 'LIST' && (
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
                                {texts.filterGlobal}
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
                                {texts.filterFriends}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {viewMode === 'LIST' ? (
                    <FlatList
                        data={filteredPosts}
                        renderItem={renderPost}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                    />
                ) : Platform.OS === 'web' ? (
                    <View style={styles.mapContainer}>
                        <View style={[styles.map, styles.webMapFallback]}>
                            <Ionicons name="map-outline" size={64} color={COLORS.neonGreen} />
                            <Text style={styles.webMapText}>{texts.mapOnlyMobile}</Text>
                            <Text style={styles.webMapSubtext}>{texts.mapOnlyMobileSub}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            region={location ? {
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            } : {
                                latitude: 48.8566, // Fallback (Paris)
                                longitude: 2.3522,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                            showsUserLocation={true}
                            scrollEnabled={true}
                            zoomEnabled={true}
                            rotateEnabled={false} // Often causes confusion
                            pitchEnabled={false}
                        >
                            {/* OpenStreetMap Tiles */}
                            <UrlTile
                                urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                maximumZ={19}
                                flipY={false}
                            />

                            {filteredPosts.map(post => (
                                <Marker
                                    key={post.id}
                                    coordinate={{ latitude: post.lat, longitude: post.lon }}
                                    title={post.user}
                                    description={post.action}
                                >
                                    <View style={styles.markerContainer}>
                                        <View style={styles.markerDot} />
                                    </View>
                                </Marker>
                            ))}
                        </MapView>

                        {/* Map Overlay Info */}
                        <View style={styles.mapOverlay}>
                            <Text style={styles.mapOverlayText}>
                                {location ? "Tracking Location..." : "Locating Signal..."}
                            </Text>
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
        // Removed marginBottom from here as it's now handled by headerRow's marginBottom
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
    // Map Styles
    mapContainer: {
        flex: 1,
        marginHorizontal: SPACING.m,
        marginBottom: 100, // Tab bar
        borderRadius: SPACING.m,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLORS.neonGold,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        padding: 5,
    },
    markerDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.neonGreen,
        borderWidth: 2,
        borderColor: COLORS.ink,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: SPACING.m,
        left: SPACING.m,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: SPACING.s,
        borderRadius: SPACING.s,
    },
    mapOverlayText: {
        color: COLORS.neonGreen,
        fontWeight: 'bold',
    },
});
