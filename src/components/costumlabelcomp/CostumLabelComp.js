import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { costumLabelStyle } from "./CostumLabelStyle";

const CostumLabelComp = ({ text }) => {
    return (
        <View>
            <Text style={costumLabelStyle.label}>{text}</Text>
        </View>
    );
};

export default CostumLabelComp;
