import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import styles from './MonitorStyle';
import { io } from 'socket.io-client';
import { debounce } from 'lodash';
import firestore from '@react-native-firebase/firestore';
import { useFormDataThreshold } from '../../utils/GlobalVariables';
import messaging from '@react-native-firebase/messaging';


const MonitorScreen = ({ route }) => {
    const { phone } = route.params;
    const { globalThreshold } = useFormDataThreshold();
    const [getThreshold, setGetThreshold] = useState([]);
    const [formDataThreshold, setFormDataThreshold] = useState([]);
    const navigation = useNavigation();

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
    const [deviceStatus, setDeviceStatus] = useState(0);

    const [firstLoading, setFirstLoading] = useState(false);
    const [firstDataLoaded, setFirstDataLoaded] = useState(false);
    const [lastDataLoaded, setLastDataLoaded] = useState(false);

    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pieData, setPieData] = useState([]);
    const [pieDataPH, setPieDataPH] = useState([]);
    const [pieDataTurbidity, setPieDataTurbidity] = useState([]);
    const [tempTextColor, setTempTextColor] = useState('');
    const [tempStatus, setTempStatus] = useState('');
    const [pHPercent, setPHPercent] = useState(0);
    const [turPercent, setTurPercent] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingThreshold, setIsLoadingThreshold] = useState(true);

    const socket = io('https://meomeov2-besv.onrender.com');
    const getUserByPhone = `https://meomeov2-besv.onrender.com/users/get-phone/${phoneNumber}`;

    const showDeviceAlert = () => {
        Alert.alert(
            "Lỗi kết nối",
            "Chưa kết nối với thiết bị quan trắc! Hãy xem lại Mã thiết bị!",
            [
                {
                    text: "OK",
                    onPress: () => navigation.navigate('Cá Nhân'),
                }
            ],
            { cancelable: false }
        );
    };
    const showThresholdAlert = () => {
        Alert.alert(
            "Thiết lập",
            "Hãy cài đặt các Ngưỡng giá trị cho hồ nuôi!",
            [
                {
                    text: "OK",
                    onPress: () => navigation.navigate('Cài Đặt'),
                }
            ],
            { cancelable: false }
        );
    };
    useEffect(() => {
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            console.log('Đã nhận thông báo trong ứng dụng:', remoteMessage);
            if (remoteMessage.notification && remoteMessage.notification.body) {
                Alert.alert(
                    'Cảnh báo',
                    'Các chỉ số đang vượt mức cảnh báo, chuyển tới màn hình quan trắc?',
                    [
                        { text: 'OK', onPress: () => navigation.navigate('Quan Trắc') },
                        { text: 'Để sau', style: 'cancel' },
                    ],
                    { cancelable: false }
                );
            }
        });

        return () => {
            unsubscribeOnMessage();
        };
    }, [navigation]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isLoading) {
                showDeviceAlert();
            } else if (!isLoadingThreshold) {
                showThresholdAlert();
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [isLoading, isLoadingThreshold]);

    useEffect(() => {
        let statusTimeout;
        const fetchUserData = async () => {
            try {
                const response = await axios.get(getUserByPhone);
                const data = response.data[0];
                if (data) {
                    setUserData(data);
                    setDeviceId(data.deviceId || '');
                    console.log('dataaa', data.devideId);
                    socket.emit('registerDevice', { mac_address: data.deviceId, phoneNumber: data.phoneNumber });
                }
                if (data.deviceId == '' || data.deviceId == 'undefined' || data.deviceId == undefined) {
                    setIsLoading(false);
                }
                if (data.deviceId) {
                    await getDeviceThreshold(data.deviceId);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', error);
                setError('Không thể lấy dữ liệu người dùng.');
            }
            console.log('ttt', isLoading);

        };
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });
        socket.on('sensorData', (data) => {
            setRealTimeData(data);
            setDeviceStatus(1);
            clearTimeout(statusTimeout);
            console.log('Received sensor data:', data);
            startStatusTimeout();
        });

        if (phoneNumber) {
            fetchUserData();
        }

        const startStatusTimeout = () => {
            statusTimeout = setTimeout(() => {
                setDeviceStatus(0);
            }, 30 * 1000);
        };
        startStatusTimeout();
        return () => {
            clearTimeout(statusTimeout);
            socket.disconnect();
        };

    }, [phoneNumber]);

    const getDeviceThreshold = async (id) => {
        if (id && id.length > 0) {
            try {
                const url = `https://meomeov2-besv.onrender.com/devices/device-update/${id}/get-device`;
                const response = await axios.get(url);
                const data = response.data;
                const linkedData = data[`linkedPhone:${phoneNumber}`];
                // console.log('linkkkedd', linkedData);
                // console.log('Fetched device threshold data:', data);
                if (linkedData == 'undefined' || linkedData == undefined || linkedData.pHLowerThreshold == undefined || linkedData.pHLowerThreshold == '') {
                    setIsLoadingThreshold(false);
                }
                console.log('URL:', url);
                if (linkedData) {
                    setGetThreshold({
                        area: linkedData.area || '',
                        areaUnit: linkedData.areaUnit || 0,
                        species: linkedData.species || 0,
                        speciesStatus: linkedData.speciesStatus || 0,

                        pHUpperThreshold: linkedData.pHUpperThreshold || '',
                        pHLowerThreshold: linkedData.pHLowerThreshold || '',
                        turbidityUpperThreshold: linkedData.turbidityUpperThreshold || '',
                        turbidityLowerThreshold: linkedData.turbidityLowerThreshold || '',
                        tempUpperThreshold: linkedData.tempUpperThreshold || '',
                        tempLowerThreshold: linkedData.tempLowerThreshold || '',

                        notiTime: linkedData.notiTime || '',
                        notiTimeUnit: linkedData.notiTimeUnit || 0,
                    });
                } else {
                    console.log('No device status found');
                }
            } catch (error) {
                console.error('Cập nhật trạng thái thiết bị thất bại:', error);
                showResponseMessage('Không thể lấy dữ liệu, kiểm tra lại kết nối Internet!!!');
            }
        }
    };
    // console.log('dvđd', deviceId);
    // console.log('tt', getThreshold);
    useEffect(() => {
        //Choose one to display on newest data
        if (getThreshold === undefined && Object.keys(globalThreshold).length === 0) {
            setFirstLoading(false);
        }
        else if (getThreshold.length === 0 && Object.keys(globalThreshold).length === 0) {
            setFirstLoading(false);
        }
        else if (Array.isArray(globalThreshold) && Object.keys(globalThreshold).length > 0) {
            setFirstLoading(true);
        }
        else {
            setFirstLoading(true);
        }
    }, [getThreshold, globalThreshold]);

    useEffect(() => {
        if (firstLoading == !true) {
            return;
        }
        //Choose one to display on newest data
        if (globalThreshold === undefined || (Object.keys(globalThreshold).length === 0)) {
            setFormDataThreshold(getThreshold);
        } else {
            setFormDataThreshold(globalThreshold);
        }
        setFirstDataLoaded(true);
        setIsLoadingThreshold(true);
    }, [globalThreshold, getThreshold, firstLoading, isLoadingThreshold]);

    useEffect(() => {
        if (realTimeData === undefined || Object.keys(realTimeData).length === 0) {
            console.log('No valid realTimeData received');
        } else {
            const timeA = new Date(realTimeData.timestamp.seconds * 1000 + realTimeData.timestamp.nanoseconds / 1000000);
            const formattedTimestamp = timeA.toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh'
            });

            const formattedData = {
                ...realTimeData,
                timestamp: formattedTimestamp,
            };
            setSensorData(prevSensorData => {
                const updatedSensorData = [
                    ...prevSensorData.slice(1),
                    formattedData
                ];
                return updatedSensorData;
            });

            // console.log('newSensorData', sensorData);
        }
    }, [realTimeData]);

    const getDeviceData = async () => {
        if (!deviceId) return;

        const isValidValue = (valueButton !== null && valueButton !== undefined && valueButton !== '' && !isNaN(valueButton) && Number(valueButton) > 0);
        const valueToFetch = isValidValue ? Number(valueButton) : 20;

        try {
            setLoading(true);

            const querySnapshot = await firestore()
                .collection('devices')
                .doc(deviceId)
                .collection('sensor-data')
                .orderBy('timestamp.seconds', 'desc')
                .limit(valueToFetch)
                .get();

            const data = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }));
            // console.log('dddtt', data);
            if (!data.length) {
                setDeviceData([{
                    timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
                    pH: 0,
                    temperature: 0,
                    turbidity: 0,
                }]);
                setDataLoaded(true);
                return;
            }

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
            setDeviceData(data[(valueToFetch - 1)]);
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

    // console.log('Real time data:', realTimeData);
    // console.log('Device data', deviceData);
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

    let statusTextColor;
    let statusString;
    if (deviceStatus === 1) {
        statusTextColor = 'blue';
        statusString = 'Hoạt động';

    } else {
        statusTextColor = 'red';
        statusString = 'Không hoạt động';

    }
    // console.log('status', statusString);

    // Dataset for Donut pH chart
    const calculatepieDataPH = () => {
        const pHValue = pieData.pH ? parseFloat(pieData.pH) : 0;
        const pHThresholdLow = formDataThreshold.pHLowerThreshold;
        const pHThresholdHigh = formDataThreshold.pHUpperThreshold;
        const pHPercent = 100 * (pHValue - pHThresholdLow) / (pHThresholdHigh - pHThresholdLow);
        setPHPercent(pHPercent);
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

    //Dataset for Donut Turbidity Chart


    const calculatepieDataTurbidity = () => {
        const turValue = pieData.turbidity ? parseFloat(pieData.turbidity) : 0;
        const turLow = formDataThreshold.turbidityLowerThreshold;
        const turHigh = formDataThreshold.turbidityUpperThreshold;
        const turPercent = 100 * (turValue - turLow) / (turHigh - turLow);
        setTurPercent(turPercent);
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

    useEffect(() => {
        if (firstDataLoaded == !true) {
            return;
        }
        const newPieDataPH = calculatepieDataPH();
        const newPieDataTurbidity = calculatepieDataTurbidity();

        setPieDataPH(newPieDataPH);
        setPieDataTurbidity(newPieDataTurbidity);

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
        setTempTextColor(tempTextColor);
        setTempStatus(tempStatus);
        setLastDataLoaded(true);
        console.log(isLoadingThreshold);
    }, [formDataThreshold, firstDataLoaded, pieData, isLoadingThreshold]);

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
    const xAxisLabels = sensorData.map((_, index) => (index % 3 === 0 ? (index + 1).toString() : ''));

    //Buttons for Line Chart

    const handleTimeRangeClick = (timeRange) => {
        setActiveButton(timeRange);
        const value = timeRangeValues[timeRange];
        setValueButton(value);
    };
    const timeRangeValues = {
        '2h': 26,
        '10h': 121,
        '1d': 601,
        '3d': 1801,
        '1w': 4501,
    };
    // console.log('global', globalThreshold);
    // console.log('mâmmamama', formDataThreshold);
    // console.log('getthreshold', getThreshold);
    if (lastDataLoaded == !false && isLoadingThreshold == true) {

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
                            <View style={styles.tempTextContainer}>

                                <Text style={[styles.temperatureText]}>
                                    Trạng thái thiết bị:
                                </Text>
                            </View>
                            <View style={styles.tempTextContainer}>

                                <Text style={[styles.temperatureText2, { color: statusTextColor }]}>
                                    {statusString}
                                </Text>
                            </View>
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
                                    {pieData.temperature ? parseFloat(pieData.temperature).toFixed(2) : '0.00'} °C
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
                                                <Text style={{ fontSize: 23, fontWeight: 'bold', color: '#177AD5' }}>pH: {pieData.pH ? parseFloat(pieData.pH).toFixed(2) : '0.00'}</Text>
                                                <Text style={{ fontSize: 15, color: 'mediumseagreen' }}>{pHPercent.toFixed(1)}%</Text>
                                            </View>
                                        );
                                    }}
                                    data={pieDataPH}
                                />
                                <View style={styles.legendContainerPie}>
                                    <View style={styles.legendItemPie}>
                                        <View style={[styles.colorBoxPie, { backgroundColor: '#177AD5' }]} />
                                        <Text style={styles.contentText}>Giá trị pH</Text>
                                    </View>
                                    <View style={styles.legendItemPie}>
                                        <View style={[styles.colorBoxPie, { backgroundColor: 'green' }]} />
                                        <Text style={styles.contentText}>Ngưỡng cảnh báo</Text>
                                    </View>
                                    <View style={styles.legendItemPie}>
                                        <View style={[styles.colorBoxPie, { backgroundColor: 'orange' }]} />
                                        <Text style={styles.contentText}>Độ pH vượt ngưỡng</Text>
                                    </View>
                                    <View style={styles.legendItemPie}>
                                        <View style={[styles.colorBoxPie, { backgroundColor: 'red' }]} />
                                        <Text style={styles.contentText}>Độ pH thấp hơn ngưỡng</Text>
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
                                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#177AD5', textAlign: 'center' }}>Độ đục: {pieData.turbidity ? parseFloat(pieData.turbidity).toFixed(2) : '0.00'} NTU</Text>
                                                <Text style={{ fontSize: 15, color: 'mediumseagreen' }}>{turPercent.toFixed(1)}%</Text>

                                            </View>
                                        );
                                    }}
                                    data={pieDataTurbidity}
                                />
                                <View style={styles.legendContainerPie}>
                                    <View style={styles.legendItemPie}>
                                        <View style={[styles.colorBoxPie, { backgroundColor: '#177AD5' }]} />
                                        <Text style={styles.contentText}>Giá trị độ đục</Text>
                                    </View>

                                    <View style={styles.legendItemPie}>
                                        <View style={[styles.colorBoxPie, { backgroundColor: 'green' }]} />
                                        <Text style={styles.contentText}>Ngưỡng cảnh báo</Text>
                                    </View>
                                    <View style={styles.legendItemPie}>
                                        <View style={[styles.colorBoxPie, { backgroundColor: 'orange' }]} />
                                        <Text style={styles.contentText}>Độ đục vượt ngưỡng</Text>
                                    </View>
                                    <View style={styles.legendItemPie}>
                                        <View style={[styles.colorBoxPie, { backgroundColor: 'red' }]} />
                                        <Text style={styles.contentText}>Độ đục thấp hơn ngưỡng</Text>
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
                                            yAxisColor="black"
                                            xAxisColor="black"
                                            rulesColor="#999999"
                                            width={250}
                                            height={150}
                                            spacing={30}
                                            initialSpacing={30}
                                            data={temperatureData}
                                            data2={pHData}
                                            data3={turbidityData}
                                            color1="green"
                                            color2="blue"
                                            color3="red"
                                            scrollToEnd={true}

                                            noOfSections={5}
                                            xAxisLabelTextStyle={{
                                                fontSize: 14, color: 'black',
                                            }}
                                            xAxisLabelsVerticalShift={7}
                                            yAxisTextStyle={{
                                                fontSize: 14, color: 'black',
                                            }}
                                            hideDataPoints={true}
                                            dataPointsColor1="green"
                                            dataPointsColor2="blue"
                                            dataPointsColor3="red"
                                            dataPointsRadius={4}
                                            thickness={3}
                                            focusEnabled={true}
                                            showTextOnFocus={true}
                                            focusedDataPointRadius={5}
                                            showDataPointOnFocus={true}
                                            unFocusOnPressOut={false}
                                            showValuesAsDataPointsText={true}
                                            xAxisLabelTexts={xAxisLabels}

                                            textShiftX={10}
                                            textShiftY={-3}
                                            textFontSize={12}

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
                                                <Text style={styles.chillText}>Nhiệt độ</Text>
                                            </View>
                                            <View style={styles.legendItem}>
                                                <View style={[styles.colorBox, { backgroundColor: 'blue' }]} />
                                                <Text style={styles.chillText}>pH</Text>
                                            </View>
                                            <View style={styles.legendItem}>
                                                <View style={[styles.colorBox, { backgroundColor: 'red' }]} />
                                                <Text style={styles.chillText}>Độ đục</Text>
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
    } else {
        if (lastDataLoaded == false && isLoadingThreshold == true && isLoading == true) {
            return (
                <View style={styles.Container}>
                    <Text style={styles.labelText1}>Màn hình đang tải</Text>
                    <Text style={styles.labelText11}>Vui lòng chờ...</Text>
                </View>
            );
        }
        else if (isLoading == false) {
            return (
                <View style={styles.Container}>
                    <Text style={styles.labelText1}>Chưa kết nối với thiết bị quan trắc!</Text>
                    <Text style={styles.labelText11}>Hãy xem lại Mã thiết bị của bạn ở tab Thông Tin Cá Nhân!</Text>
                </View>
            );
        }
        else if (isLoadingThreshold == false) {
            return (
                <View style={styles.Container}>
                    <Text style={styles.labelText1}>Thiết lập!</Text>
                    <Text style={styles.labelText11}>Hãy cài đặt các Ngưỡng giá trị cho hồ nuôi để quan sát biểu đồ!</Text>
                </View>
            );
        }

    };



};


export default MonitorScreen;