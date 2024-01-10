import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { styles } from "./CostumTextLabelStyle";
import CostumLabelComp from "../costumlabelcomp/CostumLabelComp";
import CostumTextComp from "../costumtextcomp/CostumTextComp";

const CostumTextLabelComp = ({ label, text, keyProp }) => {
    return (
        <View style={styles.container}>
            <CostumLabelComp text={label} />
            <CostumTextComp text={text} key={keyProp} />
        </View>
    );
};

export default CostumTextLabelComp;
