import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        padding: width * 0.02,
    },

    Container: {
        borderWidth: 2,
        backgroundColor: '#FFF',
        borderRadius: width * 0.025,
        borderColor: '#cccccc',
        padding: width * 0.025,
        marginBottom: height * 0.006,

    },
    Container2: {
        marginTop: height * 0.006,
        backgroundColor: '#FFF',
        marginBottom: height * 0.006,
    },
    header: {
        color: 'black',
        fontSize: width * 0.06,
        marginBottom: height * 0.006,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    header2: {
        color: 'black',
        fontSize: width * 0.05,
        marginBottom: height * 0.03,
        fontWeight: 'bold',
    },
    header3: {
        color: 'black',
        fontSize: width * 0.05,
        marginBottom: height * 0.03,
        fontWeight: 'bold',
    },
    label: {
        color: 'black',
        fontSize: width * 0.042,
        marginTop: height * 0.001,
        flex: 1,
        fontWeight: 'bold',
        marginRight: width * 0.0125,
        marginLeft: width * 0.025,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: width * 0.025,
        borderRadius: width * 0.0125,
        marginTop: height * 0.006,
        backgroundColor: '#f0f0f0',
        flex: 2,
        marginRight: width * 0.05,
        color: '#444444'
    },
    input2: {
        borderWidth: 1,
        borderColor: '#007BFF',
        padding: width * 0.025,
        borderRadius: width * 0.0125,
        marginTop: height * 0.006,
        backgroundColor: '#fff',
        flex: 2,
        color: 'black'

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.03,
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: width * 0.03,
        borderRadius: width * 0.075,
        alignItems: 'center',
        marginBottom: height * 0.006,
    },
    buttonTime: {
        width: width * 0.4,
        backgroundColor: '#28a745',
        paddingVertical: height * 0.015,
        borderRadius: width * 0.0125,
        alignItems: 'center',
        marginTop: height * 0.006,
        marginBottom: height * 0.006,
        marginHorizontal: width * 0.02,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'left',
    },
    switchWrapper: {
        width: width * 0.125,
        height: width * 0.075,
        marginLeft: width * 0.075,
        padding: width * 0.015,
        backgroundColor: '#fff',
    },
    switch: {
        transform: [{ scale: 1.3 }], // Thay đổi kích thước của switch
    },

    button2: {
        borderColor: '#B22222',
        borderWidth: 3,
        backgroundColor: '#FFF',
        paddingVertical: height * 0.015,
        borderRadius: width * 0.075,
        alignItems: 'center',
        marginTop: height * 0.01,
        marginBottom: height * 0.012,
    },
    buttonText2: {
        color: '#B22222',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginTop: height * 0.01,
        marginBottom: height * 0.02,
        textAlign: 'center',
        fontSize: width * 0.05,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#666666',
        fontSize: width * 0.05,
    }
});

export default styles;