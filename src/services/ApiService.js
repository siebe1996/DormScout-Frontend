// ApiService.js
import axios from "axios";
import { BACKEND_API } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
    baseURL: BACKEND_API,
});
const getToken = () => {
    return state.token;
};

export const postPlace = async (userToken, data) => {
    try {
        const response = await api.post("/places", data, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const patchPlace = async (userToken, placeId, data) => {
    try {
        const response = await api.patch(`/places/${placeId}`, data, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPlacesReviewer = async (userToken) => {
    try {
        const response = await api.get("/places/reviewer", {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPlacesYours = async (userToken) => {
    try {
        const response = await api.get("/places/yours", {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPlacesNotYours = async (userToken) => {
    try {
        const response = await api.get("/places/notyours", {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPlacesNearby = async (userToken, lat, lon) => {
    try {
        const response = await api.get(`/places/nearby?lat=${lat}&lon=${lon}`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPlace = async (userToken, placeId) => {
    try {
        const response = await api.get(`places/${placeId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const putPlace = async (userToken, placeId, data) => {
    try {
        const response = await api.put(`places/${placeId}`, data, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postReview = async (userToken, data) => {
    try {
        const response = await api.post("/reviews", data, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchReview = async (userToken, reviewId) => {
    try {
        const response = await api.get(`reviews/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postAssessment = async (userToken, data) => {
    try {
        const response = await api.post("/assessments", data, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchAssessment = async (userToken, assessmentId) => {
    try {
        const response = await api.get(`assessments/${assessmentId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const putUser = async (userToken, userId, data) => {
    try {
        const response = await api.put(`users/${userId}`, data, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUser = async (userToken, userId) => {
    try {
        const response = await api.get(`users/${userId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUserMe = async (userToken) => {
    console.log("this");
    try {
        const response = await api.get(`users/me`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postUser = async (data) => {
    try {
        const response = await api.post("users", data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postPaymentIntent = async (userToken, data) => {
    try {
        const response = await api.post("paymentintent/create", data, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const CheckTokenExp = async (token) => {
    try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp) {
            const currentTime = Date.now() / 1000;
            return currentTime > decodedToken.exp;
        }
        return false;
    } catch (error) {
        console.error("Error decoding token:", error);
        return false;
    }
};

//GOOGLE API

export const fetchPredictions = async (address) => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${address}&key=${process.env.EXPO_PUBLIC_MAPS_API_KEY}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPlaceDetails = async (placeId) => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${process.env.EXPO_PUBLIC_MAPS_API_KEY}`
        );
        return response.data.result;
    } catch (error) {
        console.error("Error fetching place details:", error.message);
        return null;
    }
};

export const fetchLocationDetails = async (latitude, longitude) => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_MAPS_API_KEY}`
        );
        const addressComponents = response.data.results[0].address_components;

        const cityComponent = addressComponents.find((component) =>
            component.types.includes("locality")
        );

        const city = cityComponent ? cityComponent.long_name : null;

        return city;
    } catch (error) {
        throw error;
    }
};

export const fetchAddressInfo = async (address) => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAPS_API_KEY}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
