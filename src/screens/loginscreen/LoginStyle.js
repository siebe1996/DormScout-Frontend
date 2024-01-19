import { StyleSheet } from "react-native";

export const loginStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#a1b5d8",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    header: {
        fontSize: 36,
        marginBottom: 16,
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 0,
        marginBottom: 16,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 3,
    },
    register: {
        textDecorationLine: "underline",
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "cover",
    },
});
