import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CostumButtonComp from "../../components/costumbuttoncomp/CostumButtonComp";
import { styles } from "./AddPlaceStyle";

const AddPlaceScreen = () => {
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [telephoneNumber, setTelephoneNumber] = useState("");
    const [link, setLink] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dates, setDates] = useState([new Date(Date.now())]);
    const [notes, setNotes] = useState([""]);

    useEffect(() => {
        console.log("7", dates);
    }, [dates]);

    const handleDateChange = (event, date, index) => {
        console.log("1 " + date);
        console.log("2 " + index);
        console.log("3 " + dates);
        if (Platform.OS === "android") {
            setShowDatePicker(false);
        }
        if (date) {
            const updatedDates = [...dates];
            console.log("4 " + updatedDates);
            updatedDates[index] = date;
            console.log("5 " + updatedDates);
            setDates([...updatedDates]);
            console.log("6 " + dates);
        }
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
        //setSelectedDate(dates[index].date);
    };

    const handleAddDate = () => {
        setDates([...dates, new Date(Date.now())]);
        setShowDatePicker(false); // Close the date picker after adding a date
    };

    const handleAddNote = () => {
        setNotes([...notes, ""]);
    };

    return (
        <ScrollView style={{ padding: 16 }}>
            <Text>Address:</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={(text) => setAddress(text)}
                placeholder="homestreet 1 homecity"
            />

            <Text>Email Houseowner:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                placeholder="johndoe@example.com"
            />

            <Text>Telephone Number Houseowner:</Text>
            <TextInput
                style={styles.input}
                value={telephoneNumber}
                onChangeText={(text) => setTelephoneNumber(text)}
                keyboardType="phone-pad" // Use phone-pad for telephone number
            />

            <Text>Link Add:</Text>
            <TextInput
                style={styles.input}
                value={link}
                onChangeText={(text) => setLink(text)}
                placeholder="https://example.com"
                keyboardType="url" // Use url keyboard type for links
            />

            <Text>Available Dates:</Text>
            {dates.map((item, index) => (
                <View key={index}>
                    <TouchableOpacity onPress={showDatepicker}>
                        <Text style={styles.input}>
                            {new Date(item).toUTCString()}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={item}
                            mode="date"
                            display={
                                Platform.OS === "ios" ? "spinner" : "default"
                            }
                            is24Hour={true}
                            onChange={(event, date) =>
                                handleDateChange(event, date, index)
                            }
                        />
                    )}
                </View>
            ))}
            <TouchableOpacity onPress={handleAddDate}>
                <Text style={styles.add}>Add Date</Text>
            </TouchableOpacity>

            <Text>Extra Notes:</Text>
            {notes.map((note, index) => (
                <TextInput
                    key={index}
                    style={styles.input}
                    value={note}
                    onChangeText={(text) => {
                        const updatedNotes = [...notes];
                        updatedNotes[index] = text;
                        setNotes(updatedNotes);
                    }}
                />
            ))}
            <TouchableOpacity onPress={handleAddNote}>
                <Text style={styles.add}>Add Note</Text>
            </TouchableOpacity>

            <CostumButtonComp
                onPress={() => {
                    // Handle form submission
                    console.log({
                        address,
                        email,
                        telephoneNumber,
                        link,
                        dates,
                        notes,
                    });
                }}
                text="Submit"
            />
        </ScrollView>
    );
};

export default AddPlaceScreen;
