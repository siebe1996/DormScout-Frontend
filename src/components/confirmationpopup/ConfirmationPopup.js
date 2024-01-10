import React from "react";
import { Alert } from "react-native";

const ConfirmationPopup = ({ title, message, onCancel, onConfirm }) => {
    const showAlert = () => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: onCancel,
                },
                {
                    text: "Confirm",
                    onPress: onConfirm,
                },
            ],
            { cancelable: true }
        );
    };

    return showAlert();
};

export default ConfirmationPopup;
