import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import IconCheck from "../components/IconCheck";
import IconMapPin from "../components/IconMapPin";

/**
 * Renders the order status timeline and simulates backend updates.
 */
export default function StatusScreen({
  order,
  onGoHome,
  onTrackOrder,
  userId,
  db,
  appId,
}) {
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const statuses = [
    "Order Placed",
    "Preparing",
    "Picked by Delivery Partner",
    "On the Way",
    "Delivered",
  ];
  const statusDescriptions = {
    "Order Placed": "Your order has been placed successfully",
    Preparing: "The restaurant is preparing your delicious meal",
    "Picked by Delivery Partner": "Your order has been picked up",
    "On the Way": "Your order is being delivered to you",
    Delivered: "Enjoy your meal!",
  };

  useEffect(() => {
    setCurrentStatus(order.status);
  }, [order.status]);

  // This effect simulates a backend process updating the order status in Firestore.
  useEffect(() => {
    const currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex < statuses.length - 1) {
      const timer = setTimeout(async () => {
        const newStatus = statuses[currentIndex + 1];
        try {
          const orderRef = doc(
            db,
            `artifacts/${appId}/users/${userId}/orders`,
            order.id
          );
          await updateDoc(orderRef, { status: newStatus });
        } catch (error) {
          console.error("Error updating order status:", error);
        }
      }, 10000); // Update every 10 seconds
      return () => clearTimeout(timer);
    }
  }, [currentStatus, order.id, userId, db, appId]);

  const currentStatusIndex = statuses.indexOf(currentStatus);

  return (
    <ScrollView
      style={statusStyles.container}
      contentContainerStyle={statusStyles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={statusStyles.successContainer}>
        <View style={statusStyles.successIcon}>
          <IconCheck />
        </View>
        <Text style={statusStyles.successTitle}>
          Order Placed Successfully!
        </Text>
        <Text style={statusStyles.successSubText}>
          Your order #{order.id.substring(0, 8)} has been confirmed
        </Text>
      </View>

      <View style={statusStyles.section}>
        <View style={statusStyles.orderSummary}>
          <Text style={statusStyles.orderId}>
            Order #{order.id.substring(0, 8)}
          </Text>
          <Text style={statusStyles.orderTotal}>₹{order.total.toFixed(2)}</Text>
        </View>
        <Text style={statusStyles.deliveryTime}>
          Estimated delivery: 25-35 min
        </Text>
      </View>

      <View style={statusStyles.section}>
        <Text style={statusStyles.sectionTitle}>Order Timeline</Text>
        <View>
          {statuses.map((status, index) => (
            <View key={status} style={statusStyles.statusItem}>
              <View style={statusStyles.timelineContainer}>
                <View
                  style={[
                    statusStyles.statusCircle,
                    index <= currentStatusIndex &&
                      statusStyles.activeStatusCircle,
                  ]}
                >
                  {index <= currentStatusIndex && <IconCheck />}
                </View>
                {index < statuses.length - 1 && (
                  <View
                    style={[
                      statusStyles.timelineLine,
                      index < currentStatusIndex &&
                        statusStyles.activeTimelineLine,
                    ]}
                  />
                )}
              </View>
              <View style={statusStyles.statusDetails}>
                <Text
                  style={[
                    statusStyles.statusText,
                    index <= currentStatusIndex &&
                      statusStyles.activeStatusText,
                  ]}
                >
                  {status}
                </Text>
                <Text style={statusStyles.statusDescription}>
                  {statusDescriptions[status]}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={statusStyles.section}>
        <Text style={statusStyles.sectionTitle}>Order Items</Text>
        <View style={statusStyles.card}>
          {order.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                statusStyles.itemRow,
                index < order.items.length - 1 && statusStyles.itemDivider,
              ]}
            >
              <Text>
                {item.quantity}x {item.name}
              </Text>
              <Text>₹{item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={statusStyles.section}>
        <Text style={statusStyles.sectionTitle}>Delivery Information</Text>
        <View
          style={[
            statusStyles.card,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <IconMapPin />
          <Text style={{ marginLeft: 10 }}>{order.deliveryAddress}</Text>
        </View>
      </View>

      <View style={statusStyles.buttonContainer}>
        <TouchableOpacity
          style={statusStyles.secondaryButton}
          onPress={onGoHome}
        >
          <Text style={statusStyles.secondaryButtonText}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={statusStyles.primaryButton}
          onPress={onTrackOrder}
        >
          <Text style={statusStyles.primaryButtonText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// --- Styles for StatusScreen ---
const statusStyles = StyleSheet.create({
  container: { flex: 1, width: "100%", backgroundColor: "#f8f9fa" },
  contentContainer: { padding: 15, paddingBottom: 30 },
  successContainer: { alignItems: "center", marginBottom: 20 },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  successTitle: { fontSize: 22, fontWeight: "bold", color: "#28a745" },
  successSubText: { color: "gray" },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#343a40",
  },
  card: { backgroundColor: "white", borderRadius: 10, padding: 15 },
  orderSummary: { flexDirection: "row", justifyContent: "space-between" },
  orderId: { fontSize: 16, fontWeight: "bold" },
  orderTotal: { fontSize: 16, fontWeight: "bold", color: "#e91e63" },
  deliveryTime: { color: "gray" },
  statusItem: { flexDirection: "row", alignItems: "flex-start" },
  timelineContainer: { alignItems: "center" },
  timelineLine: { width: 2, height: 40, backgroundColor: "#dee2e6" },
  activeTimelineLine: { backgroundColor: "#28a745" },
  statusCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ced4da",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  activeStatusCircle: { backgroundColor: "#28a745" },
  statusDetails: { marginLeft: 15, flex: 1 },
  statusText: { fontWeight: "bold", color: "gray" },
  activeStatusText: { color: "black" },
  statusDescription: { color: "gray" },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  itemDivider: { borderBottomWidth: 1, borderBottomColor: "#f1f3f5" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  primaryButton: {
    flex: 1,
    backgroundColor: "#e91e63",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 5,
  },
  primaryButtonText: { color: "white", fontWeight: "bold" },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e91e63",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 5,
  },
  secondaryButtonText: { color: "#e91e63", fontWeight: "bold" },
});
