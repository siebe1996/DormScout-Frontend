import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { costumButtonStyle } from "./CostumButtonStyle";

const CostumButtonComp = ({ onPress, text, disabled }) => (
    <TouchableOpacity
        onPress={onPress}
        style={costumButtonStyle.button}
        disabled={disabled}
    >
        <Text style={costumButtonStyle.buttonText}>{text}</Text>
    </TouchableOpacity>
);

export default CostumButtonComp;
