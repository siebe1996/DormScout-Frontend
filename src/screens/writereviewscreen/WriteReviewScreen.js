import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import ImagePopup from "../../components/imagepopup/ImagePopup";
import { writeReviewStyle } from "./WriteReviewStyle";
import { postReview } from "../../services/ApiService";
import { useAuth } from "../../contexts/AuthContext";
import {
    convertImagesToBase64,
    returnResultImagePicker,
    getDistanceFromLatLonInKm,
} from "../../services/HelperFunctions";
import InvalidTextField from "../../components/invalidtextfield/InvalidTextField";
import * as Location from "expo-location";

const WriteReviewScreen = ({ route }) => {
    const navigation = useNavigation();
    const { claimedReview } = route.params;
    const [selectedImages, setSelectedImages] = useState([]);
    const [review, setReview] = useState("");
    const photoData = route.params?.photoData;
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupImageUri, setPopupImageUri] = useState(null);
    const [errors, setErrors] = useState({});
    const { state } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (photoData && photoData.uri) {
            setSelectedImages([...selectedImages, photoData.uri]);
        }
    }, [photoData]);

    const checkDistanceClose = async () => {
        const region = await fetchLocationAndCity();
        const distance = getDistanceFromLatLonInKm(
            region.latitude,
            region.longitude,
            claimedReview.coordinate.latitude,
            claimedReview.coordinate.longitude
        );
        console.log("distance", distance);
        if (distance < 0.1) {
            save();
        } else {
            showAlert();
        }
    };

    const fetchLocationAndCity = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                throw new Error("Permission to access location was denied");
            }

            const location = await Location.getCurrentPositionAsync({});
            const region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 51.2093,
                longitudeDelta: 3.2247,
            };

            setLoading(false);
            return region;
        } catch (error) {
            console.error("Error fetching location and city:", error);
            setLoading(false);
        }
    };

    /*const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1); // deg2rad below
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };*/

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

    const validateForm = () => {
        const newErrors = {};
        if (!review.trim()) {
            newErrors.review = "Review text is required";
        }

        if (selectedImages.length <= 0) {
            newErrors.images = "At least one date is required";
        }

        return newErrors;
    };

    const navigateToCamera = () => {
        navigation.navigate("Camera", { claimedReview, photoData });
    };

    const showAlert = () => {
        Alert.alert(
            "Cannot write review",
            "You cannot write review when your not at the house location."
        );
    };

    const save = async () => {
        console.log("selectedImages", selectedImages);
        let base64ImagesArray;
        convertImagesToBase64(selectedImages);
        try {
            base64ImagesArray = await convertImagesToBase64(selectedImages);
        } catch (error) {
            console.error("Error converting images:", error);
        }
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            const reviewData = {
                placeId: claimedReview.id,
                text: review,
                images: base64ImagesArray.map((item) => ({
                    imageData: item,
                })),
            };
            const jsonReviewData = JSON.stringify(reviewData);
            console.log("jsonReviewData:", jsonReviewData);
            try {
                console.log("success");
                await postReview(state.userToken, jsonReviewData);
                navigation.navigate("Your Reviews");
            } catch (error) {
                console.error("Error posting the new review:", error);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    if (loading) {
        return (
            <View style={writeReviewStyle.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <View>
                <CostumButtonComp
                    onPress={navigateToCamera}
                    text="take picture"
                />
                <CostumButtonComp
                    onPress={() => openImagePicker()}
                    text="upload picture"
                />
                {errors.images && <InvalidTextField text={errors.images} />}
            </View>
            {selectedImages && (
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
            )}
            <View>
                <TextInput
                    placeholder="Write your review..."
                    multiline
                    numberOfLines={4}
                    value={review}
                    onChangeText={setReview}
                    style={writeReviewStyle.textInput}
                />
                {errors.review && <InvalidTextField text={errors.review} />}
            </View>
            <CostumButtonComp onPress={checkDistanceClose} text="Submit" />

            <ImagePopup
                isVisible={isPopupVisible}
                imageUri={popupImageUri}
                onClose={closeImagePopup}
                onDelete={deleteImage}
            />
        </ScrollView>
    );
};

export default WriteReviewScreen;
