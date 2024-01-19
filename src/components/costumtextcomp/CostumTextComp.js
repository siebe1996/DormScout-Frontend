import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { costumTextStyle } from "./CostumTextStyle";

const CostumTextComp = ({ text, keyProp }) => {
    return (
        <View>
            {text ? (
                <Text style={costumTextStyle.text} key={keyProp}>
                    {text}
                </Text>
            ) : (
                <Text style={costumTextStyle.text}>No data</Text>
            )}
        </View>
    );
};

export default CostumTextComp;
