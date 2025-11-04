// Environment Configuration
// Replace with your deployed backend URL

const ENV = {
  development: {
    // Use deployed backend for development as well
    // API_URL: 'https://hajigarh-mart.vercel.app/api',
    // If you want to use local backend, uncomment below and comment above:
    API_URL: 'http://192.168.0.174:5000/api',  // For Android Emulator
    // API_URL: 'http://localhost:5000/api',  // For iOS Simulator
  },
  production: {
    API_URL: 'https://hajigarh-mart.vercel.app/api',
  },
};

// Automatically detect environment
const getEnvironment = () => {
  // You can also use __DEV__ flag in React Native
  return __DEV__ ? 'development' : 'production';
};

const currentEnv = getEnvironment();

export const API_URL = ENV[currentEnv as keyof typeof ENV].API_URL;

// Log the environment and API URL
console.log('🔧 [ENV] Current Environment:', currentEnv);
console.log('🔧 [ENV] API URL:', API_URL);
console.log('🔧 [ENV] __DEV__:', __DEV__);

// For manual override, export a function
export const setApiUrl = (url: string) => {
  return url;
};

export default {
  API_URL,
  setApiUrl,
};

