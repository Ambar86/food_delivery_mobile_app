import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import IconMapPin from "../components/IconMapPin";
import IconCheck from "../components/IconCheck";

/**
 * Renders the checkout page where users can review their order and place it.
 */
export default function CheckoutScreen({ onPlaceOrder }) {
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const cart = {
    items: [
      {
        id: 1,
        name: "Hakka Noodles",
        bistro: "Barman's Bistro",
        price: 220,
        quantity: 1,
      },
      {
        id: 2,
        name: "Chicken Fried Rice",
        bistro: "Barman's Bistro",
        price: 280,
        quantity: 1,
      },
    ],
    subtotal: 500.0,
    deliveryFee: 50.0,
    tax: 40.0,
    total: 590.0,
  };

  const handlePlaceOrderClick = () => {
    const orderData = {
      ...cart,
      deliveryAddress: "123 MG Road, Bangalore, Karnataka 560001",
      paymentMethod,
      status: "Order Placed",
      createdAt: new Date().toISOString(),
    };
    onPlaceOrder(orderData);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Checkout</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.card}>
          <View style={styles.addressContainer}>
            <IconMapPin />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.addressText}>
                123 MG Road, Bangalore, Karnataka 560001
              </Text>
              <Text style={styles.addressSubText}>Default Address</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={styles.card}>
          {cart.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemContainer,
                index < cart.items.length - 1 && styles.itemDivider,
              ]}
            >
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBistro}>{item.bistro}</Text>
                <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity>
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity>
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Instructions</Text>
        <TextInput
          style={styles.input}
          placeholder="Add delivery notes (optional)"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          onPress={() => setPaymentMethod("UPI")}
          style={[
            styles.card,
            styles.paymentOption,
            paymentMethod === "UPI" && styles.selectedPayment,
          ]}
        >
          <View>
            <Text style={styles.paymentTitle}>UPI Payment</Text>
            <Text style={styles.paymentSubText}>Pay using UPI apps</Text>
          </View>
          <View
            style={[
              styles.radioCircle,
              paymentMethod === "UPI" && styles.selectedRadio,
            ]}
          >
            {paymentMethod === "UPI" && <IconCheck />}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPaymentMethod("COD")}
          style={[
            styles.card,
            styles.paymentOption,
            paymentMethod === "COD" && styles.selectedPayment,
          ]}
        >
          <View>
            <Text style={styles.paymentTitle}>Cash on Delivery</Text>
            <Text style={styles.paymentSubText}>Pay with cash</Text>
          </View>
          <View
            style={[
              styles.radioCircle,
              paymentMethod === "COD" && styles.selectedRadio,
            ]}
          >
            {paymentMethod === "COD" && <IconCheck />}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>₹{cart.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Delivery Fee</Text>
            <Text>₹{cart.deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Tax</Text>
            <Text>₹{cart.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>₹{cart.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={handlePlaceOrderClick}
      >
        <Text style={styles.placeOrderText}>
          Place Order • ₹{cart.total.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- Styles for CheckoutScreen ---
const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", backgroundColor: "#f8f9fa" },
  contentContainer: { padding: 15, paddingBottom: 30 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#343a40",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressText: { fontWeight: "bold", color: "#212529" },
  addressSubText: { color: "gray" },
  changeText: { color: "#e91e63", fontWeight: "bold" },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  itemDivider: { borderBottomWidth: 1, borderBottomColor: "#f1f3f5" },
  itemName: { fontWeight: "bold", color: "#212529" },
  itemBistro: { color: "gray" },
  itemPrice: { color: "#e91e63", fontWeight: "bold" },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    fontSize: 22,
    color: "#e91e63",
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  quantity: { fontSize: 18, fontWeight: "bold" },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPayment: { borderColor: "#e91e63" },
  paymentTitle: { fontWeight: "bold" },
  paymentSubText: { color: "gray" },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#adb5bd",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: { backgroundColor: "#e91e63", borderColor: "#e91e63" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  divider: { height: 1, backgroundColor: "#e9ecef", marginVertical: 10 },
  totalText: { fontWeight: "bold", fontSize: 16 },
  placeOrderButton: {
    backgroundColor: "#e91e63",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#e91e63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  placeOrderText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
