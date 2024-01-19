import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    FlatList,
    Image,
    Button,
    ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import CostumTextInputLabelComp from "../../components/costumtextinputlabelcomp/CostumTextInputLabelComp";
import CostumLabelComp from "../../components/costumlabelcomp/CostumLabelComp";
import CostumTextInputComp from "../../components/costumtextinputcomp/CostumTextInputComp";
import { editPlaceStyle } from "./EditPlaceStyle";
import reviewData from "../../data/json/review";
import { useAuth } from "../../contexts/AuthContext";
import { putPlace } from "../../services/ApiService";
import {
    returnResultImagePicker,
    convertImageToBase64,
    convertBase64ToImage,
} from "../../services/HelperFunctions";
import ImagePopup from "../../components/imagepopup/ImagePopup";
import { fetchPredictions, fetchPlaceDetails } from "../../services/ApiService";
import { useNavigation } from "@react-navigation/native";
import { patchPlace } from "../../services/ApiService";
import InvalidTextField from "../../components/invalidtextfield/InvalidTextField";

const EditPlaceScreen = ({ route }) => {
    const { state } = useAuth();
    const { unclaimedReview } = route.params;
    const [address, setAddress] = useState(unclaimedReview.address);
    const [email, setEmail] = useState(unclaimedReview.homeownerEmail);
    const [telephoneNumber, setTelephoneNumber] = useState(
        unclaimedReview.homeownerTelephone
    );
    const [link, setLink] = useState(unclaimedReview.link);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    console.log("unclaimedReview.dates", unclaimedReview.dates);
    const [dates, setDates] = useState(
        unclaimedReview.dates.map((dateObj) => ({
            ...dateObj,
            date: new Date(dateObj.date),
        }))
    );
    //toDo make sure objects are preserved
    const [notes, setNotes] = useState(unclaimedReview.notes);
    const [selectedDateIndex, setSelectedDateIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [predictions, setPredictions] = useState([]);
    const [latitude, setLatitude] = useState(
        unclaimedReview.coordinate.latitude
    );
    const [longitude, setLongitude] = useState(
        unclaimedReview.coordinate.longitude
    );
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupImageData, setPopupImageData] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    console.log("dates", dates);

    useEffect(() => {
        //convertValues();
        fetchPredictionsAsync();
    }, [address]);

    useEffect(() => {
        convertImagesAsync();
    }, []);

    const convertImagesAsync = async () => {
        try {
            for (const element of unclaimedReview.images) {
                element.imageData = await convertBase64ToImage(
                    element.imageData
                );
            }
            console.log("unclaimedReview.images", unclaimedReview.images);
            setSelectedImages([...unclaimedReview.images]);
        } catch (error) {
            console.error("Error decoding base64 to images:", error);
        }
    };

    const convertValues = () => {
        console.log("unclaimedReview.dates", unclaimedReview.dates);
        const oldDates = unclaimedReview.dates.map((date) => date.date);
        console.log("oldDates", oldDates);
        setDates(oldDates);
        const oldNotes = unclaimedReview.notes.map((note) => note.content);
        setNotes(oldNotes);
    };

    const deleteImage = () => {
        const updatedImages = selectedImages.filter((image) => {
            return image.imageData !== popupImageData;
        });
        setSelectedImages(updatedImages);
        closeImagePopup();
    };

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
            updatedDates[index].date = date;
            setDates([...updatedDates]);
        }
    };

    const showDatepicker = (index) => {
        //console.log("showDatepicker ", dates[index]);
        setShowTimePicker(false);
        setShowDatePicker(true);
        setSelectedDateIndex(index);
    };

    const showTimepicker = (index) => {
        setShowDatePicker(false);
        setShowTimePicker(true);
        setSelectedDateIndex(index);
    };

    const closeDatePicker = () => {
        setShowDatePicker(false);
    };

    const closeTimePicker = () => {
        setShowTimePicker(false);
    };

    const handleAddDate = () => {
        setDates([...dates, { date: new Date(Date.now()) }]);
        setShowTimePicker(false);
    };

    const handleAddNote = () => {
        setNotes([...notes, { content: "" }]);
    };

    const openImagePicker = async () => {
        try {
            const result = await returnResultImagePicker();
            setSelectedImages([...selectedImages, { imageData: result }]);
        } catch (error) {
            console.error(error);
        }
    };

    const openImagePopup = (imageData) => {
        setPopupImageData(imageData);
        setIsPopupVisible(true);
    };

    const closeImagePopup = () => {
        setIsPopupVisible(false);
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

        if (dates.length === 0) {
            newErrors.dates = "At least one date is required";
        } else {
            const areAllDatesAfterToday = dates.every(
                (date) => new Date(date.date) > new Date()
            );

            if (!areAllDatesAfterToday) {
                newErrors.dates = "All dates must be after today";
            }
        }

        return newErrors;
    };

    const save = async () => {
        setLoading(true);
        console.log("selectedImages before base64", selectedImages);
        try {
            await Promise.all(
                selectedImages.map(async (element) => {
                    element.imageData = await convertImageToBase64(
                        element.imageData.toString()
                    );
                })
            );
        } catch (error) {
            console.error("Error decoding base64 to images:", error);
        }
        const nonEmptyNotes = notes.filter(
            (note) => note.content.trim() !== ""
        );
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            console.log("notes in save", nonEmptyNotes);
            const placeData = {
                address: address,
                homeownerTelephone: telephoneNumber,
                homeownerEmail: email,
                link: link,
                coordinate: {
                    latitude: latitude,
                    longitude: longitude,
                },
                dates: dates,
                notes: nonEmptyNotes,
                images: selectedImages,
            };
            const jsonPlaceData = JSON.stringify(placeData);
            try {
                console.log("state.userToken", state.userToken);
                await patchPlace(
                    state.userToken,
                    unclaimedReview.id,
                    jsonPlaceData
                );
                navigation.navigate("Your Places");
            } catch (error) {
                console.error("Error putting the Place:", error);
            }
        } else {
            setErrors(validationErrors);
        }
        setLoading(false);
    };

    return (
        <ScrollView style={{ padding: 16 }}>
            <CostumButtonComp
                onPress={() => openImagePicker()}
                text="upload picture"
            />
            {/*console.log("selectedImages", selectedImages)*/}
            <FlatList
                data={selectedImages}
                keyExtractor={(item) => item.imageData}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => openImagePopup(item.imageData)}
                    >
                        <Image
                            source={{ uri: item.imageData }}
                            style={{ width: 100, height: 100, margin: 5 }}
                        />
                    </TouchableOpacity>
                )}
                horizontal
            />
            <View>
                <CostumTextInputLabelComp
                    label="Address:"
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                    placeholder="homestreet 1 homecity"
                />
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
                    label="Email Houseowner:"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    placeholder="johndoe@example.com"
                />
                {errors.email && <InvalidTextField text={errors.email} />}
            </View>
            <View>
                <CostumTextInputLabelComp
                    label="Telephone Number Houseowner:"
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
                <CostumLabelComp text="Available Dates:" />
                {dates.map((item, index) => (
                    <View key={index}>
                        <View>
                            <TouchableOpacity
                                onPress={() => showDatepicker(index)}
                            >
                                <Text style={editPlaceStyle.input}>
                                    {console.log("item", item)}
                                    {item.date.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => showTimepicker(index)}
                            >
                                <Text style={editPlaceStyle.input}>
                                    {item.date.toLocaleTimeString()}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {dates.length > 1 &&
                            !showTimePicker &&
                            !showDatePicker && (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveDate(index)}
                                    >
                                        <Text style={editPlaceStyle.remove}>
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                    </View>
                ))}
                {errors.dates && <InvalidTextField text={errors.dates} />}
                {showDatePicker && (
                    <View>
                        <DateTimePicker
                            value={dates[selectedDateIndex].date}
                            mode="date"
                            display={
                                Platform.OS === "ios" ? "spinner" : "default"
                            }
                            is24Hour={true}
                            onChange={(event, date) =>
                                handleDateChange(event, date, selectedDateIndex)
                            }
                        />
                        <TouchableOpacity onPress={() => closeDatePicker()}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {showTimePicker && (
                    <View>
                        <DateTimePicker
                            value={dates[selectedDateIndex].date}
                            mode="time"
                            display={
                                Platform.OS === "ios" ? "spinner" : "default"
                            }
                            is24Hour={true}
                            onChange={(event, date) =>
                                handleDateChange(event, date, selectedDateIndex)
                            }
                        />
                        <TouchableOpacity onPress={() => closeTimePicker()}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity onPress={handleAddDate}>
                    <Text style={editPlaceStyle.add}>Add Date</Text>
                </TouchableOpacity>
            </View>

            <View>
                <CostumLabelComp text="Extra Notes:" />
                {notes.map((note, index) => (
                    <View key={index}>
                        {console.log("note", note)}
                        <CostumTextInputComp
                            value={note.content}
                            onChangeText={(text) => {
                                const updatedNotes = [...notes];
                                updatedNotes[index].content = text;
                                setNotes(updatedNotes);
                            }}
                            key={index}
                        />
                        {notes.length > 1 && (
                            <View>
                                <TouchableOpacity
                                    onPress={() => handleRemoveNote(index)}
                                >
                                    <Text style={editPlaceStyle.remove}>
                                        Remove
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
                <TouchableOpacity onPress={handleAddNote}>
                    <Text style={editPlaceStyle.add}>Add Note</Text>
                </TouchableOpacity>
            </View>

            <CostumButtonComp
                onPress={() => {
                    save();
                }}
                text="Edit"
                disabled={loading}
            />

            <ImagePopup
                isVisible={isPopupVisible}
                imageUri={popupImageData}
                onClose={closeImagePopup}
                onDelete={deleteImage}
            />
        </ScrollView>
    );
};

export default EditPlaceScreen;
