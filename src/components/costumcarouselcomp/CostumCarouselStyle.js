import { StyleSheet } from "react-native";

export const costumCarouselStyle = StyleSheet.create({
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});
