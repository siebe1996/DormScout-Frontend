import React from "react";
import { View, Text } from "react-native";
import { costumHeaderStyle } from "./CostumHeaderStyle";

const CostumHeaderComponent = ({ title, subtitle }) => {
    return (
        <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{title}</Text>
            {subtitle && (
                <Text style={{ fontSize: 12, color: "gray" }}>{subtitle}</Text>
            )}
        </View>
    );
};

export default CostumHeaderComponent;
