import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '../styles/theme';

const SplashScreen: React.FC = () => {
    return (
        <View className="flex-1 bg-background justify-center items-center">
            <View className="w-32 h-32 rounded-full bg-background-card justify-center items-center mb-6 border-4 border-primary">
                <Text className="text-6xl">💪</Text>
            </View>
            <Text className="text-5xl font-bold text-primary mb-2">GymLog</Text>
            <Text className="text-base text-text-secondary mb-12">Track Your Fitness Journey</Text>
            <ActivityIndicator
                size="large"
                color={colors.primary}
                className="mt-5"
            />
        </View>
    );
};

export default SplashScreen;
