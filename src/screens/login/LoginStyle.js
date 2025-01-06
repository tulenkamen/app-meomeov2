import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05,
    },
    header: {
        fontSize: width * 0.075,
        fontWeight: 'bold',
        marginBottom: height * 0.025,
        color: 'black',
    },
    label: {
        fontSize: width * 0.05,
        marginBottom: height * 0.012,
        color: 'black',
    },
    nextButton: {
        backgroundColor: '#28a745',
        paddingVertical: width * 0.035,
        borderRadius: width * 0.075,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.025,
    },
    nextText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.05,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: height * 0.012,
    },
    viewInput: {
        color: 'black',
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        padding: 10,
        marginRight: 2,
        borderRadius: width * 0.012,
        height: height * 0.07,
    },
    containerButton: {
        width: width * 0.2,
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        borderRadius: width * 0.025,
        marginLeft: 2,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.035,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    counter: {
        alignSelf: 'flex-end',
        marginBottom: height * 0.012,
        color: '#444444',
    },
    errorText: {
        color: 'red',
        marginTop: height * 0.035,
        textAlign: 'center',
        fontSize: width * 0.05,
    },
    successText: {
        color: 'green',
        marginTop: height * 0.035,
        textAlign: 'center',
        fontSize: width * 0.05,
    },
});

export default styles;