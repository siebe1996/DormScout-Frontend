import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from "react-native";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import CostumTextInputLabelComp from "../../components/costumtextinputlabelcomp/CostumTextInputLabelComp";
import CostumLabelComp from "../../components/costumlabelcomp/CostumLabelComp";
import {
    convertBase64ToImage,
    convertImageToBase64,
    returnResultImagePicker,
} from "../../services/HelperFunctions";
import {
    getStorageItemAsync,
    setStorageItemAsync,
} from "../../services/LocalStorageService";
import { editAccountStyle } from "./EditAccountStyle";
import { putUser, fetchUser, fetchUserMe } from "../../services/ApiService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Platform } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import InvalidTextField from "../../components/invalidtextfield/InvalidTextField";

const EditAccountScreen = ({ route }) => {
    const { state } = useAuth();
    const [user, setUser] = useState(route.params.user);
    const [selectedImage, setSelectedImage] = useState(
        route.params.user.imageData
    );
    const [userName, setUserName] = useState(route.params.user.userName);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date(route.params.user.dateOfBirth));
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    /*useFocusEffect(
        React.useCallback(() => {
            getUser();
        }, [])
    );*/

    /*useEffect(() => {
        if (user.imageData != null) {
            convertBase64ToImageAsync();
        }
    }, [user]);*/

    const getUser = async () => {
        let response = {};
        try {
            response = await fetchUserMe(state.userToken);
        } catch (e) {
            console.error("Error fetching yourself:", e);
        }
        setUser(response);
        setUserName(response.userName);
        setDate(new Date(response.dateOfBirth));
        console.log("user", response);
    };

    const convertBase64ToImageAsync = async () => {
        try {
            console.log("user.imageData", user.imageData);
            const imageData = await convertBase64ToImage(user.imageData);

            setSelectedImage(imageData);
        } catch (error) {
            console.error("Error decoding base64 to images:", error);
        }
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

    const validateForm = () => {
        const newErrors = {};
        //toDo make extra fields in form
        if (!userName.trim()) {
            newErrors.userName = "userName is required";
        }
        if (new Date(date) > new Date()) {
            newErrors.date = "The date must be a valid birthday";
        }

        return newErrors;
    };

    const save = async () => {
        setLoading(true);
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
                userName: userName,
                dateOfBirth: date,
                imageData: base64Image,
                updatedAt: new Date().toISOString().replace("Z", ""),
            };

            try {
                saveChangesLocally(userData);
                navigation.navigate("Account");
            } catch (error) {
                console.error("Error editting the Account:", error);
            }
        } else {
            setErrors(validationErrors);
        }
        setLoading(false);
    };

    const saveChangesLocally = async (userData) => {
        console.log("user 1", user);
        console.log("userData69", userData);
        try {
            const updatedUser = {
                ...user,
                userName: userData.userName,
                dateOfBirth: userData.dateOfBirth,
                imageData: selectedImage,
                updatedAt: userData.updatedAt,
            };

            const jsonUpdatedUserData = JSON.stringify(updatedUser);
            await setStorageItemAsync("user", jsonUpdatedUserData);
        } catch (error) {
            console.error("Error saving changes locally:", error);
        }
    };

    return (
        <View style={editAccountStyle.container}>
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
                    label="User name:"
                    value={userName}
                    onChangeText={(text) => setUserName(text)}
                    placeholder="John"
                />
                {errors.userName && <InvalidTextField text={errors.userName} />}
            </View>
            <View>
                <View>
                    <CostumLabelComp text="Birthday:" />
                    <View>
                        <TouchableOpacity onPress={() => showDatepicker()}>
                            <Text style={editAccountStyle.input}>
                                {new Date(date).toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={
                                Platform.OS === "ios" ? "spinner" : "default"
                            }
                            is24Hour={true}
                            onChange={(event, date) =>
                                handleDateChange(event, date)
                            }
                        />
                    )}
                </View>
                {errors.date && <InvalidTextField text={errors.date} />}
            </View>

            <CostumButtonComp
                onPress={() => {
                    save();
                }}
                text="Edit"
                disabled={loading}
            />
        </View>
    );
};

export default EditAccountScreen;
