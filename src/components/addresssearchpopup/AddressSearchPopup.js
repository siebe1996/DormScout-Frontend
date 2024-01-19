import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Modal, FlatList } from "react-native";
import { addressSearchStyle } from "./AddressSearchStyle";
import axios from "axios";
import { fetchPredictions } from "../../services/ApiService";
import { fetchPlaceDetails } from "../../services/ApiService";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";

const AddressSearchPopup = ({ isVisible, onClose, changeLocation }) => {
    const [searchText, setSearchText] = useState("");
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        fetchData();
    }, [searchText]);

    const fetchData = async () => {
        if (searchText.length > 0) {
            try {
                const result = await fetchPredictions(searchText);
                setPredictions(result.predictions);
            } catch (error) {
                console.error("Error fetching predictions:", error.message);
            }
        } else {
            setPredictions([]);
        }
    };

    const handleSearch = async (selectedPrediction) => {
        setSearchText(selectedPrediction.description);
        const placeDetails = await fetchPlaceDetails(
            selectedPrediction.place_id
        );
        changeLocation(placeDetails);
        setPredictions([]);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={addressSearchStyle.modalContainer}>
                <TextInput
                    style={addressSearchStyle.searchBar}
                    placeholder="Enter address, country, or place"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
                {predictions.length > 0 && (
                    <FlatList
                        data={predictions}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Button
                                title={item.description}
                                onPress={() => handleSearch(item)}
                            />
                        )}
                    />
                )}
                <CostumButtonComp
                    text="Cancel"
                    onPress={() => {
                        setPredictions([]);
                        onClose();
                    }}
                />
            </View>
        </Modal>
    );
};

export default AddressSearchPopup;
