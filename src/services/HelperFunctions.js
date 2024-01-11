import { encode, decode } from "base-64";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const convertImageToBase64 = async (imageUrl) => {
    try {
        const imageContent = await FileSystem.readAsStringAsync(imageUrl, {
            encoding: FileSystem.EncodingType.Base64,
        });

        return imageContent;
    } catch (error) {
        console.error(`Error fetching image ${imageUrl}: ${error.message}`);
        return null;
    }
};

export const convertImagesToBase64 = async (imageUrls) => {
    const imagePromises = imageUrls.map((imageUrl) =>
        convertImageToBase64(imageUrl)
    );
    return Promise.all(imagePromises);
};

export const convertBase64ToImage = async (base64String) => {
    const fileName = generateRandomFileName();
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;

    try {
        await FileSystem.writeAsStringAsync(filePath, base64String, {
            encoding: FileSystem.EncodingType.Base64,
        });
        console.log("filePath", filePath);
        return filePath;
    } catch (error) {
        console.error("Error writing file:", error);
        return null;
    }
};

export const convertBase64ArrayToImages = async (base64Array) => {
    const imagePromises = base64Array.map((base64String) =>
        convertBase64ToImage(base64String.imageData)
    );
    return Promise.all(imagePromises);
};

export const generateRandomFileName = () => {
    const randomString = Math.random().toString(36).substring(7);
    return `image_${randomString}.jpg`;
};

export const returnResultImagePicker = () => {
    return new Promise(async (resolve, reject) => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            console.log("Permission to access media library was denied");
            reject("Permission denied");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3], // You can adjust the aspect ratio as needed.
        });

        if (!result.canceled) {
            //console.log("result", result);
            resolve(result.assets[0].uri);
        } else {
            reject("Image selection cancelled");
        }
    });
};

export const checkUserOffAndOnEqual = async (userOff) => {
    try {
        const userOn = await getUser();
        const userOnDate = new Date(userOn.updatedAt);
        const userOffDate = new Date(userOff.updatedAt);
        const timeDifference = Math.abs(
            userOnDate.getTime() - userOffDate.getTime()
        );
        console.log("userOn.up", userOn.updatedAt);
        console.log("userOff.up", userOff.updatedAt);
        const isWithin3Seconds = timeDifference <= 5000;
        console.log("timeDifference", timeDifference);

        return isWithin3Seconds;
    } catch (e) {
        console.error("Error fetching user:", e);
        return true;
    }
};

const getUser = async () => {
    try {
        const response = await fetchUserMe(state.userToken);
        return response;
    } catch (err) {
        console.error("Error fetching yourself:", err);
    }
};

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

export const showAlertOffline = () => {
    Alert.alert(
        "You are offline",
        "If you are offline your not able to edit and data present might not be accurate"
    );
};
