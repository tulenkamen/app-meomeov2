import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './AuthStyle';

const AuthScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../../images/UTC21.png')}
                    style={styles.image}
                />
                <Text style={styles.header}>Hệ thống quan trắc và cảnh báo chất lượng nước hồ tôm</Text>
                <Text style={styles.label}>Một sản phẩm bổ trợ cho những hệ thống bán tự động sẵn có của hộ nuôi tôm, giúp bạn tự động hóa quá trình đo đạc và cập nhật trạng thái môi trường nước trong quá trình phát triển của tôm.  </Text>

            </View>
            <View style={styles.viewContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Đăng Nhập')}
                    style={styles.nextButton}>
                    <Text style={styles.nextText}>Đăng Nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Đăng Ký')}
                    style={styles.lastButton}>
                    <Text style={styles.successText}>Đăng Ký</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AuthScreen;