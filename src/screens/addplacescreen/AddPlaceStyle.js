// AddPlaceStyle.js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 16,
    },
    add: { color: "blue" },
    remove: { color: "blue" },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalCloseText: {
        color: "white",
        textAlign: "center",
        padding: 15,
        backgroundColor: "#2196F3",
    },
});
