import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './RegisterStyle';

const RegisterDeviceScreen = ({ navigation, route }) => {
    const { phone } = route.params;
    const [phoneNumber, setPhoneNumber] = useState(phone);
    const [deviceId, setDeviceId] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);
    const [devices, setDevices] = useState([]);
    // console.log(devices);
    // console.log(deviceId);
    // console.log({ deviceId });
    // console.log({ phoneNumber });
    const getALlDevices = `https://meomeov2-besv.onrender.com/devices/devices-name`;
    const updateByphoneNumber = `https://meomeov2-besv.onrender.com/users/update-phone/${phoneNumber}`;

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

    const handleDeviceIdChange = (text) => {
        const textRegex = text.replace(/[^0-9A-Fa-f]/g, '').slice(0, 12);
        const dotReform = textRegex.match(/.{1,2}/g)?.join(':') || '';
        setDeviceId(dotReform);
    };

    const fetchDevices = async () => {
        try {
            const response = await fetch(getALlDevices);
            const data = await response.json();
            setDevices(data);
        } catch (error) {
            console.error('Có lỗi xảy ra khi lấy danh sách thiết bị:', error);
            showResponseMessage('Vui lòng kiểm tra lại kết nối mạng!');
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleSubmit = async () => { //Nút nhấn
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
            const response = await fetch(updateByphoneNumber, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deviceId }), // Gửi deviceId đi cùng
            });

            const data = await response.json();
            console.log('Response from server:', data);
            showResponseMessage('Cập nhật Thiết bị quan trắc thành công!');
            setTimeout(() => {
                navigation.navigate('Đăng Nhập');
            }, 1000);
        } catch (error) {
            console.error('Có lỗi xảy ra khi cập nhật thông tin người dùng:', error);
            showResponseMessage('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    const clearTexts = () => {
        setDeviceId('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Nhập mã liên kết với thiết bị</Text>
            <Text style={styles.label}>Mã Device ID:</Text>
            <View style={styles.viewContainer2}>
                <TextInput
                    style={styles.viewInput}
                    value={deviceId}
                    onChangeText={handleDeviceIdChange}
                    maxLength={17}
                    placeholder="00:00:00:00:00:00"
                    keyboardType="default"
                />
                <TouchableOpacity onPress={clearTexts} style={styles.containerButton}>
                    <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.counter}>{deviceId.length}/17</Text>
            {responseMessage ? <Text style={styles.errorText}>{responseMessage}</Text> : null}
            <View style={styles.viewContainer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => handleSubmit()} // Thay thế bằng số điện thoại thực tế
                    disabled={!deviceId}
                >
                    <Text style={styles.nextText}>Hoàn Thành</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.lastButton}
                    onPress={() => navigation.navigate('Đăng Nhập')}
                >
                    <Text style={styles.lastText}>Tôi Sẽ Thiết Lập Sau!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RegisterDeviceScreen;