import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
    },
    labelText: {
        marginTop: 30,
        marginBottom: 10,
    },
    labelText1: {
        padding: 5,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    labelText2: {
        padding: 5,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
        color: 'orange',
    },
    focusedValueContainer: {
        flex: 0,
        height: 90,
        width: 250,
        marginTop: 5,
        marginBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: 'orange',
        borderRadius: 5,
        padding: 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#cccccc',
    },
    focusedValueText2: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 7,
        padding: 5,
    },

    focusedValueText: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
    },
    Container: {
        backgroundColor: '#f0f8ff',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#cccccc',
        padding: 10,
        marginBottom: 10,

    },
    chartContainer: {
        backgroundColor: '#f0f8ff',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#cccccc',
        padding: 10,
        marginBottom: 30,

    },
    legendContainer: {
        flexDirection: 'row',
        marginTop: 10,
        padding: 5,
        marginLeft: 40,
    },
    legendContainerPie: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 5,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    legendItemPie: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
    },
    colorBox: {
        width: 30,
        height: 10,
        marginRight: 5,
        padding: 5,
    },
    colorBoxPie: {
        width: 20,
        height: 10,
        marginRight: 5,
        padding: 0,
    },
    pieContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,

    },
    pieChartContainer: {
        padding: 10,
        backgroundColor: '#f0f8ff',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#cccccc',
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#cccccc',
        backgroundColor: 'white',
    },
    activeButton: {
        backgroundColor: '#177AD5',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    tempContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        backgroundColor: '#f0f8ff',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#cccccc',
        flex: 1,
        alignItems: 'Left',
        marginBottom: 5,
    },
    tempTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,

    },
    temperatureText: {
        padding: 5,
        fontSize: 22,
        fontWeight: 'bold',
    },
    temperatureText2: {
        padding: 2,
        fontSize: 22,
        fontWeight: 'bold',
    },
});

export default styles;