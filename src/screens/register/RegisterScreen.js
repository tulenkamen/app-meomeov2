import React from 'react';
import RegisterUI from './RegisterUI';
import useRegisterLogic from './RegisterLogic';

const RegisterScreen = ({ navigation }) => {
    const {
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
    } = useRegisterLogic(navigation);

    return (
        <RegisterUI
            phone={phone}
            setPhone={setPhone}
            otp={otp}
            setOtp={setOtp}
            countdown={countdown}
            isButtonDisabled={isButtonDisabled}
            errorMessage={errorMessage}
            otpSentMessage={otpSentMessage}
            sendOtp={sendOtp}
            handleNext={handleNext}
            clearPhoneNumber={clearPhoneNumber}
        />
    );
};

export default RegisterScreen;