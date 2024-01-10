import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
import { styles } from "./StarReviewStyle";

const StarReviewPopup = ({ isVisible, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);

    const handleStarRating = (rating) => {
        setRating(rating);
    };

    const handleCancel = () => {
        setRating(0);
        onClose();
    };

    const handleConfirm = () => {
        onSubmit(rating);
        setRating(0);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={handleCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Rate this review</Text>

                    <Rating
                        type="star"
                        ratingCount={5}
                        jumpValue={0}
                        fractions={1}
                        onFinishRating={handleStarRating}
                        showRating
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={handleCancel}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirm}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default StarReviewPopup;
