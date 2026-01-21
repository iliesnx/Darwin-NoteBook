import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { BackgroundWrapper } from '../components/BackgroundWrapper';
import { COLORS } from '../constants/theme';

import { CameraScreen } from './CameraScreen';

export { CameraScreen };

import { CollectionScreen } from './CollectionScreen';

export { CollectionScreen };

import { BattleScreen } from './BattleScreen';

export { BattleScreen };

import { FeedScreen } from './FeedScreen';
import { ProfileScreen } from './ProfileScreen';

export { FeedScreen, ProfileScreen };

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: COLORS.ink,
        fontSize: 20,
        fontWeight: 'bold',
    },
});
