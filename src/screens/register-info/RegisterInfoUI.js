import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './RegisterStyle';

const RegisterInfoUI = ({
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
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Thông Tin Cá Nhân</Text>
            <Text style={styles.label}>Họ Và Tên</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setname}
                placeholder="Nhập họ và tên"
                placeholderTextColor="#666666"

            />
            <Text style={styles.label}>Mã Số CCCD</Text>
            <TextInput
                style={styles.input}
                value={citizenNumber}
                onChangeText={setcitizenNumber}
                placeholder="Nhập số CCCD:"
                placeholderTextColor="#666666"

                keyboardType="numeric"
                maxLength={12}
            />
            <Text style={styles.label}>Ngày sinh</Text>
            <TextInput
                style={styles.input}
                value={dateOfBirth}
                onChangeText={setdateOfBirth}
                placeholder="Nhập ngày sinh (dd-mm-yyyy)"
                placeholderTextColor="#666666"

            />
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Nhập địa chỉ"
                placeholderTextColor="#666666"

            />
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextText}>Chỉ Còn 1 Bước Nữa Thôi!</Text>
            </TouchableOpacity>
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
        </View>
    );
};

export default RegisterInfoUI;