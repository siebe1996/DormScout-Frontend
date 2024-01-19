import { StyleSheet } from "react-native";

export const yourReviewCardStyle = StyleSheet.create({
    cardContainer: {
        flexDirection: "row", // Use flexDirection to align items horizontally
        alignItems: "center", // Center items vertically
        marginBottom: 20,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        marginHorizontal: 16,
    },
    imageContainer: {
        marginRight: 16, // Add margin to separate the image from text
        width: 50, // Set a fixed width for the circular image container
        height: 50, // Set a fixed height for the circular image container
        borderRadius: 25, // Make it a circle by setting borderRadius to half of the width and height
        overflow: "hidden", // Clip the image to the circular shape
    },
    image: {
        width: "100%",
        height: "100%",
    },
    textContainer: {
        flex: 1, // Allow the text container to take the remaining space
    },
    addressText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
    },
});
