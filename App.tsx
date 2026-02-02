import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "./global.css";

import { AuthProvider } from './src/context/AuthContext';
import { WorkoutProvider } from './src/context/WorkoutContext';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => {
    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaProvider>
                <AuthProvider>
                    <WorkoutProvider>
                        <StatusBar style="light" />
                        <AppNavigator />
                    </WorkoutProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default App;
