import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { HomeStyles } from "./HomeStyle";
import { MAPBOX_ACCESS_TOKEN, MAPS_API_KEY } from "../../constants";
import AddressSearchPopup from "../../components/addresssearchpopup/AddressSearchPopup";
import reviewData from "../../data/json/review";
import ClaimPlacePopup from "../../components/claimplacepopup/ClaimPlacePopup";
import {
    fetchLocationDetails,
    fetchPlacesNearby,
} from "../../services/ApiService";
import { fetchPlacesNotYours } from "../../services/ApiService";
import { useAuth } from "../../contexts/AuthContext";
import { getStorageItemAsync } from "../../services/LocalStorageService";

const HomeScreen = () => {
    //toDo after quick naviagtion claim reviewscreen and back the images on the popup sometimes still have old images
    const { state } = useAuth();
    const navigation = useNavigation();
    const [region, setRegion] = useState({
        latitude: 51.0543,
        longitude: 3.7174,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [loading, setLoading] = useState(true);
    const [locationCity, setLocationCity] = useState(null);
    const [searchbarVisible, setSearchbarVisible] = useState(false);
    const [claimPlaceVisible, setClaimPlaceVisible] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [maxDistanceSearch, setMaxDistanceSearch] = useState(10);
    //const [markerCoordinates, setMarkerCoordinates] = useState(null);
    console.log("claimPlaceVisible", claimPlaceVisible);
    useEffect(() => {
        fetchLocationAndCity();
    }, []);

    useEffect(() => {
        console.log("nearbyPlaces", nearbyPlaces);
    }, [nearbyPlaces]);

    useEffect(() => {
        updateLocation();
        /*setMarkerCoordinates({
            latitude: region.latitude,
            longitude: region.longitude,
        });*/
    }, [region, locationCity]);

    useFocusEffect(
        React.useCallback(() => {
            fetchNearbyPlaces();
            setClaimPlaceVisible(false);
        }, [region])
    );

    const fetchLocationAndCity = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                throw new Error("Permission to access location was denied");
            }

            const location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 51.2093,
                longitudeDelta: 3.2247,
            });

            if (location) {
                const details = await fetchLocationDetails(
                    region.latitude,
                    region.longitude
                );

                setLocationCity(details);
            } else {
                throw new Error("Location data is not available.");
            }

            setLoading(false);
        } catch (error) {
            console.error("Error: " + error.message);
            setLoading(false);
        }
    };

    const fetchNearbyPlaces = async () => {
        console.log("fetchNearbyPlaces gets triggerd");
        setNearbyPlaces([]);
        try {
            const places = await fetchPlacesNearby(
                state.userToken,
                region.latitude,
                region.longitude
            );
            setNearbyPlaces(places);
        } catch (error) {
            console.error("Error fetching nearby places: " + error.message);
        }
    };

    const changeLocation = (newLocationDetails) => {
        setRegion({
            latitude: newLocationDetails.geometry.location.lat,
            longitude: newLocationDetails.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
        updateLocation();
    };

    const updateLocation = async () => {
        setLoading(true);
        try {
            const city = await fetchLocationDetails(
                region.latitude,
                region.longitude
            );
            setLocationCity(city);
            setLoading(false);
        } catch (error) {
            console.error("Error changing location: " + error.message);
            setLoading(false);
        }
    };

    const openSearchbar = () => setSearchbarVisible(true);
    const closeSearchbar = () => setSearchbarVisible(false);

    const openClaimPlace = (place) => {
        console.log("place", place);
        setSelectedPlace(place);
        //console.log("selectedPlace", selectedPlace);
        setClaimPlaceVisible(true);
        console.log("claimPlaceVisible", claimPlaceVisible);
    };

    const closeClaimPlace = () => {
        console.log("closeClaimPlace triggered");
        setSelectedPlace(null);
        setClaimPlaceVisible(false);
    };

    if (loading) {
        return (
            <View style={HomeStyles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={HomeStyles.container}>
            <MapView
                style={HomeStyles.map}
                initialRegion={region}
                showsUserLocation={true}
            >
                {/*<Marker
                    coordinate={region}
                    title="Your chosen Location"
                    pinColor="blue"
                />*/}
                {nearbyPlaces &&
                    nearbyPlaces.map((place) => (
                        <Marker
                            key={place.id}
                            coordinate={{
                                latitude: place.coordinate.latitude,
                                longitude: place.coordinate.longitude,
                            }}
                            title={place.address}
                            onPress={() => openClaimPlace(place)}
                        />
                    ))}
            </MapView>

            <TouchableOpacity onPress={openSearchbar}>
                <Text style={HomeStyles.city}>City: {locationCity}</Text>
            </TouchableOpacity>

            <AddressSearchPopup
                isVisible={searchbarVisible}
                onClose={closeSearchbar}
                changeLocation={changeLocation}
            />

            {selectedPlace && (
                <ClaimPlacePopup
                    place={selectedPlace}
                    isVisible={claimPlaceVisible}
                    onClose={closeClaimPlace}
                />
            )}
        </View>
    );
};

export default HomeScreen;
