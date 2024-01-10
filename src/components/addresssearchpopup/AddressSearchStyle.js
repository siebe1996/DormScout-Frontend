import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    },
    searchBar: {
        height: 40,
        width: "80%",
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 5,
    },
});