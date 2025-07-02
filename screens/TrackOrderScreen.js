import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.12;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Mock coordinates for Bangalore
const RESTAURANT_COORDS = { latitude: 12.9279, longitude: 77.6271 }; // Koramangala
const DELIVERY_COORDS = { latitude: 12.9716, longitude: 77.5946 }; // Majestic area

/**
 * Renders the live map tracking screen. This is a "dumb" component that
 * simply displays the coordinates it receives from its parent (App.js).
 */
export default function TrackOrderScreen({
  order,
  onGoBack,
  deliveryAgentCoords,
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Animate camera to fit markers when the component loads
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([RESTAURANT_COORDS, DELIVERY_COORDS], {
        edgePadding: { top: 50, right: 50, bottom: 150, left: 50 }, // Increased bottom padding for the card
        animated: true,
      });
    }
  }, []);

  return (
    <View style={trackStyles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={trackStyles.map}
        initialRegion={{
          ...RESTAURANT_COORDS,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Polyline
          coordinates={[RESTAURANT_COORDS, DELIVERY_COORDS]}
          strokeColor="#e91e63"
          strokeWidth={4}
        />

        <Marker coordinate={RESTAURANT_COORDS} title="Restaurant">
          <View style={trackStyles.markerContainer}>
            <Text style={trackStyles.markerText}>🏠</Text>
          </View>
        </Marker>

        <Marker coordinate={DELIVERY_COORDS} title="Your Location">
          <View style={trackStyles.markerContainer}>
            <Text style={trackStyles.markerText}>📍</Text>
          </View>
        </Marker>

        {/* Only show the delivery agent if their coordinates are available */}
        {deliveryAgentCoords && (
          <Marker coordinate={deliveryAgentCoords} title="Delivery Agent">
            <View style={trackStyles.markerContainer}>
              <Text style={trackStyles.markerText}>🏍️</Text>
            </View>
          </Marker>
        )}
      </MapView>
      <View style={trackStyles.bottomCard}>
        <Text style={trackStyles.statusTitle}>Order is on the way!</Text>
        <Text style={trackStyles.statusSubText}>
          Your delivery agent is heading to your location.
        </Text>
        <TouchableOpacity style={trackStyles.backButton} onPress={onGoBack}>
          <Text style={trackStyles.backButtonText}>Back to Order Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Styles for TrackOrderScreen ---
const trackStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomCard: {
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusSubText: {
    color: "gray",
    marginBottom: 15,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#e91e63",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  markerContainer: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 20,
    borderColor: "#e91e63",
    borderWidth: 1,
  },
  markerText: {
    fontSize: 24,
  },
});
