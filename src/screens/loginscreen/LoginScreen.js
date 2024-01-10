import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { LoginStyle } from "./LoginStyle";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    //const setUserIsLoggedIn = route.params.setUserIsLoggedIn;

    //const navigation = useNavigation();
    const { signIn } = React.useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogin = async () => {
        // Add your authentication logic here
        console.log("Logging in with email:", email, "and password:", password);

        //const loginSuccess = await login(email, password);
        const loginSuccess = await signIn(email, password);
        console.log("loginSuccess : " + loginSuccess);

        if (loginSuccess) {
            // Login successful
            //setUserIsLoggedIn(true); // Assuming you have this state variable in your StackNavigator

            console.log("Login successful");
            /*navigation.navigate("Home", {
            });*/
        } else {
            // Handle login errors, e.g., display an error message to the user
            console.error("Login failed");
        }
    };

    const handleRegisterPress = () => {
        navigation.navigate("Register");
    };

    return (
        <View style={LoginStyle.container}>
            <Text style={LoginStyle.header}>Login</Text>
            <TextInput
                style={LoginStyle.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={LoginStyle.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />

            <View>
                <Text>or register</Text>
                <TouchableOpacity onPress={handleRegisterPress}>
                    <Text> here</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;
