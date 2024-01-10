import React, { useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import AccountScreen from "../screens/accountscreen/AccountScreen";
import EditAccountScreen from "../screens/editaccountscreen/EditAccountScreen";
import { APP_TITLE } from "../constants";
import TestStripeScreen from "../screens/teststripescreen/TestStripeScreen";

import CostumHeaderComponent from "../components/costumheadercomponent/CostumHeaderComponent";

const Stack = createStackNavigator();

const AccountStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Account"
            screenOptions={
                {
                    //headerShown: false,
                }
            }
        >
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Account"}
                        />
                    ),
                }}
                name="Account"
                component={AccountScreen}
            />
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Edit"}
                        />
                    ),
                }}
                name="Edit Account"
                component={EditAccountScreen}
            />
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Test"}
                        />
                    ),
                }}
                name="Test"
                component={TestStripeScreen}
            />
        </Stack.Navigator>
    );
};

export default AccountStackNavigator;
