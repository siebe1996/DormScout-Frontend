import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ImageStyle";

const ImagePopup = ({ isVisible, imageUri, onClose, onDelete }) => {
    if (!isVisible) {
        return null;
    }
    return (
        <Modal visible={isVisible} transparent={true} style={styles.modal}>
            <View style={styles.modalContent}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Ionicons name="ios-close" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={onDelete}
                    >
                        <Ionicons name="ios-trash" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ImagePopup;
