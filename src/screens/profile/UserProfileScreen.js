import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import styles from './UserProfileStyle';
import auth from '@react-native-firebase/auth';


const UserProfileScreen = ({ navigation, route }) => {
    const { phone } = route.params;
    const [phoneNumber, setPhoneNumber] = useState(phone);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isEditingDevice, setIsEditingDevice] = useState(false);
    const [formDataDevice, setFormDataDevice] = useState({});
    const [deviceId, setDeviceId] = useState([]);
    const [devices, setDevices] = useState([]);
    const [timeoutId, setTimeoutId] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [deviceStatus, setDeviceStatus] = useState([]);

    const showResponseMessage = (message) => {
        setResponseMessage(message);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            setResponseMessage('');
        }, 5000);
        setTimeoutId(id);
    };

    console.log(phoneNumber);
    console.log('Phone:', phone);

    const getUserByPhone = `https://meomeov2-besv.onrender.com/users/get-phone/${phoneNumber}`;
    const updateUserByPhone = `https://meomeov2-besv.onrender.com/users/update-phone/${phoneNumber}`;
    const getALlDevices = `https://meomeov2-besv.onrender.com/devices/devices-name`;
    //Get User Data when got phoneNumber
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(getUserByPhone);
                const data = response.data[0];
                console.log(data);
                if (data) {
                    setUserData(data);
                    setFormData({
                        phoneNumber: data.phoneNumber || '',
                        address: data.address || '',
                        dateOfBirth: data.dateOfBirth || '',
                        citizenNumber: data.citizenNumber || '',
                        name: data.name || '',
                    });
                    const deviceID = data.deviceId || '';
                    setFormDataDevice({
                        deviceId: deviceID || '',
                    });
                    setDeviceId(deviceID);
                    console.log(deviceId);
                    if (deviceID) {
                        fetchDeviceStatus(deviceID);
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                showResponseMessage('Không thể lấy dữ liệu, kiểm tra lại kết nối Internet!!!');
            }
        };
        if (phoneNumber) {
            fetchData();
        }
    }, [phoneNumber]);



    const fetchDeviceStatus = async (id) => {
        if (id && id.length > 0) {
            try {
                const url = `https://meomeov2-besv.onrender.com/devices/device-update/${id}/get-device`;
                const response = await axios.get(url);
                const data = response.data;
                console.log('Fetched device status data:', data);
                console.log('URL:', url);
                if (data && data.deviceStatus !== undefined) {
                    setFormDataDevice((prevFormDataDevice) => ({
                        ...prevFormDataDevice,
                        deviceStatus: data.deviceStatus,
                    }));
                    const status = data.deviceStatus === 1 ? 'Hoạt động' : 'Không hoạt động';
                    setDeviceStatus(status);
                } else {
                    console.log('No device status found');
                }
            } catch (error) {
                console.error('Cập nhật trạng thái thiết bị thất bại:', error);
                showResponseMessage('Không thể lấy dữ liệu, kiểm tra lại kết nối Internet!!!');
            }
        }
    };

    //Updating User Button Status
    const handleEdit = () => {
        showResponseMessage('');
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await axios.put(updateUserByPhone, formData);
            setUserData(formData);
            setIsEditing(false);
            showResponseMessage('Cập nhật người dùng thành công!');
            Alert.alert('Cập nhật người dùng thành công!');

        } catch (error) {
            console.error('Lỗi khi cập nhật dữ liệu:', error);
            showResponseMessage('Cập nhật dữ liệu thất bại! Vui lòng kiểm tra lại kết nối mạng!');
            Alert.alert('Cập nhật người dùng thất bại, kiểm tra lại kết nối Internet!');

        }
    };

    const handleChange = (field, value) => {
        showResponseMessage('');
        setFormData({ ...formData, [field]: value });
    };
    // The end of user, this part is for Updating Device

    const fetchDevices = async () => {
        try {
            const response = await fetch(getALlDevices);
            const data = await response.json();
            setDevices(data);
        } catch (error) {
            console.error('Có lỗi xảy ra khi lấy danh sách thiết bị:', error);
            showResponseMessage('Vui lòng kiểm tra lại kết nối mạng!');
            Alert.alert('Vui lòng kiểm tra lại kết nối mạng!');

        }
    };
    useEffect(() => {
        fetchDevices();
    }, []);


    const handleDeviceIdChange = (text) => {
        const textRegex = text.slice(0, 12);
        const dotReform = textRegex.match(/.{1,2}/g)?.join(':') || '';
        setDeviceId(dotReform);
    };

    const handleSaveDevice = async () => {
        if (deviceId.length < 17) {
            showResponseMessage('Mã thiết bị không hợp lệ, vui lòng kiểm tra lại!');
            return;
        }
        //So sánh với tệp devices
        if (!devices.includes(deviceId)) {
            showResponseMessage('Thiết bị không tồn tại, vui lòng kiểm tra lại mã!!!');
            return;
        }
        try {
            await axios.put(updateUserByPhone, {
                deviceId: deviceId,
            });
            setFormDataDevice({ ...formDataDevice, deviceId });
            setIsEditingDevice(false);
            showResponseMessage('Cập nhật thiết bị thành công!');
            Alert.alert('Cập nhật thiết bị thành công!');

        } catch (error) {
            console.error('Lỗi khi cập nhật thiết bị:', error);
            showResponseMessage('Không thể lấy dữ liệu, kiểm tra lại kết nối Internet!!!');
            Alert.alert('Lỗi khi lấy dữ liệu, kiểm tra lại kết nối internet.');

        }
    };

    const handleEditDevice = () => {
        setIsEditingDevice(true);
    };

    const handleCancelDeviceEdit = () => {
        setDeviceId(deviceId);
        setIsEditingDevice(false);
    };

    const handleLogout = async () => {
        try {
            await auth().signOut();
            console.log('Đăng xuất thành công');
            navigation.navigate('Auth');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            showResponseMessage('Đăng xuất thất bại! Vui lòng thử lại.');
            Alert.alert('Đăng xuất thất bại! Vui lòng thử lại.');
        }
    };

    const confirmLogout = () => {
        Alert.alert(
            'Xác nhận đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                {
                    text: 'Hủy',
                    onPress: () => console.log('Đăng xuất bị hủy'),
                    style: 'cancel',
                },
                {
                    text: 'Đăng xuất',
                    onPress: handleLogout,
                },
            ],
            { cancelable: false }
        );
    };

    const CustomButton = ({ title, onPress }) => (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
    const CustomButton2 = ({ title, onPress }) => (
        <TouchableOpacity style={styles.button2} onPress={onPress}>
            <Text style={styles.buttonText2}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.Container}>
                <Text style={styles.header}>Xin chào, {userData?.name}!</Text>
                <CustomButton2 title="Đăng xuất" onPress={confirmLogout} />

            </View>

            {userData && (
                <>
                    <View style={styles.Container}>

                        <Text style={styles.header2}>Thông Tin Của Bạn</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Họ và tên:</Text>
                            <TextInput
                                style={isEditing ? styles.input2 : styles.input}
                                value={formData.name}
                                onChangeText={(value) => handleChange('name', value)}
                                editable={isEditing}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>CCCD:</Text>
                            <TextInput
                                style={isEditing ? styles.input2 : styles.input}
                                value={formData.citizenNumber}
                                onChangeText={(value) => handleChange('citizenNumber', value)}
                                editable={isEditing}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Ngày sinh:</Text>
                            <TextInput
                                style={isEditing ? styles.input2 : styles.input}
                                value={formData.dateOfBirth}
                                onChangeText={(value) => handleChange('dateOfBirth', value)}
                                editable={isEditing}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Địa chỉ:</Text>
                            <TextInput
                                style={isEditing ? styles.input2 : styles.input}
                                value={formData.address}
                                onChangeText={(value) => handleChange('address', value)}
                                editable={isEditing}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Số điện thoại:</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.phoneNumber}
                                editable={false}
                            />
                        </View>
                        {isEditing ? (
                            <CustomButton title="Lưu" onPress={handleSave} />
                        ) : (
                            <CustomButton title="Chỉnh sửa" onPress={handleEdit} />
                        )}
                        <CustomButton2 title="Đăng xuất" onPress={confirmLogout} />


                    </View>

                    <View style={styles.Container}>

                        <View style={styles.row}>
                            <Text style={styles.label}>Thiết bị của bạn:</Text>
                            <TextInput
                                style={isEditingDevice ? styles.input2 : styles.input}
                                value={isEditingDevice ? deviceId : formDataDevice.deviceId}
                                maxLength={17}
                                placeholder="00:00:00:00:00:00"
                                keyboardType="default"
                                onChangeText={handleDeviceIdChange}
                                editable={isEditingDevice}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Trạng thái thiết bị:</Text>
                            <TextInput
                                style={styles.input}
                                value={deviceStatus}
                                editable={false}
                            />
                        </View>
                        {isEditingDevice ? (
                            <>
                                <CustomButton title="Lưu thiết bị" onPress={handleSaveDevice} />
                                <CustomButton2 title="Hủy" onPress={handleCancelDeviceEdit} />
                            </>
                        ) : (
                            <CustomButton title="Chỉnh sửa thiết bị" onPress={handleEditDevice} />
                        )}
                        {responseMessage ? <Text style={styles.errorText}>{responseMessage}</Text> : null}
                    </View>

                </>
            )}
        </ScrollView>
    );
};

export default UserProfileScreen;