import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
    ListRenderItem,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWorkouts } from '../context/WorkoutContext';
import { Workout } from '../services/workoutService';

type RootStackParamList = {
    MainTabs: undefined;
    EditWorkout: { workout: Workout };
    AddWorkout: undefined;
};

type WorkoutListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface WorkoutListScreenProps {
    navigation: WorkoutListScreenNavigationProp;
}

const WorkoutListScreen: React.FC<WorkoutListScreenProps> = ({ navigation }) => {
    const { workouts, loading, fetchWorkouts, removeWorkout } = useWorkouts();

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleDelete = (workout: Workout): void => {
        Alert.alert(
            'Delete Workout',
            `Are you sure you want to delete "${workout.exerciseName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await removeWorkout(workout.workoutId);
                        if (!result.success) {
                            Alert.alert('Error', 'Failed to delete workout');
                        }
                    },
                },
            ]
        );
    };

    const renderWorkoutItem: ListRenderItem<Workout> = ({ item }) => (
        <TouchableOpacity
            className="bg-background-card rounded-2xl overflow-hidden border border-border shadow-sm"
            onPress={() => navigation.navigate('EditWorkout', { workout: item })}
            activeOpacity={0.7}
        >
            <View className="flex-row items-center p-4">
                <View className="w-12 h-12 rounded-full bg-background-light justify-center items-center mr-4">
                    <Text className="text-2xl">
                        {item.workoutType === 'Cardio' ? '🏃' : '💪'}
                    </Text>
                </View>

                <View className="flex-1">
                    <Text className="text-base font-semibold text-white mb-0.5">{item.exerciseName}</Text>
                    <Text className="text-xs text-text-secondary mb-2">
                        {item.workoutType} • {formatDate(item.date)}
                    </Text>

                    <View className="flex-row flex-wrap gap-1">
                        {item.workoutType === 'Strength' ? (
                            <>
                                <View className="bg-background-light px-2 py-1 rounded-lg">
                                    <Text className="text-xs text-primary font-medium">{item.sets} sets</Text>
                                </View>
                                <View className="bg-background-light px-2 py-1 rounded-lg">
                                    <Text className="text-xs text-primary font-medium">{item.reps} reps</Text>
                                </View>
                                {item.weight > 0 && (
                                    <View className="bg-background-light px-2 py-1 rounded-lg">
                                        <Text className="text-xs text-primary font-medium">{item.weight} kg</Text>
                                    </View>
                                )}
                            </>
                        ) : (
                            <View className="bg-background-light px-2 py-1 rounded-lg">
                                <Text className="text-xs text-primary font-medium">{item.duration} min</Text>
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    className="p-2"
                    onPress={() => handleDelete(item)}
                >
                    <Text className="text-xl">🗑️</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const ListEmptyComponent: React.FC = () => (
        <View className="flex-1 justify-center items-center p-8">
            <Text className="text-7xl mb-6">🏋️</Text>
            <Text className="text-2xl font-bold text-white mb-2">No Workouts Yet</Text>
            <Text className="text-base text-text-secondary text-center mb-8">
                Start logging your exercises to track your progress
            </Text>
            <TouchableOpacity
                className="bg-primary px-8 py-4 rounded-xl"
                onPress={() => navigation.navigate('AddWorkout')}
            >
                <Text className="text-base text-white font-bold">+ Add Your First Workout</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <View className="flex-row justify-between items-center p-6 pb-4">
                <Text className="text-2xl font-bold text-white">My Workouts</Text>
                <Text className="text-sm text-text-muted bg-background-card px-4 py-1 rounded-full">
                    {workouts.length} total
                </Text>
            </View>

            <FlatList
                data={workouts}
                renderItem={renderWorkoutItem}
                keyExtractor={(item) => item.workoutId}
                contentContainerClassName={`p-6 pt-0 pb-28 ${workouts.length === 0 ? 'flex-1' : ''}`}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchWorkouts}
                        tintColor="#6C63FF"
                    />
                }
                ListEmptyComponent={ListEmptyComponent}
                ItemSeparatorComponent={() => <View className="h-4" />}
            />

            {workouts.length > 0 && (
                <TouchableOpacity
                    className="absolute right-6 bottom-8 w-16 h-16 rounded-full bg-primary justify-center items-center shadow-lg"
                    onPress={() => navigation.navigate('AddWorkout')}
                >
                    <Text className="text-4xl text-white -mt-0.5">+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default WorkoutListScreen;
