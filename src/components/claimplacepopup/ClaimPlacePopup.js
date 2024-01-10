import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Image,
} from "react-native";
import { styles } from "./ClaimPlaceStyle";
import { Ionicons } from "@expo/vector-icons";
import CostumButtonComp from "../costumbuttoncomp/CostumButtonComp";
import { useNavigation } from "@react-navigation/native";
import { convertBase64ToImage } from "../../services/HelperFunctions";

const ClaimPlacePopup = ({ place, isVisible, onClose }) => {
    const navigation = useNavigation();
    const { address, dates } = place;
    const [images, setImages] = useState([]);

    useEffect(() => {
        convertImagesAsync();
    }, []);

    const convertImagesAsync = async () => {
        const newImages = Array.isArray(place.images)
            ? place.images
            : [place.images];
        try {
            const updatedImages = await Promise.all(
                newImages.map(async (element) => ({
                    ...element,
                    imageData: await convertBase64ToImage(element.imageData),
                }))
            );

            setImages(updatedImages);
            console.log("images", images);
        } catch (error) {
            console.error("Error decoding base64 to images:", error);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {images && images.length > 0 && (
                        <Image
                            style={styles.image}
                            source={{
                                uri: images[0].imageData,
                            }}
                        />
                    )}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Ionicons name="ios-close" size={30} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Claim Place</Text>
                    <Text style={styles.addressText}>Address: {address}</Text>
                    <Text style={styles.datesTitle}>Possible Dates:</Text>
                    {dates.map((date, index) => (
                        <Text key={index} style={styles.dateText}>
                            - {date.date}
                        </Text>
                    ))}
                    <CostumButtonComp
                        onPress={() => {
                            navigation.navigate("Claim Review", {
                                review: place,
                            });
                        }}
                        text="claim for review"
                    />
                </View>
            </View>
        </Modal>
    );
};

export default ClaimPlacePopup;
