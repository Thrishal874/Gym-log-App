import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useWorkouts } from '../context/WorkoutContext';

const ProfileScreen: React.FC = () => {
    const { user, logout } = useAuth();
    const { stats } = useWorkouts();

    const handleLogout = (): void => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    },
                },
            ]
        );
    };

    const getInitials = (): string => {
        if (!user?.email) return '?';
        return user.email.charAt(0).toUpperCase();
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="p-6 pb-28"
        >
            {/* Profile Header */}
            <View className="items-center mb-8 py-8">
                <View className="w-24 h-24 rounded-full bg-primary justify-center items-center mb-4 shadow-md">
                    <Text className="text-4xl font-bold text-white">{getInitials()}</Text>
                </View>
                <Text className="text-2xl font-bold text-white mb-1">Hello, Athlete!</Text>
                <Text className="text-base text-text-secondary">{user?.email || 'No email'}</Text>
            </View>

            {/* Stats Summary */}
            <View className="bg-background-card rounded-2xl p-6 mb-8 border border-border">
                <Text className="text-xl font-semibold text-white mb-4">📊 Your Stats</Text>
                <View className="flex-row justify-around mt-4">
                    <View className="items-center flex-1">
                        <Text className="text-3xl font-bold text-primary">{stats.totalWorkouts}</Text>
                        <Text className="text-xs text-text-secondary mt-1">Total Workouts</Text>
                    </View>
                    <View className="w-px bg-border mx-4" />
                    <View className="items-center flex-1">
                        <Text className="text-3xl font-bold text-primary">{stats.weeklyCount}</Text>
                        <Text className="text-xs text-text-secondary mt-1">This Week</Text>
                    </View>
                </View>
            </View>

            {/* Account Info */}
            <View className="mb-8">
                <Text className="text-xl font-semibold text-white mb-4">👤 Account</Text>

                <View className="bg-background-card rounded-2xl overflow-hidden border border-border">
                    <View className="flex-row justify-between items-center p-4">
                        <Text className="text-base text-text-secondary">Email</Text>
                        <Text className="text-base text-white font-medium">{user?.email || 'N/A'}</Text>
                    </View>
                    <View className="h-px bg-border mx-4" />
                    <View className="flex-row justify-between items-center p-4">
                        <Text className="text-base text-text-secondary">User ID</Text>
                        <Text className="text-sm text-text-muted max-w-[50%]" numberOfLines={1}>
                            {user?.uid?.slice(0, 20) || 'N/A'}...
                        </Text>
                    </View>
                </View>
            </View>

            {/* App Info */}
            <View className="mb-8">
                <Text className="text-xl font-semibold text-white mb-4">ℹ️ App Info</Text>

                <View className="bg-background-card rounded-2xl overflow-hidden border border-border">
                    <View className="flex-row justify-between items-center p-4">
                        <Text className="text-base text-text-secondary">App Name</Text>
                        <Text className="text-base text-white font-medium">GymLog</Text>
                    </View>
                    <View className="h-px bg-border mx-4" />
                    <View className="flex-row justify-between items-center p-4">
                        <Text className="text-base text-text-secondary">Version</Text>
                        <Text className="text-base text-white font-medium">1.0.0</Text>
                    </View>
                    <View className="h-px bg-border mx-4" />
                    <View className="flex-row justify-between items-center p-4">
                        <Text className="text-base text-text-secondary">Built with</Text>
                        <Text className="text-base text-white font-medium">React Native Expo</Text>
                    </View>
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                className="flex-row items-center justify-center bg-background-card p-6 rounded-xl border border-error gap-2 mt-4"
                onPress={handleLogout}
            >
                <Text className="text-xl">🚪</Text>
                <Text className="text-base text-error font-semibold">Logout</Text>
            </TouchableOpacity>

            <Text className="text-xs text-text-muted text-center mt-8">
                Made with 💪 for fitness enthusiasts
            </Text>
        </ScrollView>
    );
};

export default ProfileScreen;
