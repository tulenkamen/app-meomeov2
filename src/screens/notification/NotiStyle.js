import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.02,
    },
    notificationItem: {
        padding: width * 0.025,
        backgroundColor: 'white',
        marginVertical: width * 0.012,
        borderRadius: width * 0.012,
    },
    unreadIndicator: {
        width: width * 0.025,
        height: width * 0.025,
        borderRadius: width * 0.0125,
        backgroundColor: 'red',
        marginRight: width * 0.175,
        shadowColor: 'rgba(255, 0, 0, 5)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 10,
        shadowRadius: 10,
        elevation: 6,

    },
    notificationTitle: {
        fontSize: width * 0.045,
        color: 'black',
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    notificationDate: {
        fontSize: width * 0.038,
        color: '#444444',

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContent: {
        paddingBottom: height * 0.025,
    },
    loadingText: {
        color: '#666666',
        fontSize: width * 0.05,
    },
    contentText: {
        fontSize: width * 0.038,
        color: '#444444',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 2,
    },
    nextButton: {
        backgroundColor: '#28a745',
        borderRadius: width * 0.035,
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 0.07,
    },
    nextText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.05,
    },
    lastButton: {
        borderColor: 'green',
        borderWidth: 2,
        backgroundColor: '#FFF',
        borderRadius: width * 0.035,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.007,
        height: height * 0.07,
    },
    successText: {
        marginTop: 0,
        color: 'green',
        textAlign: 'center',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    deleteButton: {
        width: width * 0.2,
        marginTop: height * 0.006,
        backgroundColor: '#28a745',
        padding: width * 0.012,
        borderRadius: width * 0.012,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
    },

});

export default styles;