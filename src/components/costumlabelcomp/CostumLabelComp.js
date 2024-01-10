import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { styles } from "./CostumLabelStyle";

const CostumLabelComp = ({ text }) => {
    return (
        <View>
            <Text style={styles.label}>{text}</Text>
        </View>
    );
};

export default CostumLabelComp;
