import React from "react";
import { View, Image, Text } from "react-native";
import Swiper from "react-native-swiper";
import { styles } from "./CostumCarouselStyle";

const CostumCarouselComp = ({ images }) => {
    console.log("images", images);
    return (
        <View>
            {images.length > 0 ? (
                <Swiper style={styles.wrapper} showsButtons={true}>
                    {images.map((image, index) => (
                        <View style={styles.slide} key={index}>
                            <Image
                                source={{ uri: image }}
                                style={styles.image}
                            />
                        </View>
                    ))}
                </Swiper>
            ) : (
                <Text>No images available</Text>
            )}
        </View>
    );
};

export default CostumCarouselComp;
