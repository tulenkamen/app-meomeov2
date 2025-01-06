import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import styles from './UserProfileStyle';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';


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
    const [isLoading, setIsLoading] = useState(false);

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [formDataEmail, setFormDataEmail] = useState({});
    const [formDataEmailPicker, setFormDataEmailPicker] = useState({ emailPicker: false });

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

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

    const toggleSwitch = async () => {
        const newValue = !formDataEmailPicker.emailPicker;
        setFormDataEmailPicker({ emailPicker: newValue });

        try {
            await axios.put(updateUserByPhone, { emailPicker: newValue });
            console.log('Email picker status:', newValue);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
        }
    };
    // console.log('picker', formDataEmailPicker);

    //Updating Gmail Button Status
    const handleChangeEmail = (field, value) => {
        showResponseMessage('');
        setFormDataEmail({ ...formDataEmail, [field]: value });
    };
    //Date and Time change
    console.log('new date', date);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type === 'set') {
            const newDate = selectedDate || date;

            newDate.setHours(0, 0, 0, 0);

            setDate(newDate);
            const timestamp = {
                seconds: Math.floor(newDate.getTime() / 1000),
                nanoseconds: (newDate.getTime() % 1000) * 1000000
            };

            setFormDataEmail({ ...formDataEmail, timestampDate: timestamp });
            console.log('date', timestamp);
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (event.type === 'set') {
            const hours = selectedTime.getHours();
            const minutes = selectedTime.getMinutes();
            const seconds = selectedTime.getSeconds();

            const newDate = new Date(date);
            console.log('newdatedate', newDate);
            newDate.setHours(hours, minutes, seconds);
            console.log('newhour', newDate);
            setDate(newDate);

            const totalSeconds = hours * 3600 + minutes * 60 + seconds;

            const timestamp = {
                seconds: totalSeconds,
                nanoseconds: 0
            };

            setFormDataEmail({ ...formDataEmail, timestampTime: timestamp });
            console.log('time', timestamp);
        }
    };
    const handleEditEmail = () => {
        showResponseMessage('');
        setIsEditingEmail(true);
    };

    const handleSaveEmail = async () => {

        try {
            await axios.put(updateUserByPhone, formDataEmail);
            Alert.alert('Cập nhật thông tin hồ sơ thành công!');

        } catch (error) {
            console.error('Lỗi khi cập nhật dữ liệu:', error);
            Alert.alert('Cập nhật thông tin hồ sơ thất bại, kiểm tra lại kết nối Internet!');

        }
        setIsEditingEmail(false);
    };

    const getUserByPhone = `https://meomeov2-besv.onrender.com/users/get-phone/${phoneNumber}`;
    const updateUserByPhone = `https://meomeov2-besv.onrender.com/users/update-phone/${phoneNumber}`;
    const getALlDevices = `https://meomeov2-besv.onrender.com/devices/devices-name`;
    //Get User Data when got phoneNumber
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(getUserByPhone);
                const data = response.data[0];
                // console.log('sss', data);
                if (data) {
                    setUserData(data);
                    setFormData({
                        phoneNumber: data.phoneNumber || '',
                        address: data.address || '',
                        dateOfBirth: data.dateOfBirth || '',
                        citizenNumber: data.citizenNumber || '',
                        name: data.name || '',
                    });
                    setFormDataEmail({
                        email: data.email || '',
                        timestampDate: data.timestampDate || '',
                        timestampTime: data.timestampTime || '',
                    });
                    setFormDataEmailPicker({ emailPicker: data.emailPicker });
                    const deviceID = data.deviceId || 'undefined';
                    setFormDataDevice({
                        deviceId: deviceID || '',
                    });
                    setDeviceId(deviceID);
                    console.log(deviceId);
                    if (data.timestampDate && data.timestampTime) {
                        const dateSeconds = data.timestampDate.seconds;
                        const timeSeconds = data.timestampTime.seconds;
                        const date = new Date(dateSeconds * 1000 + timeSeconds * 1000);
                        const timeDate = new Date(date);
                        const timeHours = Math.floor(timeSeconds / 3600);
                        const timeMinutes = Math.floor((timeSeconds % 3600) / 60);
                        timeDate.setHours(timeHours, timeMinutes, 0);
                        setDate(timeDate);
                        console.log('timeda', timeDate);
                    }
                    if (deviceID) {
                        fetchDeviceStatus(deviceID);
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', error);
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
        const textRegex = text.replace(/:/g, '').slice(0, 12);
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
            await firestore()
                .collection('devices')
                .doc(userData.deviceId || 'undefined')
                .update({
                    [`linkedPhone:${phoneNumber}`]: firestore.FieldValue.delete()
                });

            try {
                await axios.put(updateUserByPhone, {
                    deviceId: deviceId,
                });
                setFormDataDevice({ ...formDataDevice, deviceId });
                setIsEditingDevice(false);
                showResponseMessage('Cập nhật thiết bị thành công!');
                Alert.alert('Thông Báo',
                    'Cập nhật thiết bị mới thành công! Vui lòng đăng nhập lại!',
                    [{
                        text: 'OK',
                        onPress: async () => {
                            await handleLogout();
                        },
                    }]
                );

            } catch (error) {
                console.error('Lỗi khi cập nhật thiết bị:', error);
                showResponseMessage('Không thể lấy dữ liệu, kiểm tra lại kết nối Internet!!!');
                Alert.alert('Lỗi khi lấy dữ liệu, kiểm tra kết nối internet.');
            }
        } catch (error) {
            console.error('Lỗi khi xóa số điện thoại liên kết:', error);
            showResponseMessage('Không thể xóa số điện thoại liên kết, vui lòng thử lại.');
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
        setIsLoading(true);
        try {
            const token = await messaging().getToken();
            await messaging().deleteToken();
            console.log('Token đã bị xóa', token);
            const userTopic = `user_${phone}`;
            const deviceTopic = `device_${deviceId.replace(/:/g, '_')}`;
            await messaging().unsubscribeFromTopic(userTopic);
            console.log(`Hủy topic ${userTopic}`);
            await messaging().unsubscribeFromTopic(deviceTopic);
            console.log(`Hủy topic ${deviceTopic}`);
            try {
                const response = await axios.put(`https://meomeov2-besv.onrender.com/users/update-phone/${phone}`, {
                    fcmToken: '',
                });
                console.log('Token updated successfully:', response.data);
            } catch (error) {
                console.error('Error updating token:', error);
            }

            await auth().signOut();
            console.log('Đăng xuất thành công');
            navigation.navigate('Auth');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            showResponseMessage('Đăng xuất thất bại! Vui lòng thử lại.');
            Alert.alert('Đăng xuất thất bại! Vui lòng thử lại.');
        }
        finally {
            setIsLoading(false);
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

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Đang đăng xuất, đợi xíu...</Text>
                <ActivityIndicator size="large" color="#228B22" />
            </View>
        )
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.Container}>
                <Text style={styles.header}>Xin chào, {userData?.name}!</Text>

                <View style={styles.Container2}>
                    <View style={styles.switchContainer}>
                        <Text style={styles.header2}>Báo Cáo Hàng Ngày</Text>
                        <View style={styles.switchWrapper}>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={formDataEmailPicker.emailPicker ? "#0056b3" : "#f4f3f4"}
                                onValueChange={toggleSwitch}
                                value={formDataEmailPicker.emailPicker}
                                style={styles.switch}
                            />
                        </View>
                    </View>
                    {formDataEmailPicker.emailPicker && (
                        <View style={styles.Container2}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Email nhận báo cáo:</Text>
                                <TextInput
                                    style={isEditingEmail ? styles.input2 : styles.input}
                                    placeholder="example@Email.com"
                                    value={formDataEmail.email}
                                    onChangeText={(value) => handleChangeEmail('email', value)}
                                    editable={isEditingEmail}
                                />
                            </View>
                            <Text style={styles.label}>Nhận báo cáo vào:</Text>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isEditingEmail) {
                                            setShowDatePicker(true);
                                        }
                                    }}
                                    style={[styles.buttonTime, { backgroundColor: isEditingEmail ? '#28a745' : '#666666' }]}
                                    disabled={!isEditingEmail}
                                >
                                    <Text style={styles.buttonText}>{date.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateChange}
                                    />
                                )}

                                <TouchableOpacity
                                    onPress={() => {
                                        if (isEditingEmail) {
                                            setShowTimePicker(true);
                                        }
                                    }}
                                    style={[styles.buttonTime, { backgroundColor: isEditingEmail ? '#28a745' : '#666666' }]}
                                    disabled={!isEditingEmail}
                                >
                                    <Text style={styles.buttonText}>{date.toLocaleTimeString()}</Text>
                                </TouchableOpacity>
                                {showTimePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="time"
                                        display="default"
                                        onChange={handleTimeChange}
                                    />
                                )}
                            </View>


                            {isEditingEmail ? (
                                <CustomButton title="Lưu" onPress={handleSaveEmail} />
                            ) : (
                                <CustomButton title="Chỉnh sửa" onPress={handleEditEmail} />
                            )}
                            <CustomButton2 title="Đăng xuất" onPress={confirmLogout} />
                        </View>
                    )}
                </View>
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
                        <Text style={styles.header2}>Thiết Bị Của Bạn</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>Mã thiết bị:</Text>
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