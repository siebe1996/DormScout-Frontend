import React, { useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import HomeScreen from "../screens/homescreen/HomeScreen";
import ClaimReviewScreen from "../screens/claimreviewscreen/ClaimReviewScreen";
import { APP_TITLE } from "../constants";

import CostumHeaderComponent from "../components/costumheadercomponent/CostumHeaderComponent";

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={
                {
                    //headerShown: false,
                }
            }
        >
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent title={APP_TITLE} />
                    ),
                }}
                name="Home"
                component={HomeScreen}
            />
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Claim For Review"}
                        />
                    ),
                }}
                name="Claim Review"
                component={ClaimReviewScreen}
            />
        </Stack.Navigator>
    );
};

export default HomeStackNavigator;
