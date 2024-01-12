import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import YourPlaceCardComp from "../../components/yourplacecardcomp/YourPlaceCardComp";
import YourReviewCardComp from "../../components/yourreviewcardcomp/YourReviewCardComp";
import reviewData from "../../data/json/review";
import { styles } from "./YourPlacesStyle"; // Import or define your styles
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchPlacesYours } from "../../services/ApiService";
import { useAuth } from "../../contexts/AuthContext";
import { showAlertOffline } from "../../services/HelperFunctions";

const YourPlacesScreen = () => {
    const { state } = useAuth();
    const navigation = useNavigation();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            // This code will run when the screen is focused
            fetchPlaces();
        }, [])
    );

    useEffect(() => {
        console.log("places", places);
    }, [places]);

    const fetchPlaces = async () => {
        try {
            const placesFetched = await fetchPlacesYours(state.userToken);
            console.log("placesFetched", placesFetched);
            setPlaces(placesFetched);
            setLoading(false);
        } catch (error) {
            console.error("Error: " + error.message);
            setLoading(false);
            showAlertOffline();
        }
    };

    const unClaimedReviews = places.filter((item) => item.reviewerId === null);
    console.log("places", places);
    console.log("unClaimedReviews", unClaimedReviews);
    const claimedNotFinishedReviews = places.filter(
        (item) => item.reviewerId !== null && item.reviewId === null
    );

    const claimedAndFinishedReviews = places.filter(
        (item) => item.reviewerId !== null && item.reviewId !== null
    );

    const showAlert = () => {
        Alert.alert(
            "Cannot Edit or Give Assessment",
            "You can't edit a place or give an assessment for the review at this time. Please make sure you are near the location of the place."
        );
    };

    const navigateToReviewScreen = (item) => {
        navigation.navigate("Review", {
            claimedAndFinishedReview: item,
        });
    };

    if (loading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.listContainer}>
                <Text>Unclaimed reviews</Text>
                {unClaimedReviews && unClaimedReviews.length > 0 ? (
                    unClaimedReviews.map((item) => (
                        <YourPlaceCardComp
                            key={item.id}
                            item={item}
                            onPress={() => {
                                console.log("item in card", item);
                                navigation.navigate("Edit Place", {
                                    unclaimedReview: item,
                                });
                            }}
                        />
                    ))
                ) : (
                    <Text>No data available</Text>
                )}
            </View>
            <View style={styles.listContainer}>
                <Text>Claimed not finished reviews</Text>
                {claimedNotFinishedReviews &&
                claimedNotFinishedReviews.length > 0 ? (
                    claimedNotFinishedReviews.map((item) => (
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
            <View style={styles.listContainer}>
                <Text>Claimed and finished reviews</Text>
                {claimedAndFinishedReviews &&
                claimedAndFinishedReviews.length > 0 ? (
                    claimedAndFinishedReviews.map((item) => (
                        <YourReviewCardComp
                            key={item.id}
                            item={item}
                            onPress={() => navigateToReviewScreen(item)}
                        />
                    ))
                ) : (
                    <Text>No data available</Text>
                )}
            </View>
            {/*<View style={styles.listContainer}>
                <Text>Claimed and finished reviews</Text>
                {claimedAndFinishedReviews && claimedAndFinishedReviews > 0 ? (
                    claimedAndFinishedReviews.map((item) => (
                        <YourReviewCardComp
                            key={item.id}
                            item={item}
                            onPress={() =>
                                navigation.navigate("Review", {
                                    claimedAndFinishedReview: item,
                                })
                            }
                        />
                    ))
                ) : (
                    <Text>No data available</Text>
                )}
            </View>*/}

            <CostumButtonComp
                onPress={() => {
                    navigation.navigate("Add Place");
                }}
                text="add place"
            />
        </ScrollView>
    );
};

export default YourPlacesScreen;
