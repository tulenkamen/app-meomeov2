import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import styles from './NotiStyle';

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

const NotificationItem = React.memo(({ item, onPress, onDelete }) => (
    <TouchableOpacity onPress={onPress} style={styles.notificationItem} disabled={item.isRead}>
        <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, { fontWeight: item.isRead ? 'normal' : 'bold' }]}>{item.title}</Text>
            {!item.isRead && <View style={styles.unreadIndicator} />}
            <Text style={[styles.notificationDate, { fontWeight: item.isRead ? 'normal' : 'bold' }]}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.separator} />
        <Text style={styles.contentText}>{item.content}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
    </TouchableOpacity>
));

export default NotificationItem;