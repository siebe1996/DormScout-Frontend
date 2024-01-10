import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import CostumCarouselComp from "../../components/costumcarouselcomp/CostumCarouselComp";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import CostumTextComp from "../../components/costumtextcomp/CostumTextComp";
import CostumLabelComp from "../../components/costumlabelcomp/CostumLabelComp";
import CostumTextLabelComp from "../../components/costumtextlabelcomp/CostumTextLabelComp";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { putPlace } from "../../services/ApiService";
import { useAuth } from "../../contexts/AuthContext";
import { getStorageItemAsync } from "../../services/LocalStorageService";
import { convertBase64ArrayToImages } from "../../services/HelperFunctions";

const ClaimReviewScreen = ({ route }) => {
    const { state } = useAuth();
    const { review } = route.params;
    const navigation = useNavigation();
    const [address, setAddress] = useState(review.address);
    const [id, setId] = useState(review.id);
    const [email, setEmail] = useState(review.homeownerEmail);
    const [telephoneNumber, setTelephoneNumber] = useState(
        review.homeownerTelephone
    );
    const [link, setLink] = useState(review.link);
    const [dates, setDates] = useState(review.dates);
    const [notes, setNotes] = useState(review.notes);
    const [selectedPickerValue, setSelectedPickerValue] = useState(
        dates[0].date
    );
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    /*const images = [
        require("../../data/images/image1.jpg"),
        require("../../data/images/image2.jpg"),
        require("../../data/images/image3.jpg"),
    ];*/

    useEffect(() => {
        convertImagesAsync();
    }, []);

    const convertImagesAsync = async () => {
        try {
            const imageUrls = await convertBase64ArrayToImages(review.images);
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
        console.log("userid", user.id);
        const placeData = {
            chosenDate: selectedPickerValue,
            reviewerId: user.id,
        };
        const jsonPlaceData = JSON.stringify(placeData);
        console.log("jsonPlaceData:", jsonPlaceData);
        try {
            await putPlace(state.userToken, id, jsonPlaceData);
            navigation.navigate("Home");
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
            <View>
                <Text>Select a date:</Text>
                <Picker
                    selectedValue={selectedPickerValue}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedPickerValue(itemValue)
                    }
                >
                    {dates.map((date) => (
                        <Picker.Item
                            key={date.id}
                            label={date.date}
                            value={date.date}
                        />
                    ))}
                </Picker>
            </View>

            <View>
                <CostumLabelComp text="Extra Notes:" />
                {notes.length > 0 ? (
                    notes.map((note, index) => (
                        <CostumTextComp text={note.content} key={note.id} />
                    ))
                ) : (
                    <Text>No notes available</Text>
                )}
            </View>

            <CostumTextLabelComp label="Link Add:" text={link} />

            <CostumButtonComp onPress={() => save()} text="Claim" />
        </ScrollView>
    );
};

export default ClaimReviewScreen;
