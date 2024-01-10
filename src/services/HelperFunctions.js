import { encode, decode } from "base-64";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

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
