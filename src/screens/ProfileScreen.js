import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BackgroundWrapper } from '../components/BackgroundWrapper';
import { ProfileHeader } from '../components/ProfileHeader';
import { FollowStats } from '../components/FollowStats';
import { BiographySection } from '../components/BiographySection';
import { AnimalShowcase } from '../components/AnimalShowcase';
import { EditProfileModal } from '../components/EditProfileModal';
import { SelectShowcaseModal } from '../components/SelectShowcaseModal';
import { COLORS, SPACING } from '../constants/theme';
import { MOCK_USER_PROFILE } from '../data/mockUserProfile';
import { MOCK_ANIMALS } from '../data/mockCollection';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen = () => {
    // Profile state
    const [profile, setProfile] = useState(MOCK_USER_PROFILE);

    // Modal states
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [showcaseModalVisible, setShowcaseModalVisible] = useState(false);

    // Handler for profile photo change
    const handleProfilePhotoChange = (uri) => {
        setProfile(prev => ({ ...prev, profilePhoto: uri }));
    };

    // Handler for banner change
    const handleBannerChange = (uri) => {
        setProfile(prev => ({ ...prev, bannerPhoto: uri }));
    };

    // Handler for saving profile edits
    const handleSaveProfile = ({ biography }) => {
        setProfile(prev => ({ ...prev, biography }));
    };

    // Handler for showcase selection
    const handleSaveShowcase = (showcaseAnimals) => {
        setProfile(prev => ({ ...prev, showcaseAnimals }));
    };

    return (
        <BackgroundWrapper>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Profile Header with Banner & Photo */}
                    <ProfileHeader
                        profilePhoto={profile.profilePhoto}
                        bannerPhoto={profile.bannerPhoto}
                        onEditProfile={() => setEditModalVisible(true)}
                        onEditBanner={() => setEditModalVisible(true)}
                    />

                    {/* Username, Rank & Biography */}
                    <BiographySection
                        username={profile.username}
                        rank={profile.rank}
                        biography={profile.biography}
                        onEditPress={() => setEditModalVisible(true)}
                    />

                    {/* Followers / Following Stats */}
                    <FollowStats
                        followers={profile.followers}
                        following={profile.following}
                        onFollowersPress={() => { }}
                        onFollowingPress={() => { }}
                    />

                    {/* Stats Row (Captures, Tamed, Bio-Tokens) */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>{profile.stats.captures}</Text>
                            <Text style={styles.statLabel}>Captures</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>{profile.stats.tamed}</Text>
                            <Text style={styles.statLabel}>Tamed</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>{profile.stats.bioTokens >= 1000 ? (profile.stats.bioTokens / 1000).toFixed(1) + 'k' : profile.stats.bioTokens}</Text>
                            <Text style={styles.statLabel}>Bio-Tokens</Text>
                        </View>
                    </View>

                    {/* Animal Showcase (Vitrine) */}
                    <AnimalShowcase
                        showcaseAnimals={profile.showcaseAnimals}
                        allAnimals={MOCK_ANIMALS}
                        onEditShowcase={() => setShowcaseModalVisible(true)}
                    />

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

            {/* Edit Profile Modal */}
            <EditProfileModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                currentBio={profile.biography}
                onSave={handleSaveProfile}
                onPickProfilePhoto={handleProfilePhotoChange}
                onPickBanner={handleBannerChange}
            />

            {/* Select Showcase Modal */}
            <SelectShowcaseModal
                visible={showcaseModalVisible}
                onClose={() => setShowcaseModalVisible(false)}
                allAnimals={MOCK_ANIMALS}
                currentShowcase={profile.showcaseAnimals}
                onSave={handleSaveShowcase}
            />
        </BackgroundWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    scrollContent: {
        paddingBottom: 100,
        paddingHorizontal: SPACING.m,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: SPACING.s,
        padding: SPACING.m,
        marginBottom: SPACING.l,
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
