import React, { useState, useEffect } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useAuth } from "../../contexts/AuthContext";
import { STRIPE_KEY } from "../../constants";

import CheckoutScreen from "../checkoutscreen/CheckoutScreen";

const TestStripeScreen = () => {
    return (
        <StripeProvider
            publishableKey={STRIPE_KEY}
            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
        >
            <CheckoutScreen />
        </StripeProvider>
    );
};

export default TestStripeScreen;
