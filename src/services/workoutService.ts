import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const WORKOUTS_COLLECTION = 'workouts';

export interface WorkoutData {
    exerciseName: string;
    workoutType: 'Cardio' | 'Strength';
    sets: number;
    reps: number;
    weight: number;
    duration: number;
    date: string;
}

export interface Workout extends WorkoutData {
    workoutId: string;
    userId: string;
    createdAt?: Timestamp | any;
    updatedAt?: Timestamp;
}

export interface ServiceResult<T = void> {
    success: boolean;
    error?: string;
    id?: string;
    workouts?: Workout[];
}

export const createWorkout = async (userId: string, workoutData: WorkoutData): Promise<ServiceResult> => {
    try {
        console.log('Creating workout for user:', userId);
        const docRef = await addDoc(collection(db, WORKOUTS_COLLECTION), {
            userId,
            exerciseName: workoutData.exerciseName,
            workoutType: workoutData.workoutType,
            sets: parseInt(String(workoutData.sets)) || 0,
            reps: parseInt(String(workoutData.reps)) || 0,
            weight: parseFloat(String(workoutData.weight)) || 0,
            duration: parseInt(String(workoutData.duration)) || 0,
            date: workoutData.date || new Date().toISOString(),
            createdAt: serverTimestamp(),
        });
        console.log('Workout created with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating workout:', error);
        return { success: false, error: (error as Error).message };
    }
};

export const getWorkouts = async (userId: string): Promise<ServiceResult> => {
    try {
        console.log('Getting workouts for user:', userId);
        // Simple query without orderBy to avoid composite index requirement
        const q = query(
            collection(db, WORKOUTS_COLLECTION),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const workouts: Workout[] = [];
        querySnapshot.forEach((doc) => {
            workouts.push({
                workoutId: doc.id,
                ...doc.data(),
            } as Workout);
        });

        // Sort client-side by createdAt or date (descending)
        workouts.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.date);
            const dateB = b.createdAt?.toDate?.() || new Date(b.date);
            return dateB.getTime() - dateA.getTime();
        });

        console.log('Found', workouts.length, 'workouts');
        return { success: true, workouts };
    } catch (error) {
        console.error('Error getting workouts:', error);
        return { success: false, error: (error as Error).message, workouts: [] };
    }
};

export const updateWorkout = async (workoutId: string, workoutData: WorkoutData): Promise<ServiceResult> => {
    try {
        console.log('Updating workout:', workoutId);
        const workoutRef = doc(db, WORKOUTS_COLLECTION, workoutId);
        await updateDoc(workoutRef, {
            exerciseName: workoutData.exerciseName,
            workoutType: workoutData.workoutType,
            sets: parseInt(String(workoutData.sets)) || 0,
            reps: parseInt(String(workoutData.reps)) || 0,
            weight: parseFloat(String(workoutData.weight)) || 0,
            duration: parseInt(String(workoutData.duration)) || 0,
            date: workoutData.date,
            updatedAt: serverTimestamp(),
        });
        console.log('Workout updated successfully');
        return { success: true };
    } catch (error) {
        console.error('Error updating workout:', error);
        return { success: false, error: (error as Error).message };
    }
};

export const deleteWorkout = async (workoutId: string): Promise<ServiceResult> => {
    try {
        console.log('Deleting workout:', workoutId);
        await deleteDoc(doc(db, WORKOUTS_COLLECTION, workoutId));
        console.log('Workout deleted successfully');
        return { success: true };
    } catch (error) {
        console.error('Error deleting workout:', error);
        return { success: false, error: (error as Error).message };
    }
};

export default {
    createWorkout,
    getWorkouts,
    updateWorkout,
    deleteWorkout,
};
