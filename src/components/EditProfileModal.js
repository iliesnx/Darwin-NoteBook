import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING } from '../constants/theme';

export const EditProfileModal = ({
    visible,
    onClose,
    currentBio,
    onSave,
    onPickProfilePhoto,
    onPickBanner
}) => {
    const [biography, setBiography] = useState(currentBio || '');

    const handleSave = () => {
        onSave({ biography });
        onClose();
    };

    const pickImage = async (type) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: type === 'profile' ? [1, 1] : [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            if (type === 'profile') {
                onPickProfilePhoto(result.assets[0].uri);
            } else {
                onPickBanner(result.assets[0].uri);
            }
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color={COLORS.ink} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Modifier le profil</Text>
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.saveButton}>Enregistrer</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {/* Profile Photo */}
                        <TouchableOpacity
                            style={styles.imageOption}
                            onPress={() => pickImage('profile')}
                        >
                            <View style={styles.iconContainer}>
                                <Ionicons name="person-circle" size={24} color={COLORS.neonGreen} />
                            </View>
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>Photo de profil</Text>
                                <Text style={styles.optionSubtitle}>Changer votre photo</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.rust} />
                        </TouchableOpacity>

                        {/* Banner */}
                        <TouchableOpacity
                            style={styles.imageOption}
                            onPress={() => pickImage('banner')}
                        >
                            <View style={styles.iconContainer}>
                                <Ionicons name="image" size={24} color={COLORS.neonGreen} />
                            </View>
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>Bannière</Text>
                                <Text style={styles.optionSubtitle}>Personnaliser votre bannière</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.rust} />
                        </TouchableOpacity>

                        {/* Biography */}
                        <View style={styles.bioSection}>
                            <Text style={styles.bioLabel}>Biographie</Text>
                            <TextInput
                                style={styles.bioInput}
                                value={biography}
                                onChangeText={setBiography}
                                placeholder="Parlez de vous..."
                                placeholderTextColor={COLORS.rust}
                                multiline
                                maxLength={150}
                            />
                            <Text style={styles.charCount}>{biography.length}/150</Text>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.paper,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.paperDark,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    saveButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.neonGreen,
    },
    content: {
        padding: SPACING.m,
    },
    imageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.paperDark,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,255,204,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.ink,
    },
    optionSubtitle: {
        fontSize: 13,
        color: COLORS.rust,
        marginTop: 2,
    },
    bioSection: {
        marginTop: SPACING.l,
    },
    bioLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.ink,
        marginBottom: SPACING.s,
    },
    bioInput: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: SPACING.s,
        padding: SPACING.m,
        fontSize: 15,
        color: COLORS.ink,
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: COLORS.paperDark,
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: COLORS.rust,
        marginTop: SPACING.xs,
    },
});
