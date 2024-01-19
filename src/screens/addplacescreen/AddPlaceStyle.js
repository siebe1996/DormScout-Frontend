// AddPlaceStyle.js
import { StyleSheet } from "react-native";

export const addPlaceStyle = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 16,
    },
    add: {
        color: "blue",
        fontSize: 16,
        marginVertical: 15,
    },
    remove: { color: "blue", fontSize: 12, marginVertical: 15 },
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
