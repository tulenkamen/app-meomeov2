import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

const useRegisterLogic = (navigation) => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [otpSentMessage, setOtpSentMessage] = useState('');
    const url = `https://meomeov2-besv.onrender.com/users/create`;
    const clearPhoneNumber = () => {
        setPhone('');
        setErrorMessage(''); // Reset error message
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
            const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
            setConfirm(confirmation);
            setCountdown(30);
            setIsButtonDisabled(true);
            setErrorMessage('');
            setOtpSentMessage('Đã gửi mã OTP thành công!');
            setTimeout(() => {
                setOtpSentMessage('');
            }, 5000);
        } catch (error) {
            console.error('Error sending OTP:', error);
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
            await confirm.confirm(otp);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Mã xác minh không đúng.');
        }
        try {
            await confirm.confirm(otp);
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phoneNumber: phone }),
                });
                if (!response.ok) {
                    console.log(response.status);
                    if (response.status === 400) { //Trùng phoneNumber
                        const errorData = await response.json();
                        setErrorMessage(errorData.message || 'Có lỗi xảy ra!');
                    } else {
                        setErrorMessage('Có lỗi xảy ra khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng!');
                        throw new Error('Network response was not ok');
                    }
                }
                else {
                    setErrorMessage('Đăng ký số điện thoại thành công!');
                    setTimeout(() => { //Wait for 2 secconds
                        navigation.navigate('Bổ Sung Thông Tin', { phone });
                        // Chuyển đến màn hình đăng nhập
                    }, 1000);
                }
            } catch (error) {
                console.error('Có lỗi xảy ra:', error);
                if (error.message === 'Network request failed') {
                    setErrorMessage('Không thể kết nối đến Máy chủ. Vui lòng kiểm tra kết nối mạng!');
                } else if (error.message.includes('Unexpected token')) {
                    setErrorMessage('Có lỗi xảy ra từ Máy chủ! Vui lòng thử lại hoặc liên hệ hỗ trợ: 0839359757!.');
                } else if (error.message.includes('Already read')) {
                    setErrorMessage('Số điện thoại đã được đăng ký, vui lòng kiểm tra lại!.');
                } else {
                    console.error('Có lỗi xảy ra:', error);
                    setErrorMessage('Có lỗi xảy ra khi gửi dữ liệu. Vui lòng kiểm tra kết nối mạng!');
                }
            }
        } catch (error) { }
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
        sendOtp,
        handleNext,
        clearPhoneNumber,
    };
};

export default useRegisterLogic;