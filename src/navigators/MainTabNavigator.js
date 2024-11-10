import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';

import { FormDataProvider } from '../utils/GlobalVariables';
// Import Screens
import NotiScreen from '../screens/notification/NotiScreen';
import MonitorScreen from '../screens/monitor/MonitorScreen';
import SettingsScreen from '../screens/setting/SettingsScreen';
import UserProfile from '../screens/profile/UserProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {

    const [phone, setPhone] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const user = auth().currentUser;
        if (user) {
            const internationalPhone = user.phoneNumber;
            const localPhone = convertToLocalPhone(internationalPhone);
            setPhone(localPhone);
            setIsEditing(true);
            console.log('User Phone Number:', localPhone);
            console.log('sdt', phone);
        }
    }, []);

    const convertToLocalPhone = (phone) => {
        if (phone.startsWith('+84')) {
            return '0' + phone.slice(3);
        }
        return phone;
    };
    if (!isEditing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#228B22" />
                <Text>Đang tải thông tin...</Text>
            </View>
        );
    }
    return (
        <FormDataProvider>
            <Tab.Navigator
                initialRouteName="Cài Đặt"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Quan Trắc') {
                            iconName = 'fishbowl-outline';
                        } else if (route.name === 'Thông Báo') {
                            iconName = 'bell-ring-outline';
                        } else if (route.name === 'Cài Đặt') {
                            iconName = 'cog-outline';
                        } else if (route.name === 'Cá Nhân') {
                            iconName = 'account-key-outline';
                        }

                        return (
                            <Icon
                                name={iconName}
                                size={size}
                                color={color}
                                type="material-community"
                            />
                        );
                    },
                    tabBarLabel: ({ focused, color }) => (
                        <Text style={[styles.tabLabel, { color }]}>
                            {route.name}
                        </Text>

                    ),
                    tabBarActiveTintColor: '#228B22',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: { height: 60 },
                })}
            >
                <Tab.Screen name="Thông Báo" component={NotiScreen} initialParams={{ phone }} options={{
                    headerTitle: () => (
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Thông Báo</Text>
                        </View>
                    ),
                }}
                />
                <Tab.Screen name="Quan Trắc" component={MonitorScreen} initialParams={{ phone }} options={{
                    headerTitle: () => (
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Biểu Đồ Quan Trắc</Text>
                        </View>
                    ),
                }} />
                <Tab.Screen name="Cài Đặt" component={SettingsScreen} initialParams={{ phone }} options={{
                    headerTitle: () => (
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Cài Đặt Thông Báo</Text>
                        </View>
                    ),
                }} />
                <Tab.Screen name="Cá Nhân" component={UserProfile} initialParams={{ phone }} options={{
                    headerTitle: () => (
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Thông Tin Cá Nhân</Text>
                        </View>
                    ),
                }} />
            </Tab.Navigator>
        </FormDataProvider>
    );
};

const styles = StyleSheet.create({
    headerTitleContainer: {
        height: 60,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#228B22',
        textAlign: 'center',
    },

    tabLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default MainTabNavigator;