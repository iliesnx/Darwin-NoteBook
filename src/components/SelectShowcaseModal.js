import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

const RARITY_COLORS = {
    Common: COLORS.ink,
    Rare: '#3498db',
    Legendary: COLORS.neonGold,
};

const AnimalItem = ({ animal, isSelected, onToggle }) => {
    return (
        <TouchableOpacity
            style={[styles.animalItem, isSelected && styles.animalItemSelected]}
            onPress={() => onToggle(animal.id)}
        >
            <Text style={styles.emoji}>{animal.emoji}</Text>
            <View style={styles.animalInfo}>
                <Text style={styles.animalName}>{animal.name}</Text>
                <Text style={[styles.rarity, { color: RARITY_COLORS[animal.rarity] }]}>
                    {animal.rarity}
                </Text>
            </View>
            {animal.shiny && (
                <Ionicons name="sparkles" size={16} color={COLORS.neonGold} />
            )}
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Ionicons name="checkmark" size={16} color={COLORS.paper} />}
            </View>
        </TouchableOpacity>
    );
};

export const SelectShowcaseModal = ({
    visible,
    onClose,
    allAnimals = [],
    currentShowcase = [],
    onSave
}) => {
    const [selected, setSelected] = useState(currentShowcase);

    const handleToggle = (animalId) => {
        if (selected.includes(animalId)) {
            setSelected(selected.filter(id => id !== animalId));
        } else if (selected.length < 3) {
            setSelected([...selected, animalId]);
        }
    };

    const handleSave = () => {
        onSave(selected);
        onClose();
    };

    const handleReset = () => {
        setSelected([]);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color={COLORS.ink} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Ma Vitrine</Text>
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.saveButton}>Valider</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.countContainer}>
                        <Text style={styles.countText}>
                            {selected.length}/3 sélectionnés
                        </Text>
                        {selected.length > 0 && (
                            <TouchableOpacity onPress={handleReset}>
                                <Text style={styles.resetButton}>Réinitialiser</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        data={allAnimals}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <AnimalItem
                                animal={item}
                                isSelected={selected.includes(item.id)}
                                onToggle={handleToggle}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
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
        maxHeight: '75%',
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
    countContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        backgroundColor: 'rgba(0,255,204,0.1)',
    },
    countText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.ink,
    },
    resetButton: {
        fontSize: 14,
        color: COLORS.rust,
    },
    listContent: {
        padding: SPACING.m,
    },
    animalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: SPACING.s,
        marginBottom: SPACING.s,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    animalItemSelected: {
        borderColor: COLORS.neonGreen,
        backgroundColor: 'rgba(0,255,204,0.1)',
    },
    emoji: {
        fontSize: 32,
        marginRight: SPACING.m,
    },
    animalInfo: {
        flex: 1,
    },
    animalName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.ink,
    },
    rarity: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.paperDark,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: SPACING.s,
    },
    checkboxSelected: {
        backgroundColor: COLORS.neonGreen,
        borderColor: COLORS.neonGreen,
    },
});
