import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import styles from './MonitorStyle';
import io from 'socket.io-client';
import { debounce } from 'lodash';

import { useFormDataThreshold } from '../../utils/GlobalVariables';


const MonitorScreen = ({ route }) => {
    const { phone } = route.params;
    const { formDataThreshold } = useFormDataThreshold();
    const [phoneNumber, setPhoneNumber] = useState(phone);
    const [userData, setUserData] = useState({});
    const [deviceData, setDeviceData] = useState({});
    const [deviceId, setDeviceId] = useState('');
    const [error, setError] = useState('');
    const [sensorData, setSensorData] = useState([]);
    const [focusedValue, setFocusedValue] = useState(null);
    const [localTimestamp1, setLocalTimestamp1] = useState('');
    const [realTimeData, setRealTimeData] = useState([]);
    const [activeButton, setActiveButton] = useState('');
    const [valueButton, setValueButton] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pieData, setPieData] = useState([]);

    const socket = io('https://meomeov2-besv.onrender.com');

    const getUserByPhone = `https://meomeov2-besv.onrender.com/users/get-phone/${phoneNumber}`;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(getUserByPhone);
                const data = response.data[0];
                if (data) {
                    setUserData(data);
                    setDeviceId(data.deviceId || '');
                    socket.emit('registerDevice', { mac_address: data.deviceId, phoneNumber: data.phoneNumber });
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', error);
                setError('Không thể lấy dữ liệu người dùng.');
            }
        };
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });
        socket.on('sensorData', (data) => {
            setRealTimeData(data);
            console.log('Received sensor data:', data);
        });
        if (phoneNumber) {
            fetchUserData();
        }
        return () => {
            socket.off('Real time data');
            socket.disconnect();
        };
    }, [phoneNumber]);

    const getDeviceData = async () => {
        if (!deviceId) return;
        const isValidValue = (valueButton !== null && valueButton !== undefined && valueButton !== '' && !isNaN(valueButton) && Number(valueButton) > 0);
        const valueToFetch = isValidValue ? Number(valueButton) : 20;

        try {
            setLoading(true);
            const response = await axios.get(`https://meomeov2-besv.onrender.com/devices/device-data/${deviceId}/${valueToFetch}`);
            const data = response.data;
            setDeviceData(data[0]);
            data.sort((a, b) => {
                const timeA = new Date(a.timestamp.seconds * 1000 + a.timestamp.nanoseconds / 1000000);
                const timeB = new Date(b.timestamp.seconds * 1000 + b.timestamp.nanoseconds / 1000000);
                return timeA - timeB;
            });
            const formattedData = data.map(item => {
                const timestamp = new Date(item.timestamp.seconds * 1000);
                const localTimestamp = timestamp.toLocaleString('vi-VN', {
                    timeZone: 'Asia/Ho_Chi_Minh',

                });
                return {
                    timestamp: localTimestamp,
                    pH: parseFloat(item.pH),
                    temperature: parseFloat(item.temperature),
                    turbidity: parseFloat(item.turbidity),
                };
            });
            // console.log('Dữ liệu thiết bị:', data);
            setSensorData(formattedData);
            setDataLoaded(true);
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu thiết bị:', err);
            setError('Không thể lấy dữ liệu thiết bị.');
        } finally {
            setLoading(false);
        }
    };
    const debouncedFetchData = useCallback(debounce(getDeviceData, 500), [deviceId, valueButton]);

    useEffect(() => {
        debouncedFetchData();
        return () => {
            debouncedFetchData.cancel();
        };
    }, [deviceId, valueButton, debouncedFetchData]);

    console.log('Real time data:', realTimeData);
    console.log('Device data', deviceData);
    useEffect(() => {
        if (!dataLoaded) return;

        //Choose one to display on newest data
        if (realTimeData === undefined) {
            setPieData(deviceData);
        }
        else if (realTimeData.length === 0) {
            setPieData(deviceData);
        }
        else if (realTimeData.timestamp.seconds >= deviceData.timestamp.seconds) {
            setPieData(realTimeData);
        }
        else if (realTimeData.timestamp.seconds < deviceData.timestamp.seconds) {
            setPieData(deviceData);
        }
        //Dataset for real timestamp

        if (pieData && pieData.timestamp) {
            const dateValue = pieData.timestamp;
            const timestamp1 = new Date(dateValue.seconds * 1000);
            const localTimestamp = timestamp1.toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh',
            });
            setLocalTimestamp1(localTimestamp);
        }
    }, [pieData, dataLoaded, realTimeData, deviceData]);

    // Dataset for Donut pH chart
    const pHValue = pieData.pH ? parseFloat(pieData.pH) : 0;
    const pHThresholdLow = formDataThreshold.pHLowerThreshold;
    const pHThresholdHigh = formDataThreshold.pHUpperThreshold;
    const pHPercent = 100 * (pHValue - pHThresholdLow) / (pHThresholdHigh - pHThresholdLow);

    const calculatepieDataPH = () => {

        let pieDataPH = [];


        if (pHValue <= 7 && pHThresholdLow >= 7) {
            pieDataPH = [
                { value: pHThresholdLow - 7, color: 'red', text: 'OK' },
                { value: pHThresholdHigh - pHThresholdLow, color: 'black', text: 'HIGH' },
                { value: 14 - pHThresholdHigh, color: 'green', text: 'LOW' },
                { value: pHValue - 0, color: 'green', text: 'OK' },
                { value: 7 - pHValue, color: 'red', text: 'OK' },
            ];
        }
        else if (pHValue > 7 && pHThresholdLow >= pHValue) {
            pieDataPH = [
                { value: pHValue - 7, color: 'green', text: 'OK' },
                { value: pHThresholdLow - pHValue, color: 'red', text: 'HIGH' },
                { value: pHThresholdHigh - pHThresholdLow, color: 'black', text: 'LOW' },
                { value: 14 - pHThresholdHigh, color: 'green', text: 'OK' },
                { value: 7 - 0, color: 'green', text: 'OK' },
            ];
        }
        else if (pHValue > 7 && pHThresholdLow < pHValue && pHValue <= pHThresholdHigh && pHThresholdLow >= 7) {
            pieDataPH = [
                { value: pHThresholdLow - 7, color: 'green', text: 'OK' },
                { value: pHValue - pHThresholdLow, color: '#177AD5', text: 'HIGH' },
                { value: pHThresholdHigh - pHValue, color: 'black', text: 'LOW' },
                { value: 14 - pHThresholdHigh, color: 'green', text: 'OK' },
                { value: 7 - 0, color: 'green', text: 'OK' },
            ];
        }
        else if (pHValue > 7 && pHThresholdLow >= 7 && pHValue > pHThresholdHigh) {
            pieDataPH = [
                { value: pHThresholdLow - 7, color: 'green', text: 'OK' },
                { value: pHThresholdHigh - pHThresholdLow, color: '#177AD5', text: 'LOW' },
                { value: pHValue - pHThresholdHigh, color: 'orange', text: 'HIGH' },
                { value: 14 - pHValue, color: 'green', text: 'OK' },
                { value: 7 - 0, color: 'green', text: 'OK' },
            ];
        }
        else if (pHValue > 7 && pHValue <= pHThresholdHigh) {
            pieDataPH = [
                { value: pHValue - 7, color: '#177AD5', text: 'VALUE' },
                { value: pHThresholdHigh - pHValue, color: 'black', text: 'OK' },
                { value: 14 - pHThresholdHigh, color: 'green', text: 'HIGH' },
                { value: pHThresholdLow - 0, color: 'green', text: 'LOW' },
                { value: 7 - pHThresholdLow, color: 'black', text: 'OK' },
            ];
        }
        else if (pHValue > pHThresholdHigh) {
            pieDataPH = [
                { value: pHThresholdHigh - 7, color: '#177AD5', text: 'VALUE' },
                { value: pHValue - pHThresholdHigh, color: 'orange', text: 'OK' },
                { value: 14 - pHValue, color: 'green', text: 'HIGH' },
                { value: pHThresholdLow - 0, color: 'green', text: 'LOW' },
                { value: 7 - pHThresholdLow, color: 'black', text: 'OK' },
            ];
        }
        else if (pHValue < 7 && pHValue >= pHThresholdLow) {
            pieDataPH = [
                { value: pHThresholdHigh - 7, color: 'black', text: 'OK' },
                { value: 14 - pHThresholdHigh, color: 'green', text: 'HIGH' },
                { value: pHThresholdLow - 0, color: 'green', text: 'LOW' },
                { value: pHValue - pHThresholdLow, color: 'black', text: 'OK' },
                { value: 7 - pHValue, color: '#177AD5', text: 'VALUE' },
            ];

        }
        else if (pHValue < pHThresholdLow) {
            pieDataPH = [
                { value: pHThresholdHigh - 7, color: 'black', text: 'OK' },
                { value: 14 - pHThresholdHigh, color: 'green', text: 'HIGH' },
                { value: pHValue - 0, color: 'green', text: 'LOW' },
                { value: pHThresholdLow - pHValue, color: 'red', text: 'OK' },
                { value: 7 - pHThresholdLow, color: '#177AD5', text: 'VALUE' },
            ];
        }
        else if (pHValue == 7) {
            pieDataPH = [
                { value: pHThresholdHigh - 7, color: 'black', text: 'OK' },
                { value: 14 - pHThresholdHigh, color: 'green', text: 'HIGH' },
                { value: pHThresholdLow - 0, color: 'green', text: 'LOW' },
                { value: 7 - pHThresholdLow, color: 'black', text: 'OK' },
            ];
        }

        return pieDataPH;
    };
    const pieDataPH = calculatepieDataPH();


    //Dataset for Donut Turbidity Chart
    const turValue = pieData.turbidity ? parseFloat(pieData.turbidity) : 0;
    const turLow = formDataThreshold.turbidityLowerThreshold;
    const turHigh = formDataThreshold.turbidityUpperThreshold;
    const turPercent = 100 * (turValue - turLow) / (turHigh - turLow);

    const calculatepieDataTurbidity = () => {

        let pieDataTurbidity = [];
        if (turValue < turLow) {
            pieDataTurbidity = [
                { value: turValue - 0, color: 'green', text: 'HIGH' },
                { value: turLow - turValue, color: 'red', text: 'VALUE' },
                { value: turHigh - turLow, color: 'black', text: 'OK' },
                { value: 100 - turHigh, color: 'green', text: 'HIGH' },
            ];
        }
        else if (turValue >= turLow && turValue <= turHigh) {
            pieDataTurbidity = [
                { value: turLow - 0, color: 'green', text: 'HIGH' },
                { value: turValue - turLow, color: '#177AD5', text: 'VALUE' },
                { value: turHigh - turValue, color: 'black', text: 'OK' },
                { value: 100 - turHigh, color: 'green', text: 'HIGH' },
            ];
        }
        else if (turValue >= turLow && turValue > turHigh && turValue < 100) {
            pieDataTurbidity = [
                { value: turLow - 0, color: 'green', text: 'HIGH' },
                { value: turHigh - turLow, color: '#177AD5', text: 'VALUE' },
                { value: turValue - turHigh, color: 'orange', text: 'OK' },
                { value: 100 - turValue, color: 'green', text: 'HIGH' },
            ];
        }
        else if (turValue >= 100) {
            pieDataTurbidity = [

                { value: 100, color: 'orange', text: 'HIGH' },
            ];
        }
        return pieDataTurbidity;
    };

    const pieDataTurbidity = calculatepieDataTurbidity();

    //Temperature::::

    const tempValue = pieData.temperature ? parseFloat(pieData.temperature) : 0;

    const tempLow = formDataThreshold.tempLowerThreshold;
    const tempHigh = formDataThreshold.tempUpperThreshold;
    let tempTextColor;
    let tempStatus;

    if (tempValue < tempLow) {
        tempTextColor = 'red';
        tempStatus = '(Thấp)';

    } else if (tempValue > tempHigh) {
        tempTextColor = 'orange';
        tempStatus = '(Cao)';

    } else {
        tempTextColor = '#177AD5';
        tempStatus = '(Bình thường)';

    }

    // Dataset for Line chart

    const getLabeledData = (data, interval) => {
        return data.map((item, index) => {
            return {
                value: item.value,
                label: index % interval === 0 ? item.label : '',
            };
        });
    };

    const temperatureData = getLabeledData(sensorData.map(item => ({
        value: item.temperature,
        label: item.timestamp,

    })));

    const pHData = getLabeledData(sensorData.map(item => ({
        value: item.pH,
        label: item.timestamp,
    })));

    const turbidityData = getLabeledData(sensorData.map(item => ({
        value: item.turbidity,
        label: item.timestamp,

    })));
    const xAxisLabels = sensorData.map((_, index) => (index + 1).toString());

    //Buttons for Line Chart

    const handleTimeRangeClick = (timeRange) => {
        setActiveButton(timeRange);
        const value = timeRangeValues[timeRange];
        setValueButton(value);
    };
    const timeRangeValues = {
        '2h': 24,
        '10h': 120,
        '1d': 600,
        '3d': 1800,
        '1w': 4500,
    };

    console.log(valueButton);
    console.log('mâmmamama', formDataThreshold);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <>
                    <View style={styles.Container}>
                        {userData.name && <Text style={styles.labelText1}>Tên người dùng:  {userData.name}</Text>}
                        <Text style={styles.labelText1}>Số điện thoại:  {userData.phoneNumber}</Text>
                    </View>

                    <View style={styles.tempContainer}>
                        <Text style={styles.temperatureText}>Giá trị quan trắc hiện tại:</Text>
                        <View style={styles.tempTextContainer}>
                            <Text style={styles.labelText1}>Thời gian:</Text>
                        </View>
                        <View style={styles.tempTextContainer}>

                            <Text style={styles.labelText2}>{localTimestamp1}</Text>
                        </View>
                    </View>
                    <View style={styles.tempContainer}>
                        <View style={styles.tempTextContainer}>

                            <Text style={[styles.temperatureText]}>
                                Nhiệt độ nước:
                            </Text>
                        </View>
                        <View style={styles.tempTextContainer}>

                            <Text style={[styles.temperatureText2, { color: tempTextColor }]}>
                                {tempValue} °C
                            </Text>
                        </View>
                        <View style={styles.tempTextContainer}>

                            <Text style={[styles.temperatureText2, { color: tempTextColor }]}>
                                {tempStatus}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.pieContainer}>
                        <View style={styles.pieChartContainer}>
                            <PieChart
                                donut
                                radius={70}
                                innerRadius={48}
                                initialAngle={0}
                                textColor="black"
                                textSize={12}
                                centerLabelComponent={() => {
                                    return (
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontSize: 23, fontWeight: 'bold', color: '#177AD5' }}>pH: {pHValue.toFixed(2)}</Text>
                                            <Text style={{ fontSize: 15, color: 'mediumseagreen' }}>{pHPercent.toFixed(1)}%</Text>
                                        </View>
                                    );
                                }}
                                data={pieDataPH}
                            />
                            <View style={styles.legendContainerPie}>
                                <View style={styles.legendItemPie}>
                                    <View style={[styles.colorBoxPie, { backgroundColor: '#177AD5' }]} />
                                    <Text>Giá trị pH</Text>
                                </View>
                                <View style={styles.legendItemPie}>
                                    <View style={[styles.colorBoxPie, { backgroundColor: 'green' }]} />
                                    <Text>Ngưỡng cảnh báo</Text>
                                </View>
                                <View style={styles.legendItemPie}>
                                    <View style={[styles.colorBoxPie, { backgroundColor: 'orange' }]} />
                                    <Text>Độ pH vượt ngưỡng</Text>
                                </View>
                                <View style={styles.legendItemPie}>
                                    <View style={[styles.colorBoxPie, { backgroundColor: 'red' }]} />
                                    <Text>Độ pH thấp hơn ngưỡng</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: 5 }} />
                        <View style={styles.pieChartContainer}>
                            <PieChart
                                donut
                                radius={70}
                                innerRadius={48}
                                initialAngle={Math.PI * 3 / 2}
                                textColor="black"
                                textSize={12}
                                centerLabelComponent={() => {
                                    return (
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#177AD5', textAlign: 'center' }}>Độ đục: {turValue.toFixed(1)} NTU</Text>
                                            <Text style={{ fontSize: 15, color: 'mediumseagreen' }}>{turPercent.toFixed(1)}%</Text>

                                        </View>
                                    );
                                }}
                                data={pieDataTurbidity}
                            />
                            <View style={styles.legendContainerPie}>
                                <View style={styles.legendItemPie}>
                                    <View style={[styles.colorBoxPie, { backgroundColor: '#177AD5' }]} />
                                    <Text>Giá trị độ đục</Text>
                                </View>

                                <View style={styles.legendItemPie}>
                                    <View style={[styles.colorBoxPie, { backgroundColor: 'green' }]} />
                                    <Text>Ngưỡng cảnh báo</Text>
                                </View>
                                <View style={styles.legendItemPie}>
                                    <View style={[styles.colorBoxPie, { backgroundColor: 'orange' }]} />
                                    <Text>Độ đục vượt ngưỡng</Text>
                                </View>
                                <View style={styles.legendItemPie}>
                                    <View style={[styles.colorBoxPie, { backgroundColor: 'red' }]} />
                                    <Text>Độ đục thấp hơn ngưỡng</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.chartContainer}>

                        {loading ? (

                            <Text style={styles.labelText1}>Đang tải dữ liệu...</Text>

                        ) : (
                            sensorData.length > 0 && (
                                <>
                                    <Text style={styles.labelText1}>Giá trị quan trắc theo thời gian:</Text>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={styles.focusedValueContainer}>
                                            {!focusedValue && (
                                                <Text style={styles.focusedValueText2}>
                                                    Nhấn vào một điểm để hiển thị giá trị quan trắc
                                                </Text>
                                            )}

                                            {focusedValue && (
                                                <>
                                                    <Text style={styles.focusedValueText}>Thời gian: {focusedValue.timestamp}</Text>
                                                    <Text style={styles.focusedValueText}>Độ pH: {focusedValue.pH}</Text>
                                                    <Text style={styles.focusedValueText}>Nhiệt độ nước: {focusedValue.temperature} °C </Text>
                                                    <Text style={styles.focusedValueText}>Độ đục nước: {focusedValue.turbidity} NTU</Text>
                                                </>
                                            )}
                                        </View>
                                    </View>

                                    <LineChart
                                        backgroundColor="white"
                                        rulesType="solid"
                                        width={280}
                                        height={150}
                                        spacing={40}
                                        initialSpacing={40}
                                        data={temperatureData}
                                        data2={pHData}
                                        data3={turbidityData}
                                        color1="green"
                                        color2="blue"
                                        color3="red"
                                        scrollToEnd={true}

                                        noOfSections={5}
                                        xAxisLabelTextStyle={{ fontSize: 14 }}
                                        xAxisLabelsVerticalShift={7}

                                        dataPointsColor1="green"
                                        dataPointsColor2="blue"
                                        dataPointsColor3="red"
                                        dataPointsRadius={4}
                                        thickness={5}

                                        focusEnabled={true}
                                        showTextOnFocus={true}
                                        focusedDataPointRadius={5}
                                        unFocusOnPressOut={false}
                                        showValuesAsDataPointsText={true}
                                        xAxisLabelTexts={xAxisLabels}
                                        textShiftX={10}
                                        textShiftY={-3}
                                        textFontSize={12}

                                        textColor=""

                                        showStripOnFocus={true}
                                        stripHeight={150}
                                        stripWidth={1}
                                        stripColor="orange"
                                        stripOpacity={30}

                                        onFocus={(item, index) => {
                                            const focusedIndex = index;
                                            const focusedData = sensorData[focusedIndex];

                                            if (focusedData) {
                                                setFocusedValue({
                                                    timestamp: focusedData.timestamp,
                                                    pH: focusedData.pH,
                                                    temperature: focusedData.temperature,
                                                    turbidity: focusedData.turbidity,
                                                });
                                            }
                                        }}
                                    />
                                    <View style={styles.legendContainer}>
                                        <View style={styles.legendItem}>
                                            <View style={[styles.colorBox, { backgroundColor: 'green' }]} />
                                            <Text>Nhiệt độ</Text>
                                        </View>
                                        <View style={styles.legendItem}>
                                            <View style={[styles.colorBox, { backgroundColor: 'blue' }]} />
                                            <Text>pH</Text>
                                        </View>
                                        <View style={styles.legendItem}>
                                            <View style={[styles.colorBox, { backgroundColor: 'red' }]} />
                                            <Text>Độ đục</Text>
                                        </View>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        {['2h', '10h', '1d', '3d', '1w'].map((timeRange) => (
                                            <TouchableOpacity
                                                key={timeRange}
                                                style={[
                                                    styles.button,
                                                    activeButton === timeRange && styles.activeButton,
                                                ]}
                                                onPress={() => handleTimeRangeClick(timeRange)}
                                            >
                                                <Text style={styles.buttonText}>{timeRange}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </>
                            ))}
                    </View>
                </>
            )}
        </ScrollView>
    );
};


export default MonitorScreen;