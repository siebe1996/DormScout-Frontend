import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { imageStyle } from "./ImageStyle";

const ImagePopup = ({ isVisible, imageUri, onClose, onDelete }) => {
    if (!isVisible) {
        return null;
    }
    return (
        <Modal visible={isVisible} transparent={true} style={imageStyle.modal}>
            <View style={imageStyle.modalContent}>
                <View style={imageStyle.imageContainer}>
                    <Image
                        source={{ uri: imageUri }}
                        style={imageStyle.image}
                    />
                    <TouchableOpacity
                        style={imageStyle.closeButton}
                        onPress={onClose}
                    >
                        <Ionicons name="ios-close" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={imageStyle.deleteButton}
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
