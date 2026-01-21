import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackgroundWrapper } from '../components/BackgroundWrapper';
import { BioCard } from '../components/BioCard';
import { MOCK_ANIMALS } from '../data/mockCollection';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

export const CollectionScreen = () => {
    const [collection, setCollection] = useState(MOCK_ANIMALS);
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            const loadCollection = async () => {
                try {
                    const stored = await AsyncStorage.getItem('user_collection');
                    if (stored) {
                        const userCaptures = JSON.parse(stored);
                        // Merge Mocks + User Captures
                        setCollection([...MOCK_ANIMALS, ...userCaptures]);
                    }
                } catch (e) {
                    console.error("Failed to load collection", e);
                }
            };
            loadCollection();
        }, [])
    );

    const renderItem = ({ item }) => (
        <BioCard animal={item} onPress={() => setSelectedAnimal(item)} />
    );

    const handleFeed = () => {
        // Logic would go here to reduce food inventory and increase hunger stat
        Alert.alert("Fed!", `${selectedAnimal.name} is happy.`);
        // Update local state for UI feedback
        setSelectedAnimal(prev => ({
            ...prev,
            stats: { ...prev.stats, hunger: Math.min(100, prev.stats.hunger + 20) }
        }));
    };

    const handleRecycle = () => {
        Alert.alert(
            "Recycle?",
            "Are you sure? This will remove the animal permanently.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Recycle",
                    style: 'destructive',
                    onPress: () => {
                        const newCollection = collection.filter(a => a.id !== selectedAnimal.id);
                        setCollection(newCollection);
                        setSelectedAnimal(null);
                    }
                }
            ]
        );
    };

    return (
        <BackgroundWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>My Collection</Text>
                <Text style={styles.subtitle}>{collection.length} Species Discovered</Text>
            </View>

            <FlatList
                data={collection}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.row}
            />

            {/* Detail Modal */}
            <Modal
                visible={!!selectedAnimal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSelectedAnimal(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedAnimal && (
                            <ScrollView>
                                <LinearGradient
                                    colors={[COLORS.paper, COLORS.paperDark]}
                                    style={styles.modalBody}
                                >
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setSelectedAnimal(null)}
                                    >
                                        <Ionicons name="close-circle" size={32} color={COLORS.ink} />
                                    </TouchableOpacity>

                                    <Text style={styles.modalEmoji}>{selectedAnimal.emoji}</Text>
                                    <Text style={styles.modalTitle}>{selectedAnimal.name}</Text>
                                    <Text style={styles.modalRarity}>{selectedAnimal.rarity}</Text>

                                    <View style={styles.divider} />

                                    <Text style={styles.description}>{selectedAnimal.description}</Text>

                                    {/* Stats */}
                                    <View style={styles.statsContainer}>
                                        <Text style={styles.statLabel}>Hunger</Text>
                                        <View style={styles.progressBarBg}>
                                            <View style={[styles.progressBarFill, { width: `${selectedAnimal.stats.hunger}%` }]} />
                                        </View>

                                        <View style={styles.statRow}>
                                            <View style={styles.statBox}>
                                                <Text style={styles.statValue}>⚡ {selectedAnimal.stats.speed}</Text>
                                                <Text style={styles.statLabel}>Speed</Text>
                                            </View>
                                            <View style={styles.statBox}>
                                                <Text style={styles.statValue}>🛡️ {selectedAnimal.stats.defense}</Text>
                                                <Text style={styles.statLabel}>Defense</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Actions */}
                                    <View style={styles.actions}>
                                        <TouchableOpacity style={styles.actionButton} onPress={handleFeed}>
                                            <Text style={styles.actionText}>🍖 Feed</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.actionButton, styles.recycleBtn]} onPress={handleRecycle}>
                                            <Text style={styles.actionText}>♻️ Recycle</Text>
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </BackgroundWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: SPACING.m,
        paddingTop: 60, // Safe area
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    subtitle: {
        color: COLORS.rust,
    },
    listContent: {
        padding: SPACING.s,
        paddingBottom: 100, // Tab bar clearance
    },
    row: {
        justifyContent: 'space-between',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '85%',
        borderTopLeftRadius: SPACING.l,
        borderTopRightRadius: SPACING.l,
        overflow: 'hidden',
    },
    modalBody: {
        flex: 1,
        padding: SPACING.l,
        minHeight: 800,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    modalEmoji: {
        fontSize: 80,
        textAlign: 'center',
        marginVertical: SPACING.m,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.ink,
        textAlign: 'center',
    },
    modalRarity: {
        textAlign: 'center',
        color: COLORS.neonGold,
        fontWeight: 'bold',
        fontSize: 18,
        textTransform: 'uppercase',
        marginBottom: SPACING.m,
    },
    divider: {
        height: 2,
        backgroundColor: COLORS.ink,
        marginVertical: SPACING.m,
        opacity: 0.2,
    },
    description: {
        fontSize: 16,
        color: COLORS.ink,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: SPACING.l,
    },
    statsContainer: {
        marginBottom: SPACING.xl,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        marginBottom: SPACING.m,
    },
    progressBarFill: {
        height: 10,
        backgroundColor: COLORS.success,
        borderRadius: 5,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    statLabel: {
        color: COLORS.rust,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 50,
    },
    actionButton: {
        backgroundColor: COLORS.neonGreen,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        borderRadius: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.ink,
    },
    recycleBtn: {
        backgroundColor: COLORS.danger,
    },
    actionText: {
        fontWeight: 'bold',
        color: COLORS.ink,
    },
});
