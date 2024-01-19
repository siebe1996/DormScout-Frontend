// ImageStyle.js

import { StyleSheet } from "react-native";

export const imageStyle = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    imageContainer: {
        position: "relative",
        width: "80%",
        height: "80%",
        paddingTop: 0,
    },
    image: {
        position: "absolute",
        top: 0, // Adjust the top value as needed
        left: 0, // Adjust the left value as needed
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "transparent",
        padding: 10,
    },
    deleteButton: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "transparent",
        padding: 10,
    },
});
