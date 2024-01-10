import React from "react";
import { View, Text } from "react-native";
import { InvalidTextFieldStyle } from "./InvalidTextFieldStyle";

const InvalidTextField = ({ text }) => {
    return (
        <View>
            <Text style={InvalidTextFieldStyle.text}>{text}</Text>
        </View>
    );
};

export default InvalidTextField;
