import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotiScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Thông báo!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NotiScreen;