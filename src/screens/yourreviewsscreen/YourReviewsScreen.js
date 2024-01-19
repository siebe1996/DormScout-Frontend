import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import YourReviewCardComp from "../../components/yourreviewcardcomp/YourReviewCardComp";
import reviewData from "../../data/json/review";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { fetchPlacesReviewer } from "../../services/ApiService";
import { showAlertOffline } from "../../services/HelperFunctions";
import { yourReviewsStyle } from "./YourReviewsStyle";

const YourReviewsScreen = () => {
    const { state } = useAuth();
    const navigation = useNavigation();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            fetchReviews();
        }, [])
    );

    const fetchReviews = async () => {
        try {
            const placesFetched = await fetchPlacesReviewer(state.userToken);
            console.log("placesFetched", placesFetched);
            setPlaces(placesFetched);
            setLoading(false);
        } catch (error) {
            console.error("Error: " + error.message);
            setLoading(false);
            showAlertOffline();
        }
    };

    /*const showAlertOffline = () => {
        Alert.alert(
            "You are offline",
            "If you are offline you're not able to edit, and data present might not be accurate"
        );
    };*/

    const claimedNotFinishedPlaces = places.filter(
        (item) => item.reviewId === null
    );
    const claimedAndFinishedPlaces = places.filter(
        (item) => item.reviewId !== null
    );

    const showAlert = () => {
        Alert.alert("Already gave review", "You can't edit a review");
    };

    if (loading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={yourReviewsStyle.container}>
                <Text style={yourReviewsStyle.title}>
                    Claimed not finished reviews
                </Text>
                {claimedNotFinishedPlaces &&
                claimedNotFinishedPlaces.length > 0 ? (
                    claimedNotFinishedPlaces.map((item) => (
                        <YourReviewCardComp
                            key={item.id}
                            item={item}
                            onPress={() =>
                                navigation.navigate("Claimed Review", {
                                    claimedReview: item,
                                })
                            }
                        />
                    ))
                ) : (
                    <Text>No data available</Text>
                )}
            </View>
            <View style={yourReviewsStyle.container}>
                <Text style={yourReviewsStyle.title}>
                    Claimed and finished reviews
                </Text>
                {claimedAndFinishedPlaces &&
                claimedAndFinishedPlaces.length > 0 ? (
                    claimedAndFinishedPlaces.map((item) => (
                        <YourReviewCardComp
                            key={item.id}
                            item={item}
                            onPress={() => showAlert()}
                        />
                    ))
                ) : (
                    <Text>No data available</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default YourReviewsScreen;
