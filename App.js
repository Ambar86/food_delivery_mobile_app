import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  setLogLevel,
} from "firebase/firestore";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Import screen components
import CheckoutScreen from "./screens/CheckoutScreen";
import StatusScreen from "./screens/StatusScreen";
import TrackOrderScreen from "./screens/TrackOrderScreen";

// --- Constants ---
const RESTAURANT_COORDS = { latitude: 12.9279, longitude: 77.6271 }; // Koramangala
const DELIVERY_COORDS = { latitude: 12.9716, longitude: 77.5946 }; // Majestic

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyCbjAsJYyLBRIietVOiEmBmJIZpbQEBSYA",
  authDomain: "assignment-d593e.firebaseapp.com",
  projectId: "assignment-d593e",
  storageBucket: "assignment-d593e.appspot.com",
  messagingSenderId: "611323829408",
  appId: "1:611323829408:web:606d2a5ce8a17c1b087dc5",
  measurementId: "G-ZC33KL6KQV",
};

// --- Firebase Initialization ---
// This robust logic prevents re-initialization errors during development hot-reloads.
let app;
let auth;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } else {
    app = getApp();
    auth = getAuth(app);
  }
} catch (error) {
  console.error("Firebase Initialization Failed", error);
}
const db = getFirestore(app);
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

/**
 * The main App component that controls the entire application's state and navigation.
 */
export default function App() {
  // State for navigation and data
  const [page, setPage] = useState("checkout"); // 'checkout', 'status', or 'track'
  const [order, setOrder] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState(null);

  // State for the delivery agent's position
  const [deliveryAgentCoords, setDeliveryAgentCoords] = useState(null);

  // Refs to hold the animation interval and the agent's current position across re-renders
  const intervalRef = useRef(null);
  const agentPositionRef = useRef(null);

  // --- Effect for Handling Delivery Agent Animation ---
  useEffect(() => {
    // Determine if the animation should be running based on the order status.
    const isOrderActiveForAnimation =
      order &&
      (order.status === "On the Way" ||
        order.status === "Picked by Delivery Partner");

    if (isOrderActiveForAnimation) {
      // Start the animation interval ONLY if it's not already running.
      // This is the key to preventing the animation from resetting on every re-render.
      if (!intervalRef.current) {
        // If there's no saved position, this is a new animation. Start from the restaurant.
        if (!agentPositionRef.current) {
          agentPositionRef.current = RESTAURANT_COORDS;
        }
        // Sync the visible state with the ref state.
        setDeliveryAgentCoords(agentPositionRef.current);

        intervalRef.current = setInterval(() => {
          // Use a functional update to get the latest coordinates, avoiding stale state.
          setDeliveryAgentCoords((prevCoords) => {
            const currentPos = prevCoords || RESTAURANT_COORDS;
            const latStep =
              (DELIVERY_COORDS.latitude - RESTAURANT_COORDS.latitude) / 100;
            const lngStep =
              (DELIVERY_COORDS.longitude - RESTAURANT_COORDS.longitude) / 100;

            // Check if the agent is very close to the destination.
            if (
              Math.abs(currentPos.latitude - DELIVERY_COORDS.latitude) <
              Math.abs(latStep)
            ) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              agentPositionRef.current = DELIVERY_COORDS;
              return DELIVERY_COORDS;
            }

            // Calculate the new position and update the ref.
            const newPosition = {
              latitude: currentPos.latitude + latStep,
              longitude: currentPos.longitude + lngStep,
            };
            agentPositionRef.current = newPosition;
            return newPosition;
          });
        }, 1000); // Update every second
      }
    } else {
      // If the order status is not one that should animate, stop the interval.
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Reset the agent's position if the order is completed or cancelled.
      if (!order || order.status === "Delivered") {
        agentPositionRef.current = null;
        setDeliveryAgentCoords(null);
      }
    }

    // Cleanup function for when the component unmounts.
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [order]); // This effect correctly re-runs only when the order object changes.

  // --- Effect for Handling User Authentication ---
  useEffect(() => {
    if (!auth) {
      setError("Firebase Auth failed to initialize.");
      setAuthReady(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        signInAnonymously(auth).catch((authError) => {
          setError(`Authentication failed: ${authError.message}`);
        });
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // --- Event Handlers ---
  const handlePlaceOrder = async (orderData) => {
    if (!userId) {
      setError("You must be signed in to place an order.");
      return;
    }
    try {
      const collectionPath = `artifacts/${appId}/users/${userId}/orders`;
      const docRef = await addDoc(collection(db, collectionPath), {
        ...orderData,
        userId,
      });
      const docPath = `artifacts/${appId}/users/${userId}/orders/${docRef.id}`;
      onSnapshot(doc(db, docPath), (doc) => {
        if (doc.exists()) setOrder({ id: doc.id, ...doc.data() });
        else setError("Could not find the order after placing it.");
      });
      setPage("status");
    } catch (e) {
      setError(`Error placing order: ${e.message}`);
    }
  };

  const handleGoHome = () => {
    setOrder(null);
    setPage("checkout");
    setError(null);
  };

  const handleTrackOrder = () => setPage("track");
  const handleGoBackToStatus = () => setPage("status");

  // --- Render Logic ---
  if (!authReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text>Authenticating...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleGoHome}>
          <Text style={styles.tryAgain}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderContent = () => {
    switch (page) {
      case "checkout":
        return <CheckoutScreen onPlaceOrder={handlePlaceOrder} />;
      case "status":
        return (
          order && (
            <StatusScreen
              order={order}
              onGoHome={handleGoHome}
              onTrackOrder={handleTrackOrder}
              userId={userId}
              db={db}
              appId={appId}
            />
          )
        );
      case "track":
        return (
          order && (
            <TrackOrderScreen
              order={order}
              onGoBack={handleGoBackToStatus}
              deliveryAgentCoords={deliveryAgentCoords}
            />
          )
        );
      default:
        return <CheckoutScreen onPlaceOrder={handlePlaceOrder} />;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  tryAgain: { color: "#007bff", fontSize: 16, marginTop: 10 },
});
