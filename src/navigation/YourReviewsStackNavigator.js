import React, { useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import YourReviewsScreen from "../screens/yourreviewsscreen/YourReviewsScreen";
import ClaimedReviewScreen from "../screens/claimedreviewscreen/ClaimedReviewScreen";
import WriteReviewScreen from "../screens/writereviewscreen/WriteReviewScreen";
import CameraScreen from "../screens/camerascreen/CameraScreen";
import { APP_TITLE } from "../constants";
import CostumHeaderComponent from "../components/costumheadercomponent/CostumHeaderComponent";

const Stack = createStackNavigator();

const YourReviewsStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Your Reviews">
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Your reviews"}
                        />
                    ),
                }}
                name="Your Reviews"
                component={YourReviewsScreen}
            />
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Claimed Review"}
                        />
                    ),
                }}
                name="Claimed Review"
                component={ClaimedReviewScreen}
            />
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <CostumHeaderComponent
                            title={APP_TITLE}
                            subtitle={"Write Review"}
                        />
                    ),
                }}
                name="Write Review"
                component={WriteReviewScreen}
            />
            <Stack.Screen options={{}} name="Camera" component={CameraScreen} />
        </Stack.Navigator>
    );
};

export default YourReviewsStackNavigator;
