import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import styles from './NotiStyle';
import NotificationItem from './NotificationItem';

const NotiScreen = ({ route }) => {
    const { phone } = route.params;
    const [phoneNumber, setPhoneNumber] = useState(phone);
    const [deviceId, setDeviceId] = useState(null);
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            console.log('Đã nhận thông báo trong ứng dụng:', remoteMessage);
            if (remoteMessage.notification && remoteMessage.notification.body) {
                Alert.alert(
                    'Cảnh báo',
                    'Các chỉ số đang vượt mức cảnh báo, chuyển tới màn hình quan trắc?',
                    [
                        { text: 'OK', onPress: () => navigation.navigate('Quan Trắc') },
                        { text: 'Để sau', style: 'cancel' },
                    ],
                    { cancelable: false }
                );
                if (deviceId) {
                    await fetchNotifications(deviceId);
                }
            }
        });

        return () => {
            unsubscribeOnMessage();
        };
    }, [navigation, deviceId]);

    const fetchDeviceId = async () => {
        try {
            const response = await axios.get(`https://meomeov2-besv.onrender.com/users/get-phone/${phoneNumber}`);
            const data = response.data[0];
            console.log('dddd', data.deviceId)
            if (data.deviceId) {
                setDeviceId(data.deviceId);
                fetchNotifications(data.deviceId);

            } else {
                console.error('Device ID not found in response:', data);
            }
        } catch (error) {
            console.error('Error fetching device ID:', error);
        }
    };
    useEffect(() => {
        if (phoneNumber) {
            setIsProcessing(true);
            fetchDeviceId();
        }
    }, [phoneNumber]);

    const fetchNotifications = async (id) => {
        if (id && id.length > 0) {
            try {
                const userNotificationsSnapshot = await firestore()
                    .collection('user-notification')
                    .where('phoneNumber', '==', phoneNumber)
                    .where('deviceId', '==', id)
                    .get();
                const notificationsData = userNotificationsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data()['content-title'],
                    content: doc.data()['content-body'],
                    date: doc.data().createAt.seconds * 1000,
                    isRead: doc.data().isRead || false,
                }));

                const deviceNotificationsSnapshot = await firestore()
                    .collection('user-notification')
                    .where('deviceId', '==', id)
                    .where('phoneNumber', '==', '')
                    .get();
                const deviceNotifications = deviceNotificationsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data()['content-title'],
                    content: doc.data()['content-body'],
                    date: doc.data().createAt.seconds * 1000,
                    isRead: doc.data().isRead || false,
                }));

                const combinedNotifications = [...notificationsData, ...deviceNotifications];
                combinedNotifications.sort((a, b) => b.date - a.date);
                setNotifications(combinedNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }
    };


    useEffect(() => {
        if (deviceId) {
            fetchNotifications(deviceId);
        }
        setIsProcessing(false);
    }, [deviceId]);


    const markAsRead = useCallback(async (id) => {
        const notificationRef = firestore().collection('user-notification').doc(id);
        await notificationRef.update({ isRead: true });

        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, isRead: true } : notification
            )
        );

        console.log(`Marked as read: ID: ${id}`);
    }, []);


    const deleteNotification = useCallback((id) => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn xóa thông báo này?',
            [
                {
                    text: 'OK',
                    onPress: async () => {
                        const notificationRef = firestore().collection('user-notification').doc(id);
                        await notificationRef.delete();
                        setNotifications(prevNotifications =>
                            prevNotifications.filter(notification => notification.id !== id)
                        );
                        Alert.alert('Thông báo', 'Đã xóa thông báo.');
                    },
                },
                { text: 'Hủy', style: 'cancel' },

            ],
            { cancelable: false }
        );
    }, [notifications]);

    const markAllAsRead = async () => {
        const batch = firestore().batch();
        notifications.forEach(notification => {
            const notificationRef = firestore().collection('user-notification').doc(notification.id);
            batch.update(notificationRef, { isRead: true });
        });
        await batch.commit();
        setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    };
    const markAllAsUnRead = async () => {
        const batch = firestore().batch();
        notifications.forEach(notification => {
            const notificationRef = firestore().collection('user-notification').doc(notification.id);
            batch.update(notificationRef, { isRead: false });
        });
        await batch.commit();
        setNotifications(notifications.map(notification => ({ ...notification, isRead: false })));
    };

    const deleteAll = async () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn xóa tất cả thông báo?',
            [
                {
                    text: 'OK',
                    onPress: async () => {
                        const batch = firestore().batch();
                        notifications.forEach(notification => {
                            const notificationRef = firestore().collection('user-notification').doc(notification.id);
                            batch.delete(notificationRef);
                        });
                        await batch.commit();
                        setNotifications([]);
                        Alert.alert('Thông báo', 'Đã xóa tất cả thông báo.');
                    },
                },
                { text: 'Hủy', style: 'cancel' },

            ],
            { cancelable: false }
        );
    };
    const handleNotificationPress = async (item) => {
        if (isProcessing) return;
        setIsProcessing(true);
        if (!item.isRead) {
            await markAsRead(item.id);
        }
        navigation.navigate('Quan Trắc');
        setIsProcessing(false);
    };

    const renderItem = ({ item }) => (
        <NotificationItem
            item={item}
            onPress={() => handleNotificationPress(item)}
            onDelete={() => deleteNotification(item.id)}
        />
    );
    if (isProcessing) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Đang tải...</Text>
                <ActivityIndicator size="large" color="#228B22" />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={markAllAsRead} style={styles.nextButton}>
                <Text style={styles.nextText}>Đã đọc tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteAll} style={styles.lastButton}>
                <Text style={styles.successText}>Xóa tất cả</Text>
            </TouchableOpacity>
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.flatListContent}
                initialNumToRender={7}
            />
        </View>
    );
};


export default NotiScreen;