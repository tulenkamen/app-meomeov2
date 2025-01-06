import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05,
    },
    header: {
        fontSize: width * 0.07,
        fontWeight: 'bold',
        marginBottom: height * 0.006,
        marginTop: 0,
        color: 'black',
    },
    label: {
        color: '#444444',
        fontSize: width * 0.04,
        marginTop: height * 0.006,
        marginHorizontal: width * 0.03,
        marginBottom: height * 0.012,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: width * 0.025,
        height: height * 0.07,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButton: {
        backgroundColor: '#28a745',
        paddingVertical: height * 0.02,
        borderRadius: width * 0.075,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.025,
        height: height * 0.08,
    },
    nextText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.05,
    },
    lastText: {
        color: '#28a745',
        fontWeight: 'bold',
        fontSize: width * 0.05,
    },
    viewContainer: {
        flex: 0,
        marginTop: height * 0.006,
        marginVertical: height * 0.012,
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
        marginBottom: 10,
        color: '#666',
    },
    errorText: {
        marginTop: 0,
        color: 'red',
        marginTop: 15,
        textAlign: 'center',
        fontSize: 20,

    },
    successText: {
        marginTop: 0,
        color: 'green',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    lastButton: {
        borderColor: 'green',
        borderWidth: 2,
        backgroundColor: '#FFF',
        paddingVertical: height * 0.02,
        borderRadius: width * 0.075,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.025,
        height: height * 0.08,
    },
    image: {
        width: width * 0.4,
        height: width * 0.4,
        marginBottom: height * 0.02,
        alignItems: 'center',

    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',

    }
});

export default styles;