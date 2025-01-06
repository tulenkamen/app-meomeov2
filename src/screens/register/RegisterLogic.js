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
    const [isLoading, setIsLoading] = useState(false);


    const clearPhoneNumber = () => {
        setPhone('');
        setErrorMessage(''); // Reset error message
    };

    const isValidPhoneNumber = (number) => {
        const phoneRegex = /^(0[0-9]\d{8})$/; // Kiểm tra số điện thoại Việt Nam
        return phoneRegex.test(number);
    };

    const sendOtp = async () => {
        setIsLoading(true);
        if (!isValidPhoneNumber(phone)) {
            setErrorMessage('Số điện thoại không hợp lệ!');
            setIsLoading(false);
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

            if (phoneExists) {
                setIsLoading(false);
                setErrorMessage('Số điện thoại đã được đăng ký, vui lòng kiểm tra lại!');
                return;
            }
        }
        catch (error) {
            setErrorMessage('Vui lòng kiểm tra lại kết nối mạng.');

        };
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
        setIsLoading(false);

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
            setIsLoading(false);
            return;
        }
        if (!otp || otp.length < 6) {
            setErrorMessage('Mã OTP không hợp lệ!');
            setIsLoading(false);
            return;
        }
        const formattedPhone = `+84${phone.slice(1)}`;

        try {
            // Lấy danh sách người dùng
            const response = await fetch(`https://meomeov2-besv.onrender.com/users/get-users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                setErrorMessage('Không thể kết nối tới máy chủ, vui lòng kiểm tra kết nối mạng!');
                return;
            }

            const users = await response.json();

            // Kiểm tra xem số điện thoại đã tồn tại chưa
            const phoneExists = users.some(user => user.phoneNumber === phone);

            if (phoneExists) {
                setErrorMessage('Số điện thoại đã được đăng ký, vui lòng kiểm tra lại!');
                return;
            }
            await confirm.confirm(otp);
            setErrorMessage('Đăng ký số điện thoại thành công!');
            await auth().signOut();
            setIsLoading(false);
            setTimeout(() => { //Wait for 2 secconds
                setErrorMessage('');
                // Chuyển đến màn hình đăng nhập
            }, 1000);
            navigation.navigate('Bổ Sung Thông Tin', { phone });

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
        isLoading,
    };
};

export default useRegisterLogic;