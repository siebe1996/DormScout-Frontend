import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Modal, FlatList } from "react-native";
import { styles } from "./AddressSearchStyle";
import { MAPS_API_KEY } from "../../constants";
import axios from "axios";
import { fetchPredictions } from "../../services/ApiService";
import { fetchPlaceDetails } from "../../services/ApiService";

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
            <View style={styles.modalContainer}>
                <TextInput
                    style={styles.searchBar}
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
                <Button
                    title="Cancel"
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
