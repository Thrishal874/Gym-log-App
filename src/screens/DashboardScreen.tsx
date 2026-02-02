import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useWorkouts } from '../context/WorkoutContext';
import { Workout } from '../services/workoutService';

type RootStackParamList = {
    MainTabs: undefined;
    EditWorkout: { workout: Workout };
    AddWorkout: undefined;
    Workouts: undefined;
};

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DashboardScreenProps {
    navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
    const { user } = useAuth();
    const { stats, loading, fetchWorkouts, workouts } = useWorkouts();

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'No workouts yet';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const getGreeting = (): string => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getRecentWorkouts = (): Workout[] => {
        return workouts.slice(0, 3);
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="p-6 pb-28"
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchWorkouts}
                    tintColor="#6C63FF"
                />
            }
        >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-8">
                <View>
                    <Text className="text-sm text-text-secondary">{getGreeting()}! 👋</Text>
                    <Text className="text-2xl font-bold text-white capitalize">
                        {user?.email?.split('@')[0] || 'Athlete'}
                    </Text>
                </View>
                <View className="w-12 h-12 rounded-full bg-primary-light justify-center items-center">
                    <Text className="text-3xl">🏃</Text>
                </View>
            </View>

            {/* Stats Cards */}
            <View className="flex-row gap-4 mb-6">
                <View className="flex-1 p-6 rounded-2xl items-center bg-primary shadow-md">
                    <Text className="text-3xl mb-1">🎯</Text>
                    <Text className="text-3xl font-bold text-white">{stats.totalWorkouts}</Text>
                    <Text className="text-xs text-white/80">Total Workouts</Text>
                </View>

                <View className="flex-1 p-6 rounded-2xl items-center bg-accent shadow-md">
                    <Text className="text-3xl mb-1">📅</Text>
                    <Text className="text-3xl font-bold text-white">{stats.weeklyCount}</Text>
                    <Text className="text-xs text-white/80">This Week</Text>
                </View>
            </View>

            {/* Last Workout Card */}
            <View className="bg-background-card rounded-2xl p-6 mb-6 border border-border">
                <View className="flex-row items-center mb-2">
                    <Text className="text-xl mr-2">⏱️</Text>
                    <Text className="text-xl font-semibold text-white">Last Workout</Text>
                </View>
                <Text className="text-base text-text-secondary ml-7">
                    {formatDate(stats.lastWorkoutDate)}
                </Text>
            </View>

            {/* Quick Actions */}
            <View className="flex-row gap-4 mb-8">
                <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center bg-primary p-4 rounded-xl gap-2"
                    onPress={() => navigation.navigate('AddWorkout')}
                >
                    <Text className="text-lg">➕</Text>
                    <Text className="text-base font-semibold text-white">Add Workout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center bg-background-card p-4 rounded-xl gap-2 border border-border"
                    onPress={() => navigation.navigate('Workouts')}
                >
                    <Text className="text-lg">📋</Text>
                    <Text className="text-base font-semibold text-white">View All</Text>
                </TouchableOpacity>
            </View>

            {/* Recent Workouts */}
            <View className="mb-6">
                <Text className="text-xl font-semibold text-white mb-4">Recent Workouts</Text>
                {getRecentWorkouts().length > 0 ? (
                    getRecentWorkouts().map((workout, index) => (
                        <TouchableOpacity
                            key={workout.workoutId || index}
                            className="flex-row items-center bg-background-card p-4 rounded-xl mt-4 border border-border"
                            onPress={() => navigation.navigate('EditWorkout', { workout })}
                        >
                            <View className="w-11 h-11 rounded-full bg-background-light justify-center items-center mr-4">
                                <Text className="text-2xl">
                                    {workout.workoutType === 'Cardio' ? '🏃' : '💪'}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-base font-semibold text-white">{workout.exerciseName}</Text>
                                <Text className="text-xs text-text-secondary mt-0.5">
                                    {workout.workoutType} • {formatDate(workout.date)}
                                </Text>
                            </View>
                            <Text className="text-2xl text-text-muted">›</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="items-center p-8 mt-4">
                        <Text className="text-5xl mb-4">🏋️</Text>
                        <Text className="text-base text-text-secondary">No workouts yet</Text>
                        <Text className="text-xs text-text-muted mt-1">Start by adding your first workout!</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default DashboardScreen;
