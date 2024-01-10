import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { styles } from "./YourReviewCardStyle"; // Import the styles
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
        <View style={styles.cardContainer}>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: images[0] }} style={styles.image} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.addressText}>{item.address}</Text>
                    <Text style={styles.dateText}>{item.chosenDate}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default YourReviewCardComp;
