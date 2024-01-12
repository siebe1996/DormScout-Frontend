import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "./CostumButtonStyle";

const CostumButtonComp = ({ onPress, text, disabled }) => (
    <TouchableOpacity
        onPress={onPress}
        style={styles.button}
        disabled={disabled}
    >
        <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
);

export default CostumButtonComp;
