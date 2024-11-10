import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    nextButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    nextText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    viewInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        padding: 10,
        marginRight: 2,
        borderRadius: 10,
        height: 50,
    },
    containerButton: {
        width: 100,
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        borderRadius: 10,
        marginLeft: 2,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
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
        color: 'red',
        marginTop: 15,
        textAlign: 'center',
        fontSize: 20,
    },
    successText: {
        color: 'green',
        marginTop: 15,
        textAlign: 'center',
        fontSize: 20,
    },
});

export default styles;