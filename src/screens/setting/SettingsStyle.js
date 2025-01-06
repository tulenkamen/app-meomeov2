import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        padding: width * 0.02,
    },
    error: {
        color: 'red',
    },
    labelText: {
        marginTop: height * 0.045,
        marginBottom: height * 0.012,
        color: 'black',

    },
    labelText1: {
        padding: width * 0.0125,
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: 2,
        color: 'black',

    },
    labelText2: {
        marginLeft: width * 0.0125,
        marginTop: height * 0.006,
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: 'black',

    },
    labelText4: {
        marginLeft: width * 0.0125,
        fontSize: width * 0.035,
        marginBottom: height * 0.006,
        color: '#666',
    },
    labelTextBelow: {
        padding: width * 0.0125,
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: 2,
        color: 'red',
    },
    labelTextUpper: {
        padding: width * 0.0125,
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: 2,
        color: 'orange',
    },

    Container: {
        backgroundColor: '#FFF',
        borderRadius: width * 0.025,
        borderWidth: 2,
        borderColor: '#cccccc',
        padding: width * 0.025,
        marginBottom: height * 0.006,

    },
    chartContainer: {
        backgroundColor: '#FFF',
        borderRadius: width * 0.025,
        borderWidth: 2,
        borderColor: '#cccccc',
        padding: width * 0.025,
        marginBottom: height * 0.04,

    },
    legendContainer: {
        flexDirection: 'row',
        marginTop: height * 0.012,
        padding: width * 0.0125,
        marginLeft: width * 0.1,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: height * 0.012,
    },
    activeButton: {
        backgroundColor: '#177AD5',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    temperatureText: {
        padding: width * 0.0125,
        fontSize: width * 0.056,
        fontWeight: 'bold',
        color: 'black',

    },
    header: {
        fontSize: width * 0.06,
        marginBottom: height * 0.006,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',

    },
    header2: {
        fontSize: width * 0.05,
        marginBottom: height * 0.02,
        fontWeight: 'bold',
        color: 'black',
    },
    label: {
        fontSize: width * 0.04,
        marginTop: height * 0.012,
        flex: 1,
        fontWeight: 'bold',
        marginRight: width * 0.0125,
        marginLeft: 10,
    },
    input: {
        height: height * 0.07,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: width * 0.025,
        borderRadius: width * 0.0125,
        marginTop: height * 0.006,
        backgroundColor: '#f0f0f0',
        flex: 2,
        marginRight: width * 0.0125,
        color: '#444444'

    },
    input2: {
        height: height * 0.07,
        borderWidth: 1,
        borderColor: '#007BFF',
        padding: width * 0.025,
        borderRadius: width * 0.0125,
        marginTop: height * 0.006,
        marginRight: width * 0.0125,
        backgroundColor: '#fff',
        flex: 2,
        color: 'black'

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: height * 0.012,
        marginBottom: height * 0.012,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    button2: {
        borderColor: 'green',
        borderWidth: 3,
        backgroundColor: '#FFF',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: height * 0.012,
        marginBottom: height * 0.012,
    },
    buttonText2: {
        color: 'green',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginTop: height * 0.006,
        marginBottom: height * 0.04,
        textAlign: 'center',
        fontSize: width * 0.05,
    },
    errorText1: {
        color: 'red',
        marginTop: height * 0.006,
        marginBottom: height * 0.006,
        textAlign: 'center',
        fontSize: width * 0.04,
    },
    picker: {
        height: height * 0.07,
        width: width * 0.56,
        backgroundColor: '#f0f0f0',
        borderWidth: 3,
        borderColor: '#ccc',
        borderRadius: width * 0.0125,
        marginTop: height * 0.006,
        marginRight: width * 0.03,
        marginLeft: width * 0.033,
        color: '#444444'

    },
    picker2: {
        height: height * 0.07,
        width: width * 0.56,
        backgroundColor: '#F5F5F5',
        borderWidth: 3,
        borderColor: '#007BFF',
        borderRadius: width * 0.0125,
        marginTop: height * 0.006,
        marginRight: width * 0.03,
        marginLeft: width * 0.033,
        color: 'black'

    },
    picker12: {
        height: height * 0.07,
        width: width * 0.56,
        backgroundColor: '#f0f0f0',
        borderWidth: 3,
        borderColor: '#ccc',
        borderRadius: width * 0.0125,
        marginTop: height * 0.006,
        marginRight: width * 0.03,
        marginLeft: width * 0.038,
        color: '#444444'

    },
    picker22: {
        height: height * 0.07,
        width: width * 0.56,
        backgroundColor: '#F5F5F5',
        borderWidth: 3,
        borderColor: '#007BFF',
        borderRadius: width * 0.0125,
        marginTop: height * 0.006,
        marginRight: width * 0.03,
        marginLeft: width * 0.038,
        color: 'black'

    },
    picker11: {
        height: height * 0.07,
        width: width * 0.35,
        backgroundColor: '#f0f0f0',
        borderWidth: 3,
        borderColor: '#ccc',
        borderRadius: width * 0.0125,
        marginTop: height * 0.006,
        marginRight: width * 0.02,
        marginLeft: width * 0.0125,
        color: '#444444'


    },
    picker21: {
        height: height * 0.07,
        width: width * 0.35,
        backgroundColor: '#F5F5F5',
        borderWidth: 3,
        borderColor: '#007BFF',
        borderRadius: width * 0.0125,
        marginTop: height * 0.006,
        marginRight: width * 0.02,
        marginLeft: width * 0.0125,
        color: 'black'

    },

});

export default styles;