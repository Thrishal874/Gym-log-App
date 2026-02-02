import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
    createWorkout as createWorkoutService,
    getWorkouts as getWorkoutsService,
    updateWorkout as updateWorkoutService,
    deleteWorkout as deleteWorkoutService,
    Workout,
    WorkoutData,
    ServiceResult
} from '../services/workoutService';

interface WorkoutStats {
    totalWorkouts: number;
    lastWorkoutDate: string | null;
    weeklyCount: number;
}

interface WorkoutContextType {
    workouts: Workout[];
    loading: boolean;
    error: string | null;
    stats: WorkoutStats;
    fetchWorkouts: () => Promise<void>;
    addWorkout: (workoutData: WorkoutData) => Promise<ServiceResult>;
    updateWorkout: (workoutId: string, workoutData: WorkoutData) => Promise<ServiceResult>;
    removeWorkout: (workoutId: string) => Promise<ServiceResult>;
    setError: (error: string | null) => void;
}

interface WorkoutProviderProps {
    children: ReactNode;
}

const WorkoutContext = createContext<WorkoutContextType>({} as WorkoutContextType);

export const useWorkouts = (): WorkoutContextType => useContext(WorkoutContext);

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<WorkoutStats>({
        totalWorkouts: 0,
        lastWorkoutDate: null,
        weeklyCount: 0,
    });

    const calculateStats = useCallback((workoutList: Workout[]): void => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const weeklyWorkouts = workoutList.filter(w => {
            const workoutDate = new Date(w.date);
            return workoutDate >= oneWeekAgo;
        });

        const sortedWorkouts = [...workoutList].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setStats({
            totalWorkouts: workoutList.length,
            lastWorkoutDate: sortedWorkouts[0]?.date || null,
            weeklyCount: weeklyWorkouts.length,
        });
    }, []);

    const fetchWorkouts = useCallback(async (): Promise<void> => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const result = await getWorkoutsService(user.uid);
            if (result.success && result.workouts) {
                setWorkouts(result.workouts);
                calculateStats(result.workouts);
            } else {
                setError(result.error || 'Failed to fetch workouts');
            }
        } catch (err) {
            setError('Failed to fetch workouts');
        } finally {
            setLoading(false);
        }
    }, [user, calculateStats]);

    useEffect(() => {
        if (user) {
            fetchWorkouts();
        } else {
            setWorkouts([]);
            setStats({ totalWorkouts: 0, lastWorkoutDate: null, weeklyCount: 0 });
        }
    }, [user, fetchWorkouts]);

    const addWorkout = async (workoutData: WorkoutData): Promise<ServiceResult> => {
        if (!user) return { success: false, error: 'Not authenticated' };

        try {
            setLoading(true);
            setError(null);
            const result = await createWorkoutService(user.uid, workoutData);
            if (result.success) {
                await fetchWorkouts();
            }
            return result;
        } catch (err) {
            setError('Failed to add workout');
            return { success: false, error: (err as Error).message };
        } finally {
            setLoading(false);
        }
    };

    const updateWorkout = async (workoutId: string, workoutData: WorkoutData): Promise<ServiceResult> => {
        try {
            setLoading(true);
            setError(null);
            const result = await updateWorkoutService(workoutId, workoutData);
            if (result.success) {
                await fetchWorkouts();
            }
            return result;
        } catch (err) {
            setError('Failed to update workout');
            return { success: false, error: (err as Error).message };
        } finally {
            setLoading(false);
        }
    };

    const removeWorkout = async (workoutId: string): Promise<ServiceResult> => {
        try {
            setLoading(true);
            setError(null);
            const result = await deleteWorkoutService(workoutId);
            if (result.success) {
                await fetchWorkouts();
            }
            return result;
        } catch (err) {
            setError('Failed to delete workout');
            return { success: false, error: (err as Error).message };
        } finally {
            setLoading(false);
        }
    };

    const value: WorkoutContextType = {
        workouts,
        loading,
        error,
        stats,
        fetchWorkouts,
        addWorkout,
        updateWorkout,
        removeWorkout,
        setError,
    };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};

export default WorkoutContext;
