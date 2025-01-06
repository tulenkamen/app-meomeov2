import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';


const useLoginLogic = (navigation) => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [otpSentMessage, setOtpSentMessage] = useState('');

    const clearPhoneNumber = () => {
        setPhone('');
        setErrorMessage('');
    };

    const isValidPhoneNumber = (number) => {
        const phoneRegex = /^(0[0-9]\d{8})$/; // Kiểm tra số điện thoại Việt Nam
        return phoneRegex.test(number);
    };

    const sendOtp = async () => {
        if (!isValidPhoneNumber(phone)) {
            setErrorMessage('Số điện thoại không hợp lệ!');
            return;
        }
        const formattedPhone = `+84${phone.slice(1)}`; // Bỏ số 0 ở đầu
        try {
            // Lấy danh sách người dùng
            const response = await fetch(`https://meomeov2-besv.onrender.com/users/get-users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                setErrorMessage('Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng!');
                return;
            }

            const users = await response.json();
            const phoneExists = users.some(user => user.phoneNumber === phone);

            if (!phoneExists) {
                setErrorMessage('Số điện thoại chưa được đăng ký, vui lòng kiểm tra lại!');
                return;
            }

            const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
            setConfirm(confirmation);
            setCountdown(30); // OTP Button
            setIsButtonDisabled(true);
            setErrorMessage(''); // Reset error message
            setOtpSentMessage('Đã gửi mã OTP thành công!');
            setTimeout(() => {
                setOtpSentMessage('');
            }, 5000);
        } catch (error) {
            setErrorMessage('Gửi mã xác minh thất bại. Vui lòng kiểm tra số điện thoại.');
        }
    };

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else {
            setIsButtonDisabled(false);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleNext = async () => {
        if (!isValidPhoneNumber(phone)) {
            setErrorMessage('Số điện thoại không hợp lệ!');
            return;
        }
        if (!otp || otp.length < 6) {
            setErrorMessage('Mã OTP không hợp lệ!');
            return;
        }
        try {
            // Lấy danh sách người dùng
            const response = await fetch(`https://meomeov2-besv.onrender.com/users/get-users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                setErrorMessage('Không thể lấy thông tin người dùng. Vui lòng kiểm tra kết nối mạng!');
                return;
            }

            const users = await response.json();

            const phoneExists = users.some(user => user.phoneNumber === phone);

            if (!phoneExists) {
                setErrorMessage('Số điện thoại chưa được đăng ký, vui lòng kiểm tra lại!');
                return;
            }
        }
        catch (error) {
            setErrorMessage('Vui lòng kiểm tra lại kết nối mạng.');

        };
        try {
            await confirm.confirm(otp);
            setSuccessMessage('Đăng nhập thành công!');
            setTimeout(async () => {
                let token = await AsyncStorage.getItem('fcm_token');
                if (!token) {
                    const token = await messaging().getToken();
                    await AsyncStorage.setItem('fcm_token', token);
                    console.log('New token:::::', token);
                    try {
                        const response = await axios.put(`https://meomeov2-besv.onrender.com/users/update-phone/${phone}`, {
                            fcmToken: token,
                        });
                        console.log('Token updated successfully:', response.data);
                        await messaging().subscribeToTopic(`user_${phone}`);
                        console.log(`FCM topiccc: user_${phone}`);

                    } catch (error) {
                        console.error('Error updating token:', error);
                    }
                }
                else {
                    console.log('Token retrieved:', token);
                    try {
                        const response = await axios.put(`https://meomeov2-besv.onrender.com/users/update-phone/${phone}`, {
                            fcmToken: token,
                        });
                        console.log('Token updated successfully:', response.data);
                        await messaging().subscribeToTopic(`user_${phone}`);
                        console.log(`FCM topiccc: user_${phone}`);

                    } catch (error) {
                        console.error('Error updating token:', error);
                    }
                }

                setSuccessMessage('');
                navigation.navigate('Main');
            }, 1000);
        }

        catch (error) {
            setErrorMessage('Mã xác minh không đúng.');
        }
    };

    return {
        phone,
        setPhone,
        otp,
        setOtp,
        countdown,
        isButtonDisabled,
        errorMessage,
        otpSentMessage,
        successMessage,
        sendOtp,
        handleNext,
        clearPhoneNumber,
    };
};

export default useLoginLogic;