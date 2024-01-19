import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from "react-native";
import { loginStyle } from "./LoginStyle";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";

const LoginScreen = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = useState(false);
    //const setUserIsLoggedIn = route.params.setUserIsLoggedIn;

    //const navigation = useNavigation();
    const { signIn } = React.useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogin = async () => {
        setLoading(true);
        // Add your authentication logic here
        console.log("Logging in with email:", email, "and password:", password);

        //const loginSuccess = await login(email, password);
        const loginSuccess = true;
        try {
            loginSuccess = await signIn(email, password);
        } catch (e) {
            console.log("Something went wrong logging in:", e);
        }
        console.log("loginSuccess : " + loginSuccess);

        if (loginSuccess) {
            // Login successful
            //setUserIsLoggedIn(true); // Assuming you have this state variable in your StackNavigator
            setLoading(false);
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
        <View style={loginStyle.container}>
            <Image
                source={require("../../data/images/logo.png")}
                style={loginStyle.image}
            />
            <TextInput
                style={loginStyle.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={loginStyle.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <CostumButtonComp
                text="Login"
                onPress={handleLogin}
                disabled={loading}
            />

            <View>
                <TouchableOpacity onPress={handleRegisterPress}>
                    <Text style={loginStyle.register}>or register here</Text>
                </TouchableOpacity>
            </View>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    );
};

export default LoginScreen;
