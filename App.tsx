// App.jsx
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
// Import Screens
import AuthScreen from './src/screens/auth/AuthScreen';
import RegisterScreen from './src/screens/register/RegisterScreen';
import RegisterInfo from './src/screens/register-info/RegisterInfoScreen';
import RegisterDevice from './src/screens/register-device/RegisterDeviceScreen';
import LoginScreen from './src/screens/login/LoginScreen';
//Import References
import MainTabNavigator from './src/navigators/MainTabNavigator';
import { navigationRef } from './src/utils/navigationRef';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigationRef.current?.navigate('Main');
      } else {
        navigationRef.current?.navigate('Auth');
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Đăng Ký" component={RegisterScreen} />
          <Stack.Screen name="Bổ Sung Thông Tin" component={RegisterInfo} />
          <Stack.Screen name="Đăng Ký Thiết Bị" component={RegisterDevice} />
          <Stack.Screen name="Đăng Nhập" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

export default App;