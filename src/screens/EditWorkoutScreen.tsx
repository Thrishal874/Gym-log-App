import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useWorkouts } from '../context/WorkoutContext';
import { Workout, WorkoutData } from '../services/workoutService';

type RootStackParamList = {
    MainTabs: undefined;
    EditWorkout: { workout: Workout };
};

type EditWorkoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditWorkout'>;
type EditWorkoutScreenRouteProp = RouteProp<RootStackParamList, 'EditWorkout'>;

interface EditWorkoutScreenProps {
    navigation: EditWorkoutScreenNavigationProp;
    route: EditWorkoutScreenRouteProp;
}

interface FormData {
    exerciseName: string;
    workoutType: 'Strength' | 'Cardio';
    sets: string;
    reps: string;
    weight: string;
    duration: string;
    date: string;
}

const EditWorkoutScreen: React.FC<EditWorkoutScreenProps> = ({ route, navigation }) => {
    const { workout } = route.params;
    const { updateWorkout, removeWorkout, loading } = useWorkouts();

    const [formData, setFormData] = useState<FormData>({
        exerciseName: workout.exerciseName || '',
        workoutType: workout.workoutType || 'Strength',
        sets: workout.sets?.toString() || '',
        reps: workout.reps?.toString() || '',
        weight: workout.weight?.toString() || '',
        duration: workout.duration?.toString() || '',
        date: workout.date ? workout.date.split('T')[0] : new Date().toISOString().split('T')[0],
    });

    const workoutTypes: ('Strength' | 'Cardio')[] = ['Strength', 'Cardio'];

    const updateField = <K extends keyof FormData>(field: K, value: FormData[K]): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (): boolean => {
        if (!formData.exerciseName.trim()) {
            Alert.alert('Error', 'Please enter an exercise name');
            return false;
        }
        if (formData.workoutType === 'Strength') {
            if (!formData.sets || !formData.reps) {
                Alert.alert('Error', 'Please enter sets and reps for strength training');
                return false;
            }
        } else {
            if (!formData.duration) {
                Alert.alert('Error', 'Please enter duration for cardio');
                return false;
            }
        }
        return true;
    };

    const handleUpdate = async (): Promise<void> => {
        if (!validateForm()) return;

        const workoutData: WorkoutData = {
            exerciseName: formData.exerciseName,
            workoutType: formData.workoutType,
            sets: parseInt(formData.sets) || 0,
            reps: parseInt(formData.reps) || 0,
            weight: parseFloat(formData.weight) || 0,
            duration: parseInt(formData.duration) || 0,
            date: new Date(formData.date).toISOString(),
        };

        const result = await updateWorkout(workout.workoutId, workoutData);

        if (result.success) {
            Alert.alert('Success', 'Workout updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', result.error || 'Failed to update workout');
        }
    };

    const handleDelete = (): void => {
        Alert.alert(
            'Delete Workout',
            `Are you sure you want to delete "${formData.exerciseName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await removeWorkout(workout.workoutId);
                        if (result.success) {
                            navigation.goBack();
                        } else {
                            Alert.alert('Error', 'Failed to delete workout');
                        }
                    },
                },
            ]
        );
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                className="flex-1"
                contentContainerClassName="p-6 pb-28"
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-8">
                    <Text className="text-3xl font-bold text-white mb-1">Edit Workout</Text>
                    <Text className="text-sm text-text-secondary">Update your exercise details</Text>
                </View>

                {/* Exercise Name */}
                <View className="mb-6">
                    <Text className="text-sm text-text-secondary mb-2">Exercise Name *</Text>
                    <TextInput
                        className="bg-background-card rounded-xl p-4 text-white text-base border border-border"
                        placeholder="e.g., Bench Press, Running"
                        placeholderTextColor="#6B6B8D"
                        value={formData.exerciseName}
                        onChangeText={(value) => updateField('exerciseName', value)}
                    />
                </View>

                {/* Workout Type */}
                <View className="mb-6">
                    <Text className="text-sm text-text-secondary mb-2">Workout Type *</Text>
                    <View className="flex-row gap-4">
                        {workoutTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border-2 gap-2 ${formData.workoutType === type
                                        ? 'border-primary bg-background-light'
                                        : 'border-border bg-background-card'
                                    }`}
                                onPress={() => updateField('workoutType', type)}
                            >
                                <Text className="text-xl">
                                    {type === 'Strength' ? '💪' : '🏃'}
                                </Text>
                                <Text
                                    className={`text-base ${formData.workoutType === type
                                            ? 'text-primary font-semibold'
                                            : 'text-text-secondary'
                                        }`}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Conditional Fields Based on Type */}
                {formData.workoutType === 'Strength' ? (
                    <>
                        <View className="flex-row gap-4">
                            <View className="flex-1 mb-6">
                                <Text className="text-sm text-text-secondary mb-2">Sets *</Text>
                                <TextInput
                                    className="bg-background-card rounded-xl p-4 text-white text-base border border-border"
                                    placeholder="3"
                                    placeholderTextColor="#6B6B8D"
                                    value={formData.sets}
                                    onChangeText={(value) => updateField('sets', value)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1 mb-6">
                                <Text className="text-sm text-text-secondary mb-2">Reps *</Text>
                                <TextInput
                                    className="bg-background-card rounded-xl p-4 text-white text-base border border-border"
                                    placeholder="12"
                                    placeholderTextColor="#6B6B8D"
                                    value={formData.reps}
                                    onChangeText={(value) => updateField('reps', value)}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm text-text-secondary mb-2">Weight (kg)</Text>
                            <TextInput
                                className="bg-background-card rounded-xl p-4 text-white text-base border border-border"
                                placeholder="50"
                                placeholderTextColor="#6B6B8D"
                                value={formData.weight}
                                onChangeText={(value) => updateField('weight', value)}
                                keyboardType="decimal-pad"
                            />
                        </View>
                    </>
                ) : (
                    <View className="mb-6">
                        <Text className="text-sm text-text-secondary mb-2">Duration (minutes) *</Text>
                        <TextInput
                            className="bg-background-card rounded-xl p-4 text-white text-base border border-border"
                            placeholder="30"
                            placeholderTextColor="#6B6B8D"
                            value={formData.duration}
                            onChangeText={(value) => updateField('duration', value)}
                            keyboardType="numeric"
                        />
                    </View>
                )}

                {/* Date */}
                <View className="mb-6">
                    <Text className="text-sm text-text-secondary mb-2">Date</Text>
                    <TextInput
                        className="bg-background-card rounded-xl p-4 text-white text-base border border-border"
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#6B6B8D"
                        value={formData.date}
                        onChangeText={(value) => updateField('date', value)}
                    />
                    <Text className="text-xs text-text-muted mt-1">Format: YYYY-MM-DD</Text>
                </View>

                {/* Action Buttons */}
                <View className="mt-6 gap-4">
                    <TouchableOpacity
                        className={`flex-row items-center justify-center bg-primary p-6 rounded-xl gap-2 ${loading ? 'opacity-70' : ''}`}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Text className="text-xl text-white">✓</Text>
                                <Text className="text-base font-bold text-white">Update Workout</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-background-card p-6 rounded-xl border border-error gap-2"
                        onPress={handleDelete}
                        disabled={loading}
                    >
                        <Text className="text-xl">🗑️</Text>
                        <Text className="text-base font-semibold text-error">Delete Workout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditWorkoutScreen;
