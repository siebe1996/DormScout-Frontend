import { StyleSheet } from "react-native";

export const claimPlaceStyle = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    addressText: {
        fontSize: 16,
        marginBottom: 10,
    },
    datesText: {
        fontSize: 16,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "cover",
    },
});
