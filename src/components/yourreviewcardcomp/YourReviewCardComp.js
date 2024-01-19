import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { yourReviewCardStyle } from "./YourReviewCardStyle"; // Import the styles
import { convertBase64ArrayToImages } from "../../services/HelperFunctions";

const YourReviewCardComp = ({ item, onPress }) => {
    const navigation = useNavigation();
    const [images, setImages] = useState([]);

    useEffect(() => {
        convertImagesAsync();
    }, []);

    const convertImagesAsync = async () => {
        try {
            const imageUrls = await convertBase64ArrayToImages(item.images);
            console.log("Decoded image URLs:", imageUrls);
            setImages(imageUrls);
        } catch (error) {
            console.error("Error decoding base64 to images:", error);
        }
    };

    return (
        <View style={yourReviewCardStyle.cardContainer}>
            <TouchableOpacity onPress={onPress}>
                <View style={yourReviewCardStyle.imageContainer}>
                    <Image
                        source={{ uri: images[0] }}
                        style={yourReviewCardStyle.image}
                    />
                </View>
                <View style={yourReviewCardStyle.textContainer}>
                    <Text style={yourReviewCardStyle.addressText}>
                        {item.address}
                    </Text>
                    <Text style={yourReviewCardStyle.dateText}>
                        {new Date(item.chosenDate).toLocaleDateString()}{" "}
                        {new Date(item.chosenDate).toLocaleTimeString()}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default YourReviewCardComp;
