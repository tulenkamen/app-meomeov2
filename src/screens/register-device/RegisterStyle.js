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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        padding: width * 0.025,
        borderRadius: width * 0.025,
        height: height * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
    },
    nextButton: {
        backgroundColor: '#28a745',
        paddingVertical: height * 0.02,
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
    lastText: {
        color: '#width*0.075a745',
        fontWeight: 'bold',
        fontSize: width * 0.05,
    },
    viewContainer: {
        flex: 0,
        justifyContent: 'flex-end',
        marginTop: height * 0.035,
        marginBottom: height * 0.025,
        marginVertical: width * 0.025,
    },
    viewContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: width * 0.025,
    },
    viewInput: {
        color: 'black',
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        padding: width * 0.025,
        marginRight: 2,
        borderRadius: width * 0.025,
        height: height * 0.07,
    },
    containerButton: {
        width: width * 0.2,
        backgroundColor: '#007BFF',
        paddingVertical: width * 0.025,
        borderRadius: width * 0.025,
        marginLeft: 2,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.04,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    counter: {
        alignSelf: 'flex-end',
        marginBottom: height * 0.012,
        color: '#666',
    },
    errorText: {
        color: 'red',
        marginTop: height * 0.025,
        textAlign: 'center',
        fontSize: width * 0.05,

    },
    successText: {
        color: 'green',
        marginTop: height * 0.02,
        textAlign: 'center',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    lastButton: {
        borderColor: 'green',
        borderWidth: 3,
        backgroundColor: '#FFF',
        paddingVertical: width * 0.045,
        borderRadius: width * 0.075,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.025,
    },
});

export default styles;