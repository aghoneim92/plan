import {
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { reloadAsync } from 'expo-updates';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  User,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { I18nManager, LogBox, Platform, UIManager } from 'react-native';
import './intl-polyfill';
import './src/i18n/i18n';
import LoadingScreen from './src/components/LoadingScreen';
import MainStack from './src/components/MainStack';
import { locale } from 'expo-localization';

const firebaseConfig = {
  apiKey: 'AIzaSyBcIwlSQRhoEGo93wuLEgC9iOO96vupFZQ',
  authDomain: 'recovery-13f85.firebaseapp.com',
  projectId: 'recovery-13f85',
  storageBucket: 'recovery-13f85.appspot.com',
  messagingSenderId: '370596872151',
  appId: '1:370596872151:web:0e463743fae4ad24431592',
  measurementId: 'G-PWVRFSZCJG',
};

initializeApp(firebaseConfig);

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

LogBox.ignoreLogs(['AsyncStorage']);

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [user, setUser] = useState<User | null>(getAuth().currentUser);

  useEffect(() => {
    signInAnonymously(getAuth());
  }, []);

  useEffect(() => {
    if (locale.includes('ar')) {
      if (!I18nManager.isRTL) {
        I18nManager.forceRTL(true);
        reloadAsync();
      }
    } else {
      if (I18nManager.isRTL) {
        I18nManager.forceRTL(false);
        reloadAsync();
      }
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);

    return unsubscribe;
  });

  if (!fontsLoaded || !user) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
