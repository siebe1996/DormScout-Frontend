import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { styles } from "./CostumTextStyle";

const CostumTextComp = ({ text, keyProp }) => {
    return (
        <View>
            {text ? (
                <Text style={styles.text} key={keyProp}>
                    {text}
                </Text>
            ) : (
                <Text style={styles.text}>No data</Text>
            )}
        </View>
    );
};

export default CostumTextComp;
