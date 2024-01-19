import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { costumTextInputStyle } from "./CostumTextInputStyle";

const CostumTextInputComp = ({
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    keyProp,
}) => {
    return (
        <View>
            <TextInput
                key={keyProp}
                style={costumTextInputStyle.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </View>
    );
};

export default CostumTextInputComp;
