import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { login } = useAuth();

    const validateForm = (): boolean => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return false;
        }
        if (!password) {
            Alert.alert('Error', 'Please enter your password');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleLogin = async (): Promise<void> => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await login(email.trim(), password);
            if (!result.success) {
                Alert.alert('Login Failed', result.error || 'An error occurred');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerClassName="flex-1 justify-center p-6"
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center mb-8">
                    <Text className="text-6xl mb-4">💪</Text>
                    <Text className="text-3xl font-bold text-white mb-1">Welcome Back!</Text>
                    <Text className="text-sm text-text-secondary text-center">
                        Log in to continue your fitness journey
                    </Text>
                </View>

                <View className="mb-8">
                    <View className="mb-4">
                        <Text className="text-sm text-text-secondary mb-2">Email</Text>
                        <TextInput
                            className="bg-background-card rounded-xl p-4 text-white text-base border border-border"
                            placeholder="Enter your email"
                            placeholderTextColor="#6B6B8D"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm text-text-secondary mb-2">Password</Text>
                        <View className="relative">
                            <TextInput
                                className="bg-background-card rounded-xl p-4 pr-14 text-white text-base border border-border"
                                placeholder="Enter your password"
                                placeholderTextColor="#6B6B8D"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                className="absolute right-4 top-1/2 -translate-y-3"
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                <Text className="text-xl">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        className={`bg-primary rounded-xl p-4 items-center mt-4 ${isLoading ? 'opacity-70' : ''}`}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-base font-bold text-white">Log In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center items-center">
                    <Text className="text-base text-text-secondary">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={isLoading}>
                        <Text className="text-base text-primary font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
