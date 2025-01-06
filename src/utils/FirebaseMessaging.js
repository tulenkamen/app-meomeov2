import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InitializeFCM = () => {
    useEffect(() => {
        const requestUserPermission = async () => {
            const authStatus = await messaging().requestPermission();
            console.log('Authorization status:', authStatus);
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status::::', authStatus);
                await getFCMToken();
            }
        };

        const getFCMToken = async () => {
            try {
                await messaging().registerDeviceForRemoteMessages();
                let fcmToken = await AsyncStorage.getItem('fcm_token');

                if (!fcmToken) {
                    const token = await messaging().getToken();
                    await AsyncStorage.setItem('fcm_token', token);
                    console.log('New token:::::', token);
                } else {
                    console.log('Old token found', fcmToken);
                }
            } catch (error) {
                console.error('Error getting FCM token:', error);
            }
        };

        requestUserPermission();
    }, []);

    return null;
};

export default InitializeFCM;