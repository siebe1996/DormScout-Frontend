import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "./CostumButtonStyle";

const CostumButtonComp = ({ onPress, text }) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
);

export default CostumButtonComp;
