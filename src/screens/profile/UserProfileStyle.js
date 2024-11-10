import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 18,
    },
    Container: {
        backgroundColor: '#f0f8ff',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#cccccc',
        padding: 10,
        marginBottom: 10,

    },
    header: {
        fontSize: 24,
        marginBottom: 5,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    header2: {
        fontSize: 20,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        flex: 1,
        fontWeight: 'bold',
        marginRight: 5,
        marginLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: '#f0f0f0',
        flex: 2,
        marginRight: 10,
    },
    input2: {
        borderWidth: 1,
        borderColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: '#fff',
        flex: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    button2: {
        borderColor: 'green',
        borderWidth: 3,
        backgroundColor: '#FFF',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText2: {
        color: 'green',
        fontSize: 20,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 20,
    },
});

export default styles;