// App color palette for consistent theming

export const GRADIENT_ANGLE = 135;

export const Colors = {
  // Primary colors
  primary: {
    50: '#e6f0ff',
    100: '#cce0ff',
    200: '#99c2ff',
    300: '#66a3ff',
    400: '#3385ff',
    500: '#0066ff', // Main primary color
    600: '#0052cc',
    700: '#003d99',
    800: '#002966',
    900: '#001433',
    950: '#000a1a',
  },
  
  // UI Theme colors
  dark: {
    background: '#0c2340',       // Dark navy blue background
    card: 'rgba(255, 255, 255, 0.08)', // Card background with transparency
    text: '#ffffff',             // White text
    textSecondary: '#8E8E93',    // Secondary text color
    border: 'rgba(255, 255, 255, 0.1)', // Border color
    tabBar: '#0c2340',           // TabBar background color
    tabIcon: '#8E8E93',          // Inactive tab icon color
    tabIconActive: '#0066ff',    // Active tab icon color
    searchbar: 'rgba(255, 255, 255, 0.08)', // Search bar background
  },
  
  light: {
    background: '#ffffff',
    card: '#f2f2f7',
    text: '#000000',
    textSecondary: '#3c3c43',
    border: 'rgba(0, 0, 0, 0.1)',
    tabBar: '#ffffff',
    tabIcon: '#8E8E93',
    tabIconActive: '#0066ff',
    searchbar: '#e9e9eb',
  },
  
  // Functional colors
  functional: {
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
  },
  
  // Gradients
  gradients: {
    primary: ['#0066ff', '#00aaff'],
    cta: ['#0066ff', '#5e00ff'], 
    dark: ['#0c2340', '#163b64'],
  },
};