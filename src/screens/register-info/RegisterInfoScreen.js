import React from 'react';
import RegisterInfoUI from './RegisterInfoUI';
import useRegisterInfoLogic from './RegisterInfoLogic';

const RegisterInfoScreen = ({ navigation, route }) => {
    const { phone } = route.params; // Lấy số điện thoại từ params
    const {
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
    } = useRegisterInfoLogic(navigation, phone);

    return (
        <RegisterInfoUI
            name={name}
            setname={setname}
            citizenNumber={citizenNumber}
            setcitizenNumber={setcitizenNumber}
            dateOfBirth={dateOfBirth}
            setdateOfBirth={setdateOfBirth}
            address={address}
            setAddress={setAddress}
            errorMessage={errorMessage}
            handleNext={handleNext}
        />
    );
};

export default RegisterInfoScreen;