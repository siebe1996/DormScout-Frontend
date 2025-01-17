import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { cameraStyle } from "./CameraStyle";

const CameraScreen = ({ route }) => {
    const { claimedReview } = route.params;
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = Camera.useCameraPermissions();
    const [cameraRef, setCameraRef] = useState(null);

    if (!hasPermission) {
        return <View />;
    }

    if (!hasPermission.granted) {
        return (
            <View style={cameraStyle.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={setHasPermission} title="Grant Permission" />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            // Handle the taken photo (e.g., display it, save it, etc.)
            console.log("Photo taken:", photo);
            navigation.navigate("Write Review", {
                claimedReview,
                photoData: photo,
            });
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Camera
                style={{ flex: 1 }}
                type={Camera.Constants.Type.back}
                ref={(ref) => setCameraRef(ref)}
            >
                <View style={cameraStyle.cameraControls}>
                    <TouchableOpacity
                        onPress={takePicture}
                        style={cameraStyle.captureButton}
                    >
                        <Ionicons
                            name="ios-radio-button-on"
                            size={70}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
};

export default CameraScreen;
