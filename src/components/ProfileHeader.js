import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export const ProfileHeader = ({
    profilePhoto,
    bannerPhoto,
    onEditProfile,
    onEditBanner
}) => {
    return (
        <View style={styles.container}>
            {/* Banner */}
            <View style={styles.bannerContainer}>
                {bannerPhoto ? (
                    <Image source={{ uri: bannerPhoto }} style={styles.banner} />
                ) : (
                    <View style={styles.bannerPlaceholder} />
                )}
                <TouchableOpacity style={styles.editBannerBtn} onPress={onEditBanner}>
                    <Ionicons name="camera" size={18} color={COLORS.paper} />
                </TouchableOpacity>
            </View>

            {/* Profile Photo */}
            <View style={styles.profilePhotoContainer}>
                {profilePhoto ? (
                    <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
                ) : (
                    <View style={styles.profilePhotoPlaceholder}>
                        <Ionicons name="person" size={40} color={COLORS.paperDark} />
                    </View>
                )}
                <TouchableOpacity style={styles.editProfileBtn} onPress={onEditProfile}>
                    <Ionicons name="camera" size={16} color={COLORS.paper} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    bannerContainer: {
        width: '100%',
        height: 140,
        position: 'relative',
    },
    banner: {
        width: '100%',
        height: '100%',
        borderRadius: SPACING.m,
    },
    bannerPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.neonGreen,
        borderRadius: SPACING.m,
        opacity: 0.3,
    },
    editBannerBtn: {
        position: 'absolute',
        right: SPACING.s,
        bottom: SPACING.s,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: SPACING.s,
        borderRadius: 20,
    },
    profilePhotoContainer: {
        marginTop: -50,
        position: 'relative',
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: COLORS.paper,
    },
    profilePhotoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.neonGreen,
        borderWidth: 4,
        borderColor: COLORS.paper,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editProfileBtn: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.neonGreen,
        padding: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: COLORS.paper,
    },
});
