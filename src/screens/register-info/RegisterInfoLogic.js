import { useState } from 'react';

const useRegisterInfoLogic = (navigation, phone) => {
    const [name, setname] = useState('');
    const [citizenNumber, setcitizenNumber] = useState('');
    const [dateOfBirth, setdateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(phone);
    const urlCreate = `https://meomeov2-besv.onrender.com/users/create`;


    const createUser = async () => {
        try {
            const response = await fetch(urlCreate, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Có lỗi khi tạo người dùng!');
                throw new Error('User creation failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Có lỗi xảy ra khi tạo người dùng:', error);
            setErrorMessage('Không thể tạo người dùng. Vui lòng kiểm tra kết nối mạng!');
            throw error;
        }
    };

    const handleNext = async () => {
        if (!name) {
            setErrorMessage('Không được để trống Họ và tên!');
        } else {
            setErrorMessage('');
            console.log('Thông tin:', { name, citizenNumber, dateOfBirth, address });
            const userInfo = { name, citizenNumber, dateOfBirth, address };
            console.log(userInfo);
            const url = `https://meomeov2-besv.onrender.com/users/update-phone/${phoneNumber}`;
            console.log(url);

            try {
                await createUser();

                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userInfo),
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
                    return;
                }
                const data = await response.json();
                console.log('Dữ liệu trả về từ server:', data);
                setErrorMessage('Cập nhật thông tin thành công!');
                setTimeout(() => { //Wait for 2 secconds
                    navigation.navigate('Đăng Ký Thiết Bị', { phone }); // Chuyển đến màn hình đăng nhập
                }, 1000);
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

        }
    };

    return {
        phoneNumber,
        setPhoneNumber,
        name,
        setname,
        citizenNumber,
        setcitizenNumber,
        dateOfBirth,
        setdateOfBirth,
        address,
        setAddress,
        errorMessage,
        handleNext,
    };
};

export default useRegisterInfoLogic;