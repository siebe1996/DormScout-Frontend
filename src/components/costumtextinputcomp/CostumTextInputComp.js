import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { styles } from "./CostumTextInputStyle";

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
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </View>
    );
};

export default CostumTextInputComp;
