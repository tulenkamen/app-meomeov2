import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import styles from './SettingsStyle';

import { useFormDataThreshold } from '../../utils/GlobalVariables';

const SettingsScreen = ({ route }) => {
    const { phone } = route.params;
    const { updateFormDataThreshold } = useFormDataThreshold();

    const [phoneNumber, setPhoneNumber] = useState(phone);
    const [timeoutId, setTimeoutId] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingThreshold, setIsEditingThreshold] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseMessagePH, setResponseMessagePH] = useState('');
    const [responseMessageTur, setResponseMessageTur] = useState('');
    const [responseMessageTemp, setResponseMessageTemp] = useState('');
    const [isFisrtClich, setIsFirstClick] = useState(0);
    const [isHidden, setIsHidden] = useState(false);

    const [formDataThreshold, setFormDataThreshold] = useState({});
    const [deviceId, setDeviceId] = useState([]);

    const [thresholdSeed, setThresholdSeed] = useState({});
    const [thresholdBaby, setThresholdBaby] = useState({});
    const [thresholdAdult, setThresholdAdult] = useState({});

    const areaUnits = ['<Không>', 'm²', 'ha'];
    const shrimpTypes = ['Chưa thiết lập', 'Tôm sú', 'Tùy chỉnh'];
    const shrimpStatuses = ['Chưa thiết lập', 'Tôm giống', 'Tôm non', 'Tôm trưởng thành'];
    const timeUnits = ['Chưa thiết lập', 'Phút', 'Giờ'];

    const showResponseMessage = (message) => {
        setResponseMessage(message);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            setResponseMessage('');
        }, 10000);
        setTimeoutId(id);
    };
    const showResponseMessagePH = (message) => {
        setResponseMessagePH(message);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            setResponseMessagePH('');
        }, 30000);
        setTimeoutId(id);
    };

    const showResponseMessageTur = (message) => {
        setResponseMessageTur(message);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            setResponseMessageTur('');
        }, 30000);
        setTimeoutId(id);
    };
    const showResponseMessageTemp = (message) => {
        setResponseMessageTemp(message);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            setResponseMessageTemp('');
        }, 30000);
        setTimeoutId(id);
    };

    console.log(phoneNumber);
    console.log('Phone:', phone);

    const getUserByPhone = `https://meomeov2-besv.onrender.com/users/get-phone/${phoneNumber}`;

    //Get User Data when got phoneNumber
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(getUserByPhone);
                const data = response.data[0];
                console.log(data);
                if (data) {
                    setFormData({
                        phoneNumber: data.phoneNumber || '',
                        address: data.address || '',
                        dateOfBirth: data.dateOfBirth || '',
                        citizenNumber: data.citizenNumber || '',
                        name: data.name || '',
                        deviceId: data.deviceId || '',
                    });
                    setDeviceId(data.deviceId);
                    if (data.deviceId) {
                        getDeviceThreshold(data.deviceId);

                    }
                    getTigerPrawnDefaultThreshold();
                }
            } catch (error) {
                Alert.alert('Kiểm tra lại kết nối Internet!');
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };
        if (phoneNumber) {
            fetchData();
        }
    }, [phoneNumber]);

    const getTigerPrawnDefaultThreshold = async () => {
        try {
            const url = `https://meomeov2-besv.onrender.com/devices/devices-threshold`;
            const response = await axios.get(url);
            const data = response.data;
            const seedData = data[`seed`];
            const babyData = data[`baby`];
            const adultData = data[`adult`];
            setThresholdSeed(seedData);
            setThresholdBaby(babyData);
            setThresholdAdult(adultData);

        } catch (error) {
            console.error('Cập nhật trạng thái thiết bị thất bại:', error);
            showResponseMessage('Không thể lấy dữ liệu, kiểm tra lại kết nối Internet!!!');
            Alert.alert('Kiểm tra lại kết nối Internet!');

        }
    };
    // console.log('seed', thresholdSeed);
    // console.log('baby', thresholdBaby);
    // console.log('adult:', thresholdAdult);

    const getDeviceThreshold = async (id) => {
        if (id && id.length > 0) {
            try {
                const url = `https://meomeov2-besv.onrender.com/devices/device-update/${id}/get-device`;
                const response = await axios.get(url);
                const data = response.data;
                const linkedData = data[`linkedPhone:${phoneNumber}`];
                // console.log('linkkkedd', linkedData);
                // console.log('Fetched device threshold data:', data);
                console.log('URL:', url);
                if (linkedData) {
                    setFormDataThreshold({
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
                    updateFormDataThreshold({
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

    const handleChange = (field, value) => {
        showResponseMessage('');
        setFormDataThreshold(prevState => {
            const updatedThresholdData = {
                ...prevState,
                [field]: value,
            };
            // updateFormDataThreshold(updatedThresholdData);

            return updatedThresholdData;
        });
    };
    // const handleChange = (field, value) => {
    //     showResponseMessage('');
    //     setFormDataThreshold({ ...formDataThreshold, [field]: value });
    //     };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleEditThreshold = () => {
        setIsEditingThreshold(true);
    };

    const handleEditSave = async () => {
        try {
            const updatedData = {
                phoneNumber: phoneNumber,
                area: formDataThreshold.area,
                areaUnit: formDataThreshold.areaUnit,
                species: formDataThreshold.species,
                speciesStatus: formDataThreshold.speciesStatus,
            }
            await axios.post(`https://meomeov2-besv.onrender.com/devices/device-update/${deviceId}/update-linked-phone/${phoneNumber}`
                , updatedData);

            setIsHidden(false);
            setIsEditing(false);
            setIsFirstClick(0);

            Alert.alert('Cập nhật thông tin thành công!');
            showResponseMessage('Cập nhật thông tin hồ nuôi thành công!');
            if (updatedData.species === 1) {
                setIsHidden(true);

                if (updatedData.speciesStatus === 1) {
                    const newThresholdData = {
                        ...formDataThreshold,
                        pHUpperThreshold: thresholdSeed.pHUpperThreshold,
                        pHLowerThreshold: thresholdSeed.pHLowerThreshold,
                        turbidityUpperThreshold: thresholdSeed.turbidityUpperThreshold,
                        turbidityLowerThreshold: thresholdSeed.turbidityLowerThreshold,
                        tempUpperThreshold: thresholdSeed.tempUpperThreshold,
                        tempLowerThreshold: thresholdSeed.tempLowerThreshold,
                        notiTime: thresholdSeed.notiTime,
                        notiTimeUnit: thresholdSeed.notiTimeUnit,
                    };
                    setFormDataThreshold(newThresholdData);
                    updateFormDataThreshold(newThresholdData);

                    try {
                        await axios.post(`https://meomeov2-besv.onrender.com/devices/device-update/${deviceId}/update-linked-phone/${phoneNumber}`
                            , thresholdSeed);
                        showResponseMessage('Cập nhật thông tin hồ nuôi thành công!');

                    } catch (error) {
                        console.error('Lỗi khi cập nhật dữ liệu:', error);
                        showResponseMessage('Cập nhật dữ liệu thất bại! Vui lòng kiểm tra lại kết nối mạng!');
                    }

                }
                else if (updatedData.speciesStatus === 2) {
                    const newThresholdData = {
                        ...formDataThreshold,
                        pHUpperThreshold: thresholdBaby.pHUpperThreshold,
                        pHLowerThreshold: thresholdBaby.pHLowerThreshold,
                        turbidityUpperThreshold: thresholdBaby.turbidityUpperThreshold,
                        turbidityLowerThreshold: thresholdBaby.turbidityLowerThreshold,
                        tempUpperThreshold: thresholdBaby.tempUpperThreshold,
                        tempLowerThreshold: thresholdBaby.tempLowerThreshold,
                        notiTime: thresholdBaby.notiTime,
                        notiTimeUnit: thresholdBaby.notiTimeUnit,
                    };
                    setFormDataThreshold(newThresholdData);
                    updateFormDataThreshold(newThresholdData);

                    try {
                        await axios.post(`https://meomeov2-besv.onrender.com/devices/device-update/${deviceId}/update-linked-phone/${phoneNumber}`
                            , thresholdBaby);
                        showResponseMessage('Cập nhật thông tin hồ nuôi thành công!');

                    } catch (error) {
                        console.error('Lỗi khi cập nhật dữ liệu:', error);
                        showResponseMessage('Cập nhật dữ liệu thất bại! Vui lòng kiểm tra lại kết nối mạng!');
                    }

                }
                else if (updatedData.speciesStatus === 3) {
                    const newThresholdData = {
                        ...formDataThreshold,
                        pHUpperThreshold: thresholdAdult.pHUpperThreshold,
                        pHLowerThreshold: thresholdAdult.pHLowerThreshold,
                        turbidityUpperThreshold: thresholdAdult.turbidityUpperThreshold,
                        turbidityLowerThreshold: thresholdAdult.turbidityLowerThreshold,
                        tempUpperThreshold: thresholdAdult.tempUpperThreshold,
                        tempLowerThreshold: thresholdAdult.tempLowerThreshold,
                        notiTime: thresholdAdult.notiTime,
                        notiTimeUnit: thresholdAdult.notiTimeUnit,
                    };
                    setFormDataThreshold(newThresholdData);
                    updateFormDataThreshold(newThresholdData);

                    try {
                        await axios.post(`https://meomeov2-besv.onrender.com/devices/device-update/${deviceId}/update-linked-phone/${phoneNumber}`
                            , thresholdAdult);
                        showResponseMessage('Cập nhật thông tin hồ nuôi thành công!');
                    } catch (error) {
                        console.error('Lỗi khi cập nhật dữ liệu:', error);
                        showResponseMessage('Cập nhật dữ liệu thất bại! Vui lòng kiểm tra lại kết nối mạng!');
                    }

                }
            }
            else {
                updateFormDataThreshold(formDataThreshold);
            }

        } catch (error) {
            console.error('Lỗi khi cập nhật dữ liệu:', error);
            Alert.alert('Cập nhật thông tin thất bại!');
            showResponseMessage('Cập nhật dữ liệu thất bại! Vui lòng kiểm tra lại kết nối mạng!');
        }

    };

    const handleEditSaveThreshold = async () => {
        if (
            formDataThreshold.pHUpperThreshold < formDataThreshold.pHLowerThreshold ||
            formDataThreshold.turbidityUpperThreshold < formDataThreshold.turbidityLowerThreshold ||
            formDataThreshold.tempUpperThreshold < formDataThreshold.tempLowerThreshold
        ) {
            console.error('Giới hạn trên không được nhỏ hơn giới hạn dưới!');
            showResponseMessagePH('Hãy kiểm tra lại ngưỡng giá trị pH!');
            showResponseMessageTur('Hãy kiểm tra lại ngưỡng giá trị độ đục!');
            showResponseMessageTemp('Hãy kiểm tra lại ngưỡng giá trị nhiệt độ!');
            showResponseMessage('Cập nhật thất bại: Giới hạn trên không được nhỏ hơn giới hạn dưới!');
            return;
        }
        if (isFisrtClich === 0) {
            if (formDataThreshold.pHUpperThreshold <= 7 || formDataThreshold.pHUpperThreshold > 8.5 || formDataThreshold.pHLowerThreshold < 7 || formDataThreshold.pHLowerThreshold > 8.5) {
                showResponseMessagePH("Tôm sống ở môi trường trung tính có độ pH khuyến nghị từ 7 tới 8.5, hãy chắc chắn trước khi bạn lưu!");
                showResponseMessage('Hãy kiểm tra lại trước khi lưu nhé!');
            }
            if (formDataThreshold.turbidityUpperThreshold <= 15 || formDataThreshold.turbidityUpperThreshold > 45 || formDataThreshold.turbidityLowerThreshold < 15 || formDataThreshold.turbidityLowerThreshold > 45) {
                showResponseMessageTur("Độ đục khuyến nghị cho tôm nằm trong khoảng từ 15 tới 45 NTU, hãy chắc chắn trước khi bạn lưu!");
                showResponseMessage('Hãy kiểm tra lại trước khi lưu nhé!');
            }

            if (formDataThreshold.tempUpperThreshold <= 23 || formDataThreshold.tempUpperThreshold > 30 || formDataThreshold.tempLowerThreshold < 23 || formDataThreshold.tempLowerThreshold > 30) {
                showResponseMessageTemp("Nhiệt độ nước khuyến nghị cho tôm nằm trong khoảng từ 23 tới 30 °C, hãy chắc chắn rằng tôm sẽ không bị luộc chín trước khi thu hoạch!");
                showResponseMessage('Hãy kiểm tra lại trước khi lưu nhé!');
            }
            else {
                showResponseMessage('Hãy kiểm tra lại trước khi lưu nhé!');
            }
            setIsFirstClick(1);
            return;

        }
        if (isFisrtClich === 1) {
            showResponseMessage('Nếu bạn đã chắc chắn hãy nhấn lưu thêm một lần nữa!');
            setIsFirstClick(2);
            return;
        }


        try {
            const updatedData = {

                phoneNumber: phoneNumber,
                pHUpperThreshold: formDataThreshold.pHUpperThreshold,
                pHLowerThreshold: formDataThreshold.pHLowerThreshold,
                turbidityUpperThreshold: formDataThreshold.turbidityUpperThreshold,
                turbidityLowerThreshold: formDataThreshold.turbidityLowerThreshold,
                tempUpperThreshold: formDataThreshold.tempUpperThreshold,
                tempLowerThreshold: formDataThreshold.tempLowerThreshold,
                notiTime: formDataThreshold.notiTime,
                notiTimeUnit: formDataThreshold.notiTimeUnit,

            }
            await axios.post(`https://meomeov2-besv.onrender.com/devices/device-update/${deviceId}/update-linked-phone/${phoneNumber}`
                , updatedData);

            setIsEditingThreshold(false);
            setIsFirstClick(0);

            updateFormDataThreshold(formDataThreshold);

            showResponseMessage('Cập nhật thông tin hồ nuôi thành công!');
            showResponseMessagePH('');
            showResponseMessageTemp('');
            showResponseMessageTur('');

            Alert.alert('Cập nhật thông tin hồ nuôi thành công!');
            console.log('Cập nhật trạng thái thành công');

        } catch (error) {
            console.error('Lỗi khi cập nhật dữ liệu:', error);
            showResponseMessage('Cập nhật dữ liệu thất bại! Vui lòng kiểm tra lại kết nối mạng!');
        }

    };

    // console.log('formdatee', formDataThreshold);

    const CustomButton = ({ title, onPress }) => (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.Container}>
                <Text style={styles.header}>Hồ nuôi tôm của {formData?.name}!</Text>
            </View>

            <View style={styles.Container}>
                <Text style={styles.labelText1}>Nhập thông tin hồ nuôi</Text>

                <View style={styles.row}>
                    <Text style={styles.labelText1}>Diện tích hồ: </Text>
                    <TextInput
                        style={isEditing ? styles.input2 : styles.input}
                        value={formDataThreshold?.area || ''}
                        onChangeText={(value) => handleChange('area', value)}
                        editable={isEditing}
                        keyboardType="numeric"
                    />
                    <Picker
                        selectedValue={formDataThreshold?.areaUnit}
                        enabled={isEditing}
                        style={isEditing ? styles.picker21 : styles.picker11}
                        onValueChange={(itemValue) => handleChange('areaUnit', itemValue)}
                    >
                        {areaUnits.map((unit, index) => (
                            <Picker.Item key={index} label={unit} value={index} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.row}>
                    <Text style={styles.labelText1}>Giống tôm: </Text>
                    <Picker
                        selectedValue={formDataThreshold?.species}
                        enabled={isEditing}
                        style={isEditing ? styles.picker2 : styles.picker}
                        onValueChange={(itemValue) => handleChange('species', itemValue)}
                    >
                        {shrimpTypes.map((type, index) => (
                            <Picker.Item key={index} label={type} value={index} />
                        ))}
                    </Picker>
                </View>

                {formDataThreshold?.species === 1 && (
                    <View style={styles.row}>
                        <Text style={styles.labelText1}>Trạng thái: </Text>
                        <Picker
                            selectedValue={formDataThreshold?.speciesStatus}
                            enabled={isEditing}
                            style={isEditing ? styles.picker22 : styles.picker12}
                            onValueChange={(itemValue) => handleChange('speciesStatus', itemValue)}
                        >
                            {shrimpStatuses.map((status, index) => (
                                <Picker.Item key={index} label={status} value={index} />
                            ))}
                        </Picker>
                    </View>
                )}
                <Text style={styles.labelText4}>Bạn có thể lựa chọn thiết lập gợi ý cho tôm sú hoặc tùy chỉnh theo kinh nghiệm của bạn! </Text>

                {isEditing ? (
                    <CustomButton title="Lưu" onPress={handleEditSave} />
                ) : (
                    <CustomButton title="Chỉnh sửa" onPress={handleEdit} />
                )}
            </View>
            {responseMessage ? <Text style={styles.errorText}>{responseMessage}</Text> : null}


            <View style={styles.Container}>
                <Text style={styles.labelText1}>Cài đặt ngưỡng thông báo</Text>
                <Text style={styles.labelText2}>Ngưỡng pH trong hồ tôm</Text>
                <Text style={styles.labelText4}>Độ pH trong môi trường ảnh hưởng rất lớn tới hệ miễn dịch của tôm, độ pH quá cao hoặc quá thấp có thể khiến chúng xuất hiện các chứng bệnh khác nhau. </Text>

                <View style={styles.row}>
                    <Text style={styles.labelTextUpper}>Độ pH trên: </Text>
                    <TextInput
                        style={isEditingThreshold ? styles.input2 : styles.input}
                        value={formDataThreshold?.pHUpperThreshold || ''}
                        onChangeText={(value) => handleChange('pHUpperThreshold', value)}
                        editable={isEditingThreshold}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.labelTextBelow}>Độ pH dưới: </Text>
                    <TextInput
                        style={isEditingThreshold ? styles.input2 : styles.input}
                        value={formDataThreshold?.pHLowerThreshold || ''}
                        onChangeText={(value) => handleChange('pHLowerThreshold', value)}
                        editable={isEditingThreshold}
                    />
                </View>
                {responseMessagePH ? <Text style={styles.errorText1}>{responseMessagePH}</Text> : null}

                <Text style={styles.labelText2}>Ngưỡng độ đục trong hồ tôm</Text>
                <Text style={styles.labelText4}>Mô phỏng độ đục trong môi trường tự nhiên khiến tôm giống cảm thấy an toàn và thoải mái hơn, giúp đảm bảo sức khỏe và chất lượng thủy sản. </Text>

                <View style={styles.row}>
                    <Text style={styles.labelTextUpper}>Độ đục trên: </Text>
                    <TextInput
                        style={isEditingThreshold ? styles.input2 : styles.input}
                        value={formDataThreshold?.turbidityUpperThreshold || ''}
                        onChangeText={(value) => handleChange('turbidityUpperThreshold', value)}
                        editable={isEditingThreshold}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.labelTextBelow}>Độ đục dưới: </Text>
                    <TextInput
                        style={isEditingThreshold ? styles.input2 : styles.input}
                        value={formDataThreshold?.turbidityLowerThreshold || ''}
                        onChangeText={(value) => handleChange('turbidityLowerThreshold', value)}
                        editable={isEditingThreshold}
                    />
                </View>
                {responseMessageTur ? <Text style={styles.errorText1}>{responseMessageTur}</Text> : null}

                <Text style={styles.labelText2}>Ngưỡng nhiệt độ trong hồ tôm</Text>
                <Text style={styles.labelText4}>Tôm là một loài động vật biến nhiệt, vì vậy nhiệt độ môi trường ảnh hưởng rất nhiều tới chúng. </Text>

                <View style={styles.row}>
                    <Text style={styles.labelTextUpper}>Nhiệt độ trên: </Text>
                    <TextInput
                        style={isEditingThreshold ? styles.input2 : styles.input}
                        value={formDataThreshold?.tempUpperThreshold || ''}
                        onChangeText={(value) => handleChange('tempUpperThreshold', value)}
                        editable={isEditingThreshold}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.labelTextBelow}>Nhiệt độ dưới: </Text>
                    <TextInput
                        style={isEditingThreshold ? styles.input2 : styles.input}
                        value={formDataThreshold?.tempLowerThreshold || ''}
                        onChangeText={(value) => handleChange('tempLowerThreshold', value)}
                        editable={isEditingThreshold}
                    />
                </View>
                {responseMessageTemp ? <Text style={styles.errorText1}>{responseMessageTemp}</Text> : null}

                <Text style={styles.labelText1}>Thông báo nếu có bất thường liên tục trong: </Text>
                <View style={styles.row}>
                    <Text style={styles.labelText1}>Thời gian: </Text>
                    <TextInput
                        style={isEditingThreshold ? styles.input2 : styles.input}
                        value={formDataThreshold?.notiTime || ''}
                        onChangeText={(value) => handleChange('notiTime', value)}

                        editable={isEditingThreshold}
                    />
                    <Picker
                        selectedValue={formDataThreshold?.notiTimeUnit}
                        enabled={isEditingThreshold}
                        style={isEditingThreshold ? styles.picker21 : styles.picker11}
                        onValueChange={(itemValue) => handleChange('notiTimeUnit', itemValue)}
                    >
                        {timeUnits.map((status, index) => (
                            <Picker.Item key={index} label={status} value={index} />
                        ))}
                    </Picker>

                </View>
                {isHidden !== true && (
                    isEditingThreshold ? (
                        <CustomButton title="Lưu" onPress={handleEditSaveThreshold} />
                    ) : (
                        <CustomButton title="Chỉnh sửa" onPress={handleEditThreshold} />
                    )
                )}

            </View>

            {responseMessage ? <Text style={styles.errorText}>{responseMessage}</Text> : null}

        </ScrollView>
    );
};

export default SettingsScreen;