import React, { useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import YourPlacesScreen from "../screens/yourplacesscreen/YourPlacesScreen";
import EditPlaceScreen from "../screens/editplacescreen/EditPlaceScreen";
import AddPlaceScreen from "../screens/addplacescreen/AddPlaceScreen";
import ReviewScreen from "../screens/reviewscreen/ReviewScreen";
import { APP_TITLE } from "../constants";
import CostumHeaderComponent from "../components/costumheadercomponent/CostumHeaderComponent";

const Stack = createStackNavigator();

const YourPlacesStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Your Places">
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Your places"}
                        />
                    ),
                }}
                name="Your Places"
                component={YourPlacesScreen}
            />
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Edit Place"}
                        />
                    ),
                }}
                name="Edit Place"
                component={EditPlaceScreen}
            />
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Add Place"}
                        />
                    ),
                }}
                name="Add Place"
                component={AddPlaceScreen}
            />
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Review"}
                        />
                    ),
                }}
                name="Review"
                component={ReviewScreen}
            />
        </Stack.Navigator>
    );
};

export default YourPlacesStackNavigator;
