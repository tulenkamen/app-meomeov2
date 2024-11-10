import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './RegisterStyle';

const RegisterUI = ({
    phone,
    setPhone,
    otp,
    setOtp,
    sendOtp,
    errorMessage,
    otpSentMessage,
    isButtonDisabled,
    countdown,
    handleNext,
    clearPhoneNumber,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Đăng Ký Tài Khoản</Text>
            <Text style={styles.label}>Bổ sung thông tin để tiếp tục</Text>
            <Text style={styles.label}>Số điện thoại:</Text>
            <View style={styles.viewContainer}>
                <TextInput
                    style={styles.viewInput}
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={10}
                    keyboardType="numeric"
                    placeholder="Nhập số điện thoại"
                />
                <TouchableOpacity onPress={clearPhoneNumber} style={styles.containerButton}>
                    <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.counter}>{phone.length}/10</Text>
            <Text style={styles.label}>Mã OTP:</Text>
            <View style={styles.viewContainer}>
                <TextInput
                    style={styles.viewInput}
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={6}
                    keyboardType="numeric"
                    placeholder="Nhập mã OTP"
                />
                <TouchableOpacity
                    onPress={sendOtp}
                    style={[styles.containerButton, isButtonDisabled && styles.disabledButton]}
                    disabled={isButtonDisabled}
                >
                    <Text style={styles.buttonText}>
                        {isButtonDisabled ? `Gửi lại (${countdown}s)` : 'Gửi OTP'}
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.counter}>{otp.length}/6</Text>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextText}>Đăng Ký</Text>
            </TouchableOpacity>
            {otpSentMessage ? <Text style={styles.successText}>{otpSentMessage}</Text> : null}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>
    );
};

export default RegisterUI;