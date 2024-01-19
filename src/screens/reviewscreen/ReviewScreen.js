import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import CostumTextLabelComp from "../../components/costumtextlabelcomp/CostumTextLabelComp";
import CostumLabelComp from "../../components/costumlabelcomp/CostumLabelComp";
import CostumTextComp from "../../components/costumtextcomp/CostumTextComp";
import StarReviewPopup from "../../components/starreviewpopup/StarReviewPopup";
import { reviewStyle } from "./ReviewStyle";
import reviewData from "../../data/json/review";
import {
    fetchReview,
    postAssessment,
    fetchAssessment,
} from "../../services/ApiService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Rating } from "react-native-ratings";
import { convertBase64ArrayToImages } from "../../services/HelperFunctions";
import CostumCarouselComp from "../../components/costumcarouselcomp/CostumCarouselComp";

const ReviewScreen = ({ route }) => {
    const { state } = useAuth();
    const { claimedAndFinishedReview } = route.params;
    console.log("claimedAndFinishedReview", claimedAndFinishedReview);

    const [address, setAddress] = useState(claimedAndFinishedReview.address);
    const [email, setEmail] = useState(claimedAndFinishedReview.homeownerEmail);
    const [telephoneNumber, setTelephoneNumber] = useState(
        claimedAndFinishedReview.homeownerTelephone
    );
    const [link, setLink] = useState(claimedAndFinishedReview.link);
    const [date, setDate] = useState(claimedAndFinishedReview.chosenDate);
    const [dates, setDates] = useState(claimedAndFinishedReview.dates);
    const [notes, setNotes] = useState(claimedAndFinishedReview.notes);
    const [reviewId, setReviewId] = useState(claimedAndFinishedReview.reviewId);
    const [reviewImages, setReviewImages] = useState([]);
    const [assessmentId, setAssessmentId] = useState();
    const [assessment, setAssessment] = useState();
    const [review, setReview] = useState(claimedAndFinishedReview.review);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const navigation = useNavigation();

    /*useEffect(() => {
        console.log("reviewId", reviewId);
        fetchReviewAsync();
        console.log("assessmentId", assessmentId);
        if (assessmentId) {
            fetchAssessmentAsync();
        } else {
            setLoading2(false);
        }
    }, [assessmentId]);*/
    useEffect(() => {
        console.log("reviewId", reviewId);
        fetchReviewAsync();
    }, [reviewId]);

    useEffect(() => {
        console.log("assessmentId", assessmentId);
        if (assessmentId) {
            fetchAssessmentAsync();
        } else {
            setLoading2(false);
        }
    }, [assessmentId]);

    const openPopup = () => {
        setPopupVisible(true);
    };

    const handleRatingSubmit = async (rating) => {
        console.log("Rating submitted:", rating);
        const assessmentData = {
            reviewId: reviewId,
            score: rating,
        };
        const jsonAssessmentData = JSON.stringify(assessmentData);
        console.log("jsonReviewData:", jsonAssessmentData);
        try {
            await postAssessment(state.userToken, jsonAssessmentData);
            navigation.navigate("Your Places");
        } catch (error) {
            console.error("Error posting the new assessment", error);
        }
    };

    useEffect(() => {
        console.log("7", dates);
    }, [dates]);

    const fetchReviewAsync = async () => {
        try {
            const reviewFetched = await fetchReview(state.userToken, reviewId);
            //console.log("reviewFetched", reviewFetched);
            setReview(reviewFetched);
            setAssessmentId(reviewFetched.assessmentId);
            console.log("reviewFetched.images", reviewFetched.images);
            try {
                const imageUrls = await convertBase64ArrayToImages(
                    reviewFetched.images
                );
                console.log("Decoded image URLs:", imageUrls);
                setReviewImages(imageUrls);
            } catch (error) {
                console.error("Error decoding base64 to images:", error);
            }
            setLoading1(false);
        } catch (error) {
            console.error("Error: " + error.message);
            setLoading1(false);
        }
    };

    const fetchAssessmentAsync = async () => {
        try {
            const assessmentFetched = await fetchAssessment(
                state.userToken,
                assessmentId
            );
            console.log("assessmentFetched", assessmentFetched);
            setAssessment(assessmentFetched);
            setLoading2(false);
        } catch (error) {
            console.error("Error: " + error.message);
            setLoading2(false);
        }
    };

    if (loading1 || loading2) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>
            <CostumTextLabelComp label="Address:" text={address} />

            <CostumTextLabelComp label="Email Houseowner:" text={email} />

            <CostumTextLabelComp
                label="Telephone Number Houseowner:"
                text={telephoneNumber}
            />

            <CostumTextLabelComp label="Link Add:" text={link} />

            <View>
                <CostumLabelComp text="Chosen Date:" />
                <CostumTextComp text={new Date(date).toLocaleDateString()} />
                <CostumTextComp text={new Date(date).toLocaleTimeString()} />
            </View>

            <View>
                <CostumLabelComp text="Extra Notes:" />
                {notes.map((note) => (
                    <CostumTextComp text={note.content} key={note.id} />
                ))}
            </View>

            <CostumTextLabelComp
                //style={{ marginBottom: 150 }}
                label="Review"
                text={review.text}
            />

            <CostumCarouselComp images={reviewImages} />

            {console.log("assessment2", assessment)}
            {!assessment ? (
                <CostumButtonComp onPress={openPopup} text="Give Assessment" />
            ) : (
                <View style={{ backgroundColor: "white" }}>
                    <Text>Assessment already given</Text>
                    <Rating
                        type="star"
                        ratingCount={5}
                        startingValue={assessment.score}
                        jumpValue={0}
                        fractions={1}
                        ratingColor="blue"
                        ratingBackgroundColor="#000000"
                        readonly
                        showRating={false}
                    />
                </View>
            )}

            <StarReviewPopup
                isVisible={isPopupVisible}
                onClose={() => setPopupVisible(false)}
                onSubmit={handleRatingSubmit}
            />
        </ScrollView>
    );
};

export default ReviewScreen;
