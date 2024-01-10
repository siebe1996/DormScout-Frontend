import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "./ClaimedReviewStyle";
import CostumCarouselComp from "../../components/costumcarouselcomp/CostumCarouselComp";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import CostumTextComp from "../../components/costumtextcomp/CostumTextComp";
import CostumLabelComp from "../../components/costumlabelcomp/CostumLabelComp";
import CostumTextLabelComp from "../../components/costumtextlabelcomp/CostumTextLabelComp";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { putPlace } from "../../services/ApiService";
import { getStorageItemAsync } from "../../services/LocalStorageService";
import { convertBase64ArrayToImages } from "../../services/HelperFunctions";

const ClaimedReviewScreen = ({ route }) => {
    const { state } = useAuth();
    const navigation = useNavigation();
    const { claimedReview } = route.params;
    const [address, setAddress] = useState(claimedReview.address);
    const [email, setEmail] = useState(claimedReview.homeownerEmail);
    const [telephoneNumber, setTelephoneNumber] = useState(
        claimedReview.homeownerTelephone
    );
    const [link, setLink] = useState(claimedReview.link);
    const [date, setDate] = useState(claimedReview.chosenDate);
    const [dates, setDates] = useState(claimedReview.dates);
    const [notes, setNotes] = useState(claimedReview.notes);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        convertImagesAsync();
    }, []);

    const convertImagesAsync = async () => {
        try {
            const imageUrls = await convertBase64ArrayToImages(
                claimedReview.images
            );
            console.log("Decoded image URLs:", imageUrls);
            setImages(imageUrls);
        } catch (error) {
            console.error("Error decoding base64 to images:", error);
        }
        setLoading(false);
    };

    const save = async () => {
        const user = JSON.parse(await getStorageItemAsync("user"));
        console.log("user", user);
        const placeData = {
            reviewerId: null,
            chosenDate: null,
        };
        const jsonPlaceData = JSON.stringify(placeData);
        console.log("jsonPlaceData:", jsonPlaceData);
        try {
            await putPlace(state.userToken, claimedReview.id, jsonPlaceData);
            navigation.navigate("Your Reviews");
        } catch (error) {
            console.error("Error putting the Place:", error);
        }
    };

    if (loading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ padding: 16 }}>
            <CostumCarouselComp images={images} />

            <CostumTextLabelComp label="Address:" text={address} />

            <CostumTextLabelComp
                label="Date:"
                text={`${new Date(date).toLocaleDateString()} ${new Date(
                    date
                ).toLocaleTimeString()}`}
            />

            <View>
                <CostumLabelComp text="Extra Notes:" />
                {notes &&
                    notes.map((note, index) => (
                        <CostumTextComp text={notes.content} key={note.id} />
                    ))}
            </View>

            <CostumTextLabelComp label="Link Add:" text={link} />

            <View>
                <CostumLabelComp text="Contact Homeowner:" />
                <CostumTextComp text={telephoneNumber} />
                <CostumTextComp text={email} />
            </View>

            <CostumButtonComp
                onPress={() =>
                    navigation.navigate("Write Review", {
                        claimedReview: claimedReview,
                    })
                }
                text="Review"
            />
            <CostumButtonComp onPress={() => save()} text="Unclaim" />
        </ScrollView>
    );
};

export default ClaimedReviewScreen;
