import { StyleSheet } from "react-native";

export const accountStyle = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        flex: 1,
    },
    image: {
        width: 75,
        height: 75,
        marginBottom: 15,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#a1b5d8",
        marginLeft: 50,
    },
    flex: {
        flex: 1,
        justifyContent: "center",
    },
    inline: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    iconStyle: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    otherText: {
        color: "#a1b5d8",
        marginBottom: 20,
    },
});
