import { StyleSheet } from "react-native";

export const LoginStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "gray",
        marginBottom: 16,
        padding: 8,
    },
});
