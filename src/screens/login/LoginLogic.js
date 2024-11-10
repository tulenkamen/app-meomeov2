import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
const useLoginLogic = () => {
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
            await confirm.confirm(otp);
            setSuccessMessage('Đăng nhập thành công!');
            setTimeout(() => {
                setSuccessMessage('');
                // navigation.navigate('Main', { phone });
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