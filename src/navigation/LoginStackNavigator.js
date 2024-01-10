import React, { useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import LoginScreen from "../screens/loginscreen/LoginScreen";
import RegisterScreen from "../screens/registerscreen/RegisterScreen";

const Stack = createStackNavigator();

const LoginStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={
                {
                    //headerShown: false,
                }
            }
        >
            <Stack.Screen options={{}} name="Login" component={LoginScreen} />
            <Stack.Screen
                options={{}}
                name="Register"
                component={RegisterScreen}
            />
        </Stack.Navigator>
    );
};

export default LoginStackNavigator;
