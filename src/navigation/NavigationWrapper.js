import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import TabNavigator from "./TabNavigator";
import LoginStackNavigator from "./LoginStackNavigator";

export default function NavigationWrapper({ navigation }) {
    const { state } = useAuth();
    console.log("user token in navigator:", state.token); // Add this line to check the state

    return (
        <NavigationContainer>
            {state.userToken ? <TabNavigator /> : <LoginStackNavigator />}
        </NavigationContainer>
    );
}
