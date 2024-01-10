import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cameraControls: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    captureButton: {
        flex: 0.1,
        alignSelf: "center",
        alignItems: "center",
    },
});
