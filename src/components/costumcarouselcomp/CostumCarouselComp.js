import React from "react";
import { View, Image, Text } from "react-native";
import Swiper from "react-native-swiper";
import { costumCarouselStyle } from "./CostumCarouselStyle";

const CostumCarouselComp = ({ images }) => {
    console.log("images", images);
    return (
        <View>
            {images.length > 0 ? (
                <Swiper style={costumCarouselStyle.wrapper} showsButtons={true}>
                    {images.map((image, index) => (
                        <View style={costumCarouselStyle.slide} key={index}>
                            <Image
                                source={{ uri: image }}
                                style={costumCarouselStyle.image}
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
