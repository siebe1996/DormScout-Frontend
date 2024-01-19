import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { costumTextInputLabelStyle } from "./CostumTextInputLabelStyle";
import CostumLabelComp from "../costumlabelcomp/CostumLabelComp";
import CostumTextInputComp from "../costumtextinputcomp/CostumTextInputComp";

const CostumTextInputLabelComp = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    keyProp,
}) => {
    return (
        <View style={costumTextInputLabelStyle.container}>
            <CostumLabelComp text={label} />
            <CostumTextInputComp
                key={keyProp}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </View>
    );
};

export default CostumTextInputLabelComp;
