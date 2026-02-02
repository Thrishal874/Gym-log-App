import { TextStyle } from 'react-native';

export interface ThemeColors {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    secondaryDark: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    backgroundLight: string;
    backgroundCard: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderLight: string;
    gradientStart: string;
    gradientEnd: string;
}

export interface Spacing {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

export interface BorderRadius {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
}

export interface TypographyStyle {
    fontSize: number;
    fontWeight?: TextStyle['fontWeight'];
    color: string;
    textAlign?: TextStyle['textAlign'];
}

export interface Typography {
    h1: TypographyStyle;
    h2: TypographyStyle;
    h3: TypographyStyle;
    body: TypographyStyle;
    bodySmall: TypographyStyle;
    caption: TypographyStyle;
}

export interface Shadow {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
}

export interface Shadows {
    small: Shadow;
    medium: Shadow;
    large: Shadow;
}

export const colors: ThemeColors = {
    primary: '#6C63FF',
    primaryDark: '#5A52D5',
    primaryLight: '#8B85FF',
    secondary: '#FF6B6B',
    secondaryDark: '#E55555',
    accent: '#4ECDC4',
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',

    background: '#0F0F1A',
    backgroundLight: '#1A1A2E',
    backgroundCard: '#16213E',

    textPrimary: '#FFFFFF',
    textSecondary: '#B8B8D1',
    textMuted: '#6B6B8D',

    border: '#2A2A4A',
    borderLight: '#3A3A5A',

    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
};

export const spacing: Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius: BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export const typography: Typography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    body: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    bodySmall: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    caption: {
        fontSize: 12,
        color: colors.textMuted,
    },
};

export const shadows: Shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 8,
    },
};

export default {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
};
