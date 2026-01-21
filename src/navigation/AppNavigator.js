import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

// Screens
import {
    CameraScreen,
    CollectionScreen,
    BattleScreen,
    FeedScreen,
    ProfileScreen
} from '../screens';

// Custom Button
import { CustomTabBarButton } from '../components/CustomTabBarButton';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Camera"
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: 'absolute', // Keep absolute for transparency effect
                        bottom: 0,
                        left: 0,
                        right: 0,
                        elevation: 0,
                        backgroundColor: 'rgba(255, 255, 240, 0.9)', // Semi-transparent Paper
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        height: 80, // Taller to accommodate button
                        borderTopWidth: 0,
                        // Shadow
                        shadowColor: COLORS.neonGreen,
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        elevation: 10,
                        paddingBottom: 0, // Let SafeArea handle it or manage manually if needed
                    },
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name="Feed"
                    component={FeedScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons name="newspaper-outline" size={24} color={focused ? COLORS.success : COLORS.ink} />
                        )
                    }}
                />
                <Tab.Screen
                    name="Battle"
                    component={BattleScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons name="flash-outline" size={24} color={focused ? COLORS.danger : COLORS.ink} />
                        )
                    }}
                />

                {/* Main Camera Button */}
                <Tab.Screen
                    name="Camera"
                    component={CameraScreen}
                    options={{
                        tabBarButton: (props) => <CustomTabBarButton {...props} />
                    }}
                />

                <Tab.Screen
                    name="Collection"
                    component={CollectionScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons name="albums-outline" size={24} color={focused ? COLORS.rust : COLORS.ink} />
                        )
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons name="person-outline" size={24} color={focused ? COLORS.neonGold : COLORS.ink} />
                        )
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
