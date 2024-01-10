import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext"; // Import useAuth to get the state
import NavigationWrapper from "./src/navigation/NavigationWrapper";

export default function App() {
    return (
        <AuthProvider>
            <NavigationWrapper />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
