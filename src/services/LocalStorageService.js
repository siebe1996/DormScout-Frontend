import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export async function setStorageItemAsync(key, value) {
    if (Platform.OS === "web") {
        try {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error("Local storage is unavailable:", e);
        }
    } else {
        if (value === null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }
}

export async function getStorageItemAsync(key) {
    if (Platform.OS === "web") {
        try {
            const value = localStorage.getItem(key);
            return value;
        } catch (e) {
            console.error("Local storage is unavailable:", e);
            return null;
        }
    } else {
        try {
            const value = await SecureStore.getItemAsync(key);
            return value;
        } catch (error) {
            console.error("SecureStore is unavailable:", error);
            return null;
        }
    }
}

export async function removeStorageItemAsync(key) {
    if (Platform.OS === "web") {
        try {
            const value = localStorage.getItem(key);
            if (value !== null) {
                localStorage.removeItem(key);
            }
            return value;
        } catch (e) {
            console.error("Local storage is unavailable:", e);
            return null;
        }
    } else {
        try {
            const value = await SecureStore.getItemAsync(key);
            if (value !== null) {
                await SecureStore.deleteItemAsync(key);
            }
            return value;
        } catch (error) {
            console.error("SecureStore is unavailable:", error);
            return null;
        }
    }
}
