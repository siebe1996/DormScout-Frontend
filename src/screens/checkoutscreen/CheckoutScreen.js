import { postPaymentIntent } from "../../services/ApiService";
import {
    CardField,
    useStripe,
    useConfirmPayment,
} from "@stripe/stripe-react-native";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    FlatList,
    Button,
    SectionList,
    Image,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function CheckoutScreen() {
    const { state } = useAuth();
    const { confirmPayment, loading } = useConfirmPayment();
    const { card, handleCardChange, postalCode } = useStripe();

    const fetchPaymentIntentClientSecret = async () => {
        /*const response = await fetch(`${API_URL}/create-payment-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currency: "usd",
            }),
        });*/
        console.log("hier");
        const response = await postPaymentIntent(
            state.userToken,
            JSON.stringify({
                items: [{ id: "de305d54-75b4-431b-adb2-eb6b9e546014" }],
            })
        );
        const responseJson = await response;
        console.log("responseJson", responseJson);
        const { clientSecret } = responseJson;
        console.log("clientSecret:", clientSecret);

        return clientSecret;
    };

    const handlePayPress = async () => {
        console.log("Card:", card);
        /*if (!card) {
            console.log("hier niet");
            return;
        }*/

        const billingDetails = {
            email: "jenny.rosen@example.com",
        };

        // Fetch the intent client secret from the backend.
        const clientSecret = await fetchPaymentIntentClientSecret();

        const { paymentIntent, error } = await confirmPayment(clientSecret, {
            paymentMethodType: "Card",
            paymentMethodData: {
                billingDetails,
            },
        });

        if (error) {
            console.log("Payment confirmation error", error);
        } else if (paymentIntent) {
            console.log("Success from promise", paymentIntent);
        }
    };

    return (
        <View>
            <CardField
                postalCodeEnabled={true}
                placeholders={{
                    number: "4242 4242 4242 4242",
                }}
                cardStyle={{
                    backgroundColor: "#FFFFFF",
                    textColor: "#000000",
                }}
                style={{
                    width: "100%",
                    height: 50,
                    marginVertical: 30,
                }}
                onCardChange={(cardDetails) => {
                    console.log("cardDetails", cardDetails);
                    //handleCardChange(cardDetails);
                }}
                onFocus={(focusedField) => {
                    console.log("focusField", focusedField);
                }}
            />
            <Button onPress={handlePayPress} title="Pay" disabled={loading} />
        </View>
    );
}
