import React, { useState, useEffect } from "react";
import { View, Text, Button, Image } from "react-native";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import { getStorageItemAsync } from "../../services/LocalStorageService";
import { Rating } from "react-native-ratings";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchUserMe, putUser } from "../../services/ApiService";
import {
    convertBase64ToImage,
    convertImageToBase64,
} from "../../services/HelperFunctions";
import ConfirmationPopup from "../../components/confirmationpopup/ConfirmationPopup";

const AccountScreen = ({ route }) => {
    const { state } = useAuth();
    const { signOut } = React.useContext(AuthContext);
    const [user, setUser] = useState("");
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [showChoice, setShowChoice] = useState(false);
    const [update, setUpdate] = useState(false);
    //toDo check strip for payment system
    /*useEffect(() => {
        getUser();
    }, []);*/

    useEffect(() => {
        if (update) {
            retryPutUser();
        }
    }, [update]);

    useEffect(() => {
        setSelectedImage(user.imageData);
    }, [user]);

    useFocusEffect(
        React.useCallback(() => {
            console.log("hier focus");
            getUserOffline();
            setUpdate(false);
        }, [])
    );
    /*useFocusEffect(() => {
            getUserOffline();
        }, [])
    ;*/

    /*useEffect(() => {
        if (user.imageData != null) {
            convertBase64ToImageAsync();
        }
    }, [user]);*/

    const getUserOffline = async () => {
        const userStorage = await getStorageItemAsync("user");
        //setSelectedImage(userStorage.imageData);
        console.log("userStorage", userStorage);
        const userOff = JSON.parse(userStorage);
        setUser(userOff);
        const isEqual = await checkUserOffAndOnEqual(userOff);
        if (!isEqual) {
            console.log("should update");
            setUpdate(true);
        }
    };

    const checkUserOffAndOnEqual = async (userOff) => {
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

    const retryPutUser = async () => {
        let base64Image = null;
        try {
            if (selectedImage) {
                base64Image = await convertImageToBase64(selectedImage);
            }
            try {
                const userData = {
                    userName: user.userName,
                    dateOfBirth: user.dateOfBirth,
                    imageData: base64Image,
                };
                const jsonUserData = JSON.stringify(userData);
                //console.log("userData", userData);
                console.log("user.id", user.id);
                console.log("user.userName", user.userName);
                await putUser(state.userToken, user.id, jsonUserData);
            } catch (e) {
                console.error("Error putting user:", e);
            }
        } catch (error) {
            console.error("Error encoding image to base64:", error);
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

    const handleSignOut = async () => {
        const isEqual = await checkUserOffAndOnEqual(user);
        if (isEqual) {
            signOut();
        } else {
            setShowChoice(true);
        }
    };

    const handleResetPassword = async () => {};

    const navigateToEditAccount = async () => {
        navigation.navigate("Edit Account", {
            user: user,
        });
    };

    const navigateToTestStripe = async () => {
        navigation.navigate("Test");
    };

    return (
        <View>
            <Image
                source={{
                    uri: selectedImage
                        ? selectedImage
                        : "../../data/images/anonymous-person.jpg",
                }}
                style={{ width: 100, height: 100, margin: 5 }}
            />
            <View>
                <Text>{user.userName}</Text>
                <Text>
                    {user.firstName} {user.lastName}
                </Text>
                <Text>{user.email}</Text>
            </View>
            {/*<CostumButtonComp
                onPress={handleResetPassword}
                text="reset password"
            />*/}
            <CostumButtonComp
                onPress={navigateToEditAccount}
                text="edit account"
            />

            <View style={{ backgroundColor: "white" }}>
                <Rating
                    type="star"
                    ratingCount={5}
                    startingValue={user.score}
                    jumpValue={0}
                    fractions={1}
                    ratingColor="blue"
                    ratingBackgroundColor="#000000"
                    readonly
                    showRating={false}
                />
            </View>
            <CostumButtonComp onPress={handleSignOut} text="logout" />
            <CostumButtonComp onPress={navigateToTestStripe} text="Test" />
            {showChoice && (
                <ConfirmationPopup
                    title="Confirmation"
                    message="Changes are not saved. Do you want to continue?"
                    onCancel={() => setShowChoice(false)}
                    onConfirm={async () => {
                        await signOut();
                        setShowChoice(false);
                    }}
                />
            )}
        </View>
    );
};

export default AccountScreen;
