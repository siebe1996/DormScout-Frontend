import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    FlatList,
    Button,
    SectionList,
    Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import CostumTextInputLabelComp from "../../components/costumtextinputlabelcomp/CostumTextInputLabelComp";
import CostumLabelComp from "../../components/costumlabelcomp/CostumLabelComp";
import CostumTextInputComp from "../../components/costumtextinputcomp/CostumTextInputComp";
import { styles } from "./AddPlaceStyle";
import { fetchPredictions } from "../../services/ApiService";
import { fetchPlaceDetails } from "../../services/ApiService";
import { postPlace } from "../../services/ApiService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import {
    convertImagesToBase64,
    returnResultImagePicker,
} from "../../services/HelperFunctions";
import ImagePopup from "../../components/imagepopup/ImagePopup";
import InvalidTextField from "../../components/invalidtextfield/InvalidTextField";

const AddPlaceScreen = () => {
    const { state } = useAuth();
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [telephoneNumber, setTelephoneNumber] = useState("");
    const [link, setLink] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dates, setDates] = useState([new Date(Date.now())]);
    const [notes, setNotes] = useState([""]);
    const [selectedDateIndex, setSelectedDateIndex] = useState([]);
    const [errors, setErrors] = useState({});
    const [predictions, setPredictions] = useState([]);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const navigation = useNavigation();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupImageUri, setPopupImageUri] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        fetchPredictionsAsync();
    }, [dates, address]);

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

    const handleSearch = async (selectedPrediction) => {
        setAddress(selectedPrediction.description);
        const placeDetails = await fetchPlaceDetails(
            selectedPrediction.place_id
        );
        setLatitude(placeDetails.geometry.location.lat);
        setLongitude(placeDetails.geometry.location.lng);
        setSelectedPrediction(selectedPrediction);
        setPredictions([]);
    };

    const handleDateChange = (event, date, index) => {
        if (Platform.OS === "android") {
            setShowDatePicker(false);
            setShowTimePicker(false);
        }

        if (date) {
            const updatedDates = [...dates];
            updatedDates[index] = date;
            setDates([...updatedDates]);
            setSelectedDateIndex(null);
        }
    };

    const showDatepicker = (index) => {
        console.log("showDatepicker ", dates[index]);
        setShowTimePicker(false);
        setShowDatePicker(true);
        setSelectedDateIndex(index);
    };

    const showTimepicker = (index) => {
        console.log("showTimepicker ", dates[index]);
        setShowDatePicker(false);
        setShowTimePicker(true);
        setSelectedDateIndex(index);
    };

    const handleAddDate = () => {
        setDates([...dates, new Date(Date.now())]);
        setShowDatePicker(false);
        setShowTimePicker(false);
    };

    const handleAddNote = () => {
        setNotes([...notes, ""]);
    };

    const openImagePicker = async () => {
        try {
            const result = await returnResultImagePicker();
            setSelectedImages([...selectedImages, result]);
        } catch (error) {
            console.error(error);
        }
    };

    const openImagePopup = (imageUri) => {
        setPopupImageUri(imageUri);
        setIsPopupVisible(true);
    };

    const closeImagePopup = () => {
        setIsPopupVisible(false);
    };

    const deleteImage = () => {
        const updatedImages = selectedImages.filter(
            (uri) => uri !== popupImageUri
        );
        setSelectedImages(updatedImages);
        closeImagePopup();
    };

    const handleRemoveDate = (index) => {
        const updatedDates = [...dates];
        updatedDates.splice(index, 1);
        setDates(updatedDates);
    };

    const handleRemoveNote = (index) => {
        const updatedNotes = [...notes];
        updatedNotes.splice(index, 1);
        setNotes(updatedNotes);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!address.trim() && !latitude && !selectedPrediction) {
            newErrors.address = "Address is required";
        }

        if (!telephoneNumber.trim()) {
            newErrors.telephone = "Homeowner Telephone is required";
        }

        if (!email.trim()) {
            newErrors.email = "Homeowner Email is required";
        }

        if (dates.length <= 0) {
            newErrors.dates = "At least one date is required";
        } else {
            const areAllDatesAfterToday = dates.every(
                (date) => new Date(date) > new Date()
            );

            if (!areAllDatesAfterToday) {
                newErrors.dates = "All dates must be after today";
            }
        }

        return newErrors;
    };

    const save = async () => {
        let base64ImagesArray;
        convertImagesToBase64(selectedImages);
        try {
            base64ImagesArray = await convertImagesToBase64(selectedImages);
        } catch (error) {
            console.error("Error converting images:", error);
        }
        const nonEmptyNotes = notes.filter((note) => note.trim() !== "");
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            const placeData = {
                address: address,
                homeownerTelephone: telephoneNumber,
                homeownerEmail: email,
                link: link,
                coordinate: {
                    latitude: latitude,
                    longitude: longitude,
                },
                dates: dates.map((item) => ({
                    date: item,
                })),
                notes: nonEmptyNotes.map((item) => ({
                    content: item,
                })),
                images: base64ImagesArray.map((item) => ({
                    imageData: item,
                })),
            };
            const jsonPlaceData = JSON.stringify(placeData);
            console.log("jsonPlaceData:", jsonPlaceData);
            try {
                await postPlace(state.userToken, jsonPlaceData);
                navigation.navigate("Your Places");
            } catch (error) {
                console.error("Error posting the new Place:", error);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <ScrollView style={{ padding: 16 }}>
            <CostumButtonComp
                onPress={() => openImagePicker()}
                text="upload picture"
            />
            <FlatList
                data={selectedImages}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openImagePopup(item)}>
                        <Image
                            source={{ uri: item }}
                            style={{ width: 100, height: 100, margin: 5 }}
                        />
                    </TouchableOpacity>
                )}
                horizontal
            />

            <View>
                <CostumTextInputLabelComp
                    label="Address: *"
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                    placeholder="homestreet 1 homecity"
                />
                {console.log("predictions.length:", predictions.length)}
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
                {errors.address && <InvalidTextField text={errors.address} />}
            </View>

            <View>
                <CostumTextInputLabelComp
                    label="Email Houseowner: *"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    placeholder="johndoe@example.com"
                />
                {errors.email && <InvalidTextField text={errors.email} />}
            </View>
            <View>
                <CostumTextInputLabelComp
                    label="Telephone Number Houseowner: *"
                    value={telephoneNumber}
                    onChangeText={(text) => setTelephoneNumber(text)}
                    keyboardType="phone-pad"
                />
                {errors.telephone && (
                    <InvalidTextField text={errors.telephone} />
                )}
            </View>
            <View>
                <CostumTextInputLabelComp
                    label="Link Add:"
                    value={link}
                    onChangeText={(text) => setLink(text)}
                    placeholder="https://example.com"
                    keyboardType="url"
                />
            </View>

            <View>
                <CostumLabelComp text="Available Dates: *" />
                {dates.map((item, index) => (
                    <View key={index}>
                        <View>
                            <TouchableOpacity
                                onPress={() => showDatepicker(index)}
                            >
                                <Text style={styles.input}>
                                    {new Date(item).toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => showTimepicker(index)}
                            >
                                <Text style={styles.input}>
                                    {new Date(item).toLocaleTimeString()}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => handleRemoveDate(index)}
                            >
                                <Text style={styles.remove}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                {errors.dates && <InvalidTextField text={errors.dates} />}
                {showDatePicker && (
                    <DateTimePicker
                        value={dates[selectedDateIndex]}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        is24Hour={true}
                        onChange={(event, date) =>
                            handleDateChange(event, date, selectedDateIndex)
                        }
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={dates[selectedDateIndex]}
                        mode="time"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        is24Hour={true}
                        onChange={(event, date) =>
                            handleDateChange(event, date, selectedDateIndex)
                        }
                    />
                )}
                <TouchableOpacity onPress={handleAddDate}>
                    <Text style={styles.add}>Add Date</Text>
                </TouchableOpacity>
            </View>

            <View>
                <CostumLabelComp text="Extra Notes:" />
                {notes.map((note, index) => (
                    <View key={index}>
                        <CostumTextInputComp
                            value={note}
                            onChangeText={(text) => {
                                const updatedNotes = [...notes];
                                updatedNotes[index] = text;
                                setNotes(updatedNotes);
                            }}
                            key={index}
                        />
                        <View>
                            <TouchableOpacity
                                onPress={() => handleRemoveNote(index)}
                            >
                                <Text style={styles.remove}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <TouchableOpacity onPress={handleAddNote}>
                    <Text style={styles.add}>Add Note</Text>
                </TouchableOpacity>
            </View>
            <CostumButtonComp onPress={save} text="Submit" />

            <ImagePopup
                isVisible={isPopupVisible}
                imageUri={popupImageUri}
                onClose={closeImagePopup}
                onDelete={deleteImage}
            />
        </ScrollView>
    );
};

export default AddPlaceScreen;
