import React from 'react';
import LoginUI from './LoginUI';
import useLoginLogic from './LoginLogic';

const LoginScreen = ({ navigation }) => {
    const {
        phone,
        setPhone,
        otp,
        setOtp,
        countdown,
        isButtonDisabled,
        errorMessage,
        successMessage,
        otpSentMessage,
        sendOtp,
        handleNext,
        clearPhoneNumber,
    } = useLoginLogic(navigation);

    return (
        <LoginUI
            phone={phone}
            setPhone={setPhone}
            otp={otp}
            setOtp={setOtp}
            countdown={countdown}
            isButtonDisabled={isButtonDisabled}
            errorMessage={errorMessage}
            successMessage={successMessage}
            otpSentMessage={otpSentMessage}
            sendOtp={sendOtp}
            handleNext={handleNext}
            clearPhoneNumber={clearPhoneNumber}
        />
    );
};

export default LoginScreen;