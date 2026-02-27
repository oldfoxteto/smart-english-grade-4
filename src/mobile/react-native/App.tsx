import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import our screens
import { WelcomeScreen } from './screens';
import { AppNavigator } from './navigation/AppNavigator';
import { NavigationService } from './services';

const { width, height } = Dimensions.get('window');

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main App Component
const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Welcome');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize app services
        console.log('Initializing AI English Master App...');
        
        // Check if user has completed onboarding
        const hasCompletedOnboarding = false; // Check from storage
        
        setInitialRoute(hasCompletedOnboarding ? 'MainApp' : 'Welcome');
        setIsReady(true);
        
        console.log('App initialized successfully!');
      } catch (error) {
        console.error('App initialization failed:', error);
        Alert.alert(
          'Initialization Error',
          'Failed to initialize app. Please restart.',
          [{ text: 'OK' }]
        );
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>AI English Master</Text>
        <Text style={styles.loadingSubtext}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={(navigator) => {
        if (navigator) {
          NavigationService.setTopLevelNavigator(navigator);
        }
      }}
    >
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#4CAF50"
        translucent={false}
      />
      <SafeAreaView style={styles.container}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="MainApp" component={AppNavigator} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default App;
