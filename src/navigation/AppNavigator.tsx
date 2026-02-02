import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { Workout } from '../services/workoutService';
import { colors, borderRadius } from '../styles/theme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import WorkoutListScreen from '../screens/WorkoutListScreen';
import EditWorkoutScreen from '../screens/EditWorkoutScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Type definitions
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type MainTabParamList = {
    Dashboard: undefined;
    Workouts: undefined;
    AddWorkout: undefined;
    Profile: undefined;
};

export type RootStackParamList = {
    MainTabs: undefined;
    EditWorkout: { workout: Workout };
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

const screenOptions = {
    headerStyle: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
    },
    headerTintColor: colors.textPrimary,
    headerTitleStyle: {
        fontWeight: 'bold' as const,
    },
    cardStyle: {
        backgroundColor: colors.background,
    },
};

interface TabIconProps {
    icon: string;
    focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, focused }) => (
    <View style={[styles.tabIconContainer, focused && styles.tabIconActive]}>
        <Text style={styles.tabIcon}>{icon}</Text>
    </View>
);

const MainTabs: React.FC = () => {
    return (
        <MainTab.Navigator
            screenOptions={{
                ...screenOptions,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: true,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: styles.tabLabel,
                headerShown: true,
            }}
        >
            <MainTab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
                    title: 'Home',
                    headerTitle: 'Dashboard',
                }}
            />
            <MainTab.Screen
                name="Workouts"
                component={WorkoutListScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon icon="📋" focused={focused} />,
                    title: 'Workouts',
                }}
            />
            <MainTab.Screen
                name="AddWorkout"
                component={AddWorkoutScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon icon="➕" focused={focused} />,
                    title: 'Add',
                    headerTitle: 'Add Workout',
                }}
            />
            <MainTab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
                    title: 'Profile',
                }}
            />
        </MainTab.Navigator>
    );
};

const AuthStackNavigator: React.FC = () => {
    return (
        <AuthStack.Navigator screenOptions={{ ...screenOptions, headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
};

const AppStackNavigator: React.FC = () => {
    return (
        <RootStack.Navigator screenOptions={screenOptions}>
            <RootStack.Screen
                name="MainTabs"
                component={MainTabs}
                options={{ headerShown: false }}
            />
            <RootStack.Screen
                name="EditWorkout"
                component={EditWorkoutScreen}
                options={{
                    title: 'Edit Workout',
                    headerBackTitle: 'Back',
                }}
            />
        </RootStack.Navigator>
    );
};

const LoadingScreen: React.FC = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
    </View>
);

const AppNavigator: React.FC = () => {
    const { user, loading, isAuthenticated } = useAuth();

    console.log('AppNavigator - loading:', loading, 'isAuthenticated:', isAuthenticated, 'user:', user?.email);

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppStackNavigator /> : <AuthStackNavigator />}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.backgroundCard,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        height: 70,
        paddingBottom: 8,
        paddingTop: 8,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    tabIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabIconActive: {
        backgroundColor: colors.backgroundLight,
    },
    tabIcon: {
        fontSize: 22,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 16,
        color: colors.textSecondary,
        fontSize: 16,
    },
});

export default AppNavigator;
