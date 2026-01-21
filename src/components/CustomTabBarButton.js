import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons'; // Assuming Expo

export const CustomTabBarButton = ({ children, onPress }) => {
    return (
        <TouchableOpacity
            style={{
                top: -20, // Float slightly above
                justifyContent: 'center',
                alignItems: 'center',
                ...styles.shadow,
            }}
            onPress={onPress}
        >
            <View
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: COLORS.neonGreen,
                    borderWidth: 4,
                    borderColor: COLORS.paper, // Inner ring
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Ionicons name="camera" size={32} color={COLORS.ink} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: COLORS.neonGreen,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
});
