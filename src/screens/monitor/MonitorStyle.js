import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        padding: width * 0.02,
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
        color: 'black',
        marginTop: height * 0.045,
        marginBottom: height * 0.015,
    },
    labelText1: {
        color: 'black',
        padding: width * 0.012,
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    contentText: {
        fontSize: width * 0.035,
        color: '#444444',
    },
    chillText: {
        fontSize: width * 0.03,
        color: '#444444',
    },
    labelText11: {
        color: 'black',
        padding: width * 0.012,
        fontSize: width * 0.05,
        marginBottom: 2,
    },
    labelText2: {
        padding: width * 0.012,
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: 2,
        color: 'orange',
    },
    focusedValueContainer: {
        flex: 0,
        height: height * 0.13,
        width: width * 0.7,
        marginTop: height * 0.006,
        marginBottom: height * 0.012,
        paddingHorizontal: height * 0.025,
        backgroundColor: 'orange',
        borderRadius: width * 0.012,
        padding: width * 0.012,
        borderRadius: width * 0.025,
        borderWidth: 2,
        borderColor: '#cccccc',
    },
    focusedValueText2: {
        fontSize: width * 0.05,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 7,
        padding: width * 0.012,
    },

    focusedValueText: {
        fontSize: width * 0.035,
        color: 'white',
        fontWeight: 'bold',
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
        backgroundColor: '#f8f8f8',
        borderRadius: width * 0.025,
        borderWidth: 2,
        borderColor: '#cccccc',
        padding: width * 0.025,
        marginBottom: height * 0.045,

    },
    legendContainer: {
        flexDirection: 'row',
        marginTop: height * 0.012,
        padding: width * 0.012,
        marginLeft: width * 0.1,
    },
    legendContainerPie: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: height * 0.012,
        padding: width * 0.012,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: width * 0.05,
    },
    legendItemPie: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: width * 0.06,
    },
    colorBox: {
        width: width * 0.075,
        height: height * 0.012,
        marginRight: width * 0.06,
        padding: width * 0.012,
    },
    colorBoxPie: {
        width: width * 0.05,
        height: height * 0.012,
        marginRight: width * 0.06,
        padding: 0,
    },
    pieContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.012,

    },
    pieChartContainer: {
        padding: width * 0.025,
        backgroundColor: '#FFF',
        borderRadius: width * 0.025,
        borderWidth: 2,
        borderColor: '#cccccc',
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: height * 0.012,
    },
    button: {
        padding: width * 0.025,
        borderRadius: width * 0.012,
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
        padding: width * 0.025,
        backgroundColor: '#FFF',
        borderRadius: width * 0.025,
        borderWidth: 2,
        borderColor: '#cccccc',
        flex: 1,
        alignItems: 'Left',
        marginBottom: height * 0.006,
    },
    tempTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: width * 0.06,

    },
    temperatureText: {
        color: 'black',
        padding: width * 0.012,
        fontSize: width * 0.055,
        fontWeight: 'bold',
    },
    temperatureText2: {
        color: 'black',
        padding: 2,
        fontSize: width * 0.055,
        fontWeight: 'bold',
    },
});

export default styles;