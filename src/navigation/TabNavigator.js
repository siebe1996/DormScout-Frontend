import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import {
    NavigationContainer,
    getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { Text, View, TouchableOpacity } from "react-native";

import AccountScreen from "../screens/accountscreen/AccountScreen";
import HomeStackNavigator from "./HomeStackNavigator";
import YourReviewsStackNavigator from "./YourReviewsStackNavigator";
import YourPlacesStackNavigator from "./YourPlacesStackNavigator";
import AccountStackNavigator from "./AccountStackNavigator";
import { APP_TITLE } from "../constants";
import CostumHeaderComponent from "../components/costumheadercomponent/CostumHeaderComponent";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: "#a1b5d8",
                tabBarInactiveTintColor: "lightgrey",
                tabBarLabelStyle: {
                    fontSize: 11,
                },
                tabBarStyle: {
                    backgroundColor: "white",
                },
            }}
        >
            <Tab.Screen
                name="Home Stack"
                component={HomeStackNavigator}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-home" color={color} size={size} />
                    ),
                })}
            />
            <Tab.Screen
                name="Your Places Stack"
                component={YourPlacesStackNavigator}
                options={{
                    headerShown: false,
                    tabBarLabel: "Your Places",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="ios-business"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Your Reviews Stack"
                component={YourReviewsStackNavigator}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarLabel: "Your Reviews",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="ios-document"
                            color={color}
                            size={size}
                        />
                    ),
                })}
            />
            <Tab.Screen
                name="Account Stack"
                component={AccountStackNavigator}
                options={{
                    headerShown: false,
                    tabBarLabel: "Account",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-person" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
