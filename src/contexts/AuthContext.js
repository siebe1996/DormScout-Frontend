// AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
    setStorageItemAsync,
    getStorageItemAsync,
    removeStorageItemAsync,
} from "../services/LocalStorageService";
import axios from "axios";
import { BACKEND_API } from "../constants";
import { convertBase64ToImage } from "../services/HelperFunctions";

export const AuthContext = createContext();

const api = axios.create({
    baseURL: BACKEND_API, // Replace with your API base URL
});

function authReducer(state, action) {
    switch (action.type) {
        case "RESTORE_TOKEN":
            return {
                ...state,
                userToken: action.token,
                isLoading: false,
            };
        case "SIGN_IN":
            return {
                ...state,
                isSignout: false,
                userToken: action.token,
            };
        case "SIGN_OUT":
            return {
                ...state,
                isSignout: true,
                userToken: null,
            };
        default:
            return state;
    }
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        isLoading: true,
        isSignout: false,
        userToken: null,
    });

    useEffect(() => {
        // Retrieve the userToken from local storage when the component mounts
        const bootstrapAsync = async () => {
            let userToken = null;
            try {
                userToken = await getStorageItemAsync("userToken");
            } catch (e) {
                // Restoring token failed
            }

            // Dispatch the token to restore the state
            dispatch({ type: "RESTORE_TOKEN", token: userToken });
        };

        bootstrapAsync();
    }, []); // The empty dependency array ensures this effect runs once on component mount

    const authContext = {
        signIn: async (email, password) => {
            try {
                console.log("BACKEND_API ", BACKEND_API);
                const response = await api.post(
                    "/users/authenticate",
                    /*"https://192.168.1.103:7021/api/users/authenticate",*/
                    {
                        email: email,
                        password: password,
                    }
                );
                console.log(response.data);
                const user = response.data;
                if (user.imageData != null) {
                    const imageDataBase64 = user.imageData;
                    console.log("imageDataBase64", imageDataBase64);
                    const imageData = await convertBase64ToImage(
                        imageDataBase64
                    );
                    console.log("imageData", imageData);
                    user.imageData = imageData;
                }
                await setStorageItemAsync("user", JSON.stringify(user));
                const token = response.data.jwtToken; // Assuming your API returns a token
                // Persist the token using SecureStore
                await setStorageItemAsync("userToken", token);
                //await SecureStore.setItemAsync("userToken", token);

                dispatch({ type: "SIGN_IN", token: token });
                return true;
            } catch (error) {
                // Handle authentication errors
                console.error("Authentication failed:", error);
                return false;
                // You can show an error message to the user if needed.
            }
        },
        signOut: async () => {
            await removeStorageItemAsync("user");
            console.log(await getStorageItemAsync("user"));
            await removeStorageItemAsync("userToken");
            console.log(await getStorageItemAsync("userToken"));
            dispatch({ type: "SIGN_OUT" });
        },
        signUp: async (data) => {
            // In a production app, we need to send user data to server and get a token
            // We will also need to handle errors if sign up failed
            // After getting token, we need to persist the token using `SecureStore`
            // In the example, we'll use a dummy token

            dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
        },
    };

    return (
        <AuthContext.Provider value={{ state, ...authContext }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
