import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { styles } from "./YourPlaceCardStyle";
import { convertBase64ArrayToImages } from "../../services/HelperFunctions";

const YourPlaceCardComp = ({ item, onPress }) => {
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
                    {item.dates &&
                        item.dates.map((date, index) => (
                            <Text key={index} style={styles.dateText}>
                                {new Date(date.date).toLocaleDateString()}{" "}
                                {new Date(date.date).toLocaleTimeString()}
                            </Text>
                        ))}
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default YourPlaceCardComp;
