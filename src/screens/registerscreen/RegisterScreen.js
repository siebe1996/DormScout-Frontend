import React, { useState, useEffect, useContext } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    Button,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CostumTextInputLabelComp from "../../components/costumtextinputlabelcomp/CostumTextInputLabelComp";
import { useNavigation } from "@react-navigation/native";
import {
    fetchPredictions,
    fetchAddressInfo,
    postUser,
} from "../../services/ApiService";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import { convertImageToBase64 } from "../../services/HelperFunctions";
import CostumLabelComp from "../../components/costumlabelcomp/CostumLabelComp";
import DateTimePicker from "@react-native-community/datetimepicker";
import { returnResultImagePicker } from "../../services/HelperFunctions";
import { AuthContext } from "../../contexts/AuthContext";
import InvalidTextField from "../../components/invalidtextfield/InvalidTextField";

const RegisterScreen = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [province, setProvince] = useState("");
    const [country, setCountry] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [date, setDate] = useState(new Date());
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [showDatePicker, setShowDatePicker] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedPickerValue, setSelectedPickerValue] = useState(0);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const navigation = useNavigation();
    const { signIn } = useContext(AuthContext);

    useEffect(() => {
        fetchPredictionsAsync();
    }, [address]);

    const fetchPredictionsAsync = async () => {
        try {
            if (address.length > 0) {
                const result = await fetchPredictions(address);
                const addressInPredictions = result.predictions.some(
                    (prediction) => prediction.description === address
                );
                if (!addressInPredictions) {
                    setPredictions(result.predictions);
                }
            } else {
                setPredictions([]);
            }
        } catch (error) {
            console.error("Error fetching predictions:", error.message);
        }
    };

    const genderOptions = [
        { label: "Male", value: 0 },
        { label: "Female", value: 1 },
    ];

    const handleSearch = async (selectedPrediction) => {
        setAddress(selectedPrediction.description);
        //console.log("selectedPrediction", selectedPrediction);
        const resultFetch = await fetchAddressInfo(
            selectedPrediction.description
        );
        const result = resultFetch.results[0];
        const city =
            result.address_components.find((component) =>
                component.types.includes("locality")
            )?.long_name || "";
        const province =
            result.address_components.find((component) =>
                component.types.includes("administrative_area_level_1")
            )?.short_name || "";
        const postalCode =
            result.address_components.find((component) =>
                component.types.includes("postal_code")
            )?.long_name || "";
        const countryComponent = result.address_components.find((component) =>
            component.types.includes("country")
        );
        const country = countryComponent ? countryComponent.short_name : "";
        const streetNumberComponent = result.address_components.find(
            (component) => component.types.includes("street_number")
        );
        const routeComponent = result.address_components.find((component) =>
            component.types.includes("route")
        );
        const street =
            (routeComponent ? routeComponent.long_name : "") +
            " " +
            (streetNumberComponent ? streetNumberComponent.long_name : "");

        /*console.log("fetch", result);
        console.log("Street:", street);
        console.log("City:", city);
        console.log("Country:", country);
        console.log("County Code:", countyCode);
        console.log("Postal Code:", postalCode);*/
        setCountry(country);
        setCity(city);
        setPostalCode(postalCode);
        setProvince(province);
        setStreet(street);
        setSelectedPrediction(selectedPrediction);
        setPredictions([]);
    };

    const openImagePicker = async () => {
        try {
            const result = await returnResultImagePicker();
            setSelectedImage(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDateChange = (event, date) => {
        if (Platform.OS === "android") {
            setShowDatePicker(false);
        }

        if (date) {
            setDate(date);
        }
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const closeDatePicker = () => {
        setShowDatePicker(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!address.trim() && !selectedPrediction) {
            newErrors.address = "Address is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!userName.trim()) {
            newErrors.UserName = "User name is required";
        }

        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        }

        if (new Date(date) > new Date()) {
            newErrors.date = "The date must be your real birthday";
        }

        if (!password1.trim() || password1 != password2) {
            setPassword1("");
            setPassword2("");
            newErrors.password = "Password is wrong";
        }
        return newErrors;
    };

    const save = async () => {
        console.log("selectedImages before base64", selectedImage);
        let base64Image = null;
        try {
            if (selectedImage) {
                base64Image = await convertImageToBase64(selectedImage);
            }
        } catch (error) {
            console.error("Error encoding image to base64:", error);
        }
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            const userData = {
                firstName: firstName,
                lastName: lastName,
                ImageData: base64Image,
                dateOfBirth: date,
                email: email,
                userName: userName,
                gender: selectedPickerValue,
                phoneNumber: phoneNumber,
                country: country,
                city: city,
                postalCode: postalCode,
                province: province,
                address: street,
                password: password1,
            };
            const jsonUserData = JSON.stringify(userData);

            try {
                console.log("jsonUserData", jsonUserData);
                await postUser(jsonUserData);
                const loginSuccess = await signIn(email, password1);
            } catch (error) {
                console.error("Error posting user:", error);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const handleLoginPress = () => {
        navigation.navigate("Login");
    };

    return (
        <ScrollView style={styles.container}>
            {selectedImage ? (
                <TouchableOpacity onPress={() => openImagePicker()}>
                    <Image
                        source={{ uri: selectedImage }}
                        style={{ width: 100, height: 100, margin: 5 }}
                    />
                </TouchableOpacity>
            ) : (
                <CostumButtonComp
                    onPress={() => openImagePicker()}
                    text="upload picture"
                />
            )}
            <View>
                <CostumTextInputLabelComp
                    label="First Name:"
                    value={firstName}
                    onChangeText={(text) => setFirstName(text)}
                    placeholder="John"
                />
                {errors.firstName && (
                    <InvalidTextField text={errors.firstName} />
                )}
            </View>

            <View>
                <CostumTextInputLabelComp
                    label="Last Name:"
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                    placeholder="Doe"
                />
                {errors.lastName && <InvalidTextField text={errors.lastName} />}
            </View>

            <View>
                <CostumTextInputLabelComp
                    label="Address:"
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                    placeholder="homestreet 1 homecity"
                />
                {errors.address && <InvalidTextField text={errors.address} />}
            </View>
            {predictions.length > 0 && (
                <View>
                    {predictions.map((item, index) => (
                        <Button
                            key={index}
                            title={item.description}
                            onPress={() => handleSearch(item)}
                        />
                    ))}
                </View>
            )}

            <View>
                <View>
                    <CostumLabelComp text="Birthday:" />
                    <View>
                        <TouchableOpacity onPress={() => showDatepicker()}>
                            <Text style={styles.input}>
                                {new Date(date).toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {showDatePicker && (
                        <View>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display={
                                    Platform.OS === "ios"
                                        ? "spinner"
                                        : "default"
                                }
                                is24Hour={true}
                                onChange={(event, date) =>
                                    handleDateChange(event, date)
                                }
                            />
                            <TouchableOpacity onPress={() => closeDatePicker()}>
                                <Text>Close</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {errors.date && <InvalidTextField text={errors.date} />}
            </View>

            <View>
                <CostumTextInputLabelComp
                    label="Email:"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="user@example.vom"
                />
                {errors.email && <InvalidTextField text={errors.email} />}
            </View>

            <View>
                <CostumTextInputLabelComp
                    label="userName:"
                    value={userName}
                    onChangeText={(text) => setUserName(text)}
                    placeholder="JohnnyDoe"
                />
                {errors.userName && <InvalidTextField text={errors.userName} />}
            </View>

            <View>
                <CostumLabelComp text="Select Gender:" />
                <Picker
                    selectedValue={selectedPickerValue}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedPickerValue(itemValue)
                    }
                >
                    {genderOptions.map((genderOption, index) => (
                        <Picker.Item
                            key={index}
                            label={genderOption.label}
                            value={genderOption.value}
                        />
                    ))}
                </Picker>
            </View>

            <View>
                <CostumTextInputLabelComp
                    label="PhoneNumber:"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text)}
                    placeholder="0469696969"
                />
                {errors.phoneNumber && (
                    <InvalidTextField text={errors.phoneNumber} />
                )}
            </View>

            <View>
                <View>
                    <CostumLabelComp text="Password:" />
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        value={password1}
                        onChangeText={(text) => setPassword1(text)}
                    />
                </View>
                <View>
                    <CostumLabelComp text="Repeat password:" />
                    <TextInput
                        placeholder="Repeat password"
                        secureTextEntry={true}
                        value={password2}
                        onChangeText={(text) => setPassword2(text)}
                    />
                </View>
                {errors.password && <InvalidTextField text={errors.password} />}
            </View>

            <CostumButtonComp onPress={save} text="Register" />

            <View>
                <Text>or login</Text>
                <TouchableOpacity onPress={handleLoginPress}>
                    <Text> here</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
});

export default RegisterScreen;
