# Food Delivery Checkout & Status Tracker
A React Native mobile application that provides a seamless food ordering and live delivery tracking experience, built with Expo and Firebase.

# Table of Contents
Overview

Features

Technology Stack

Project Structure

Setup and Installation

AI Tools Used

Overview
This project is a functional prototype of a modern food delivery application. It features a user-friendly checkout process and a real-time order status page with a live map for tracking the delivery. The goal was to build a robust and scalable application using modern mobile development practices, including component-based architecture and a backend-as-a-service (BaaS) platform.

Features
Multi-Step Checkout Process: A clean and intuitive interface for reviewing cart items, selecting payment methods, and placing an order.

Real-Time Order Status: After an order is placed, users are redirected to a status page that automatically updates, showing the order's progress from "Placed" to "Delivered".

Firestore Integration: All order data is persisted in a secure and scalable Firestore database.

Anonymous User Authentication: Firebase Auth is used to seamlessly manage user sessions without requiring a manual login.

⭐ Bonus: Live Delivery Tracking: A map view that simulates the delivery agent's movement from the restaurant to the user's location in real-time.

Technology Stack
Frontend: React Native (v0.79+) with Expo SDK 52

Navigation: State-based routing within App.js

Backend & Database: Firebase (Authentication, Firestore)

Mapping: react-native-maps for the live tracking feature

Styling: React Native StyleSheet

Project Structure
.
├── App.js                 # Main component with routing and state management
├── components/              # Reusable UI components
│   ├── IconCheck.js
│   └── IconMapPin.js
├── screens/                 # Application screens
│   ├── CheckoutScreen.js
│   ├── StatusScreen.js
│   └── TrackOrderScreen.js
└── README.md

Setup and Installation
Prerequisites
Node.js (v18 or newer)

npm or yarn

Expo Go app on an iOS or Android device

1. Clone the Repository
git clone <your-repository-url>
cd <repository-folder>

2. Install Dependencies
This project uses the local Expo CLI, which is the recommended approach.

# Initialize a package.json file if you haven't already
npm init -y

# Install all necessary packages with compatible versions
npx expo install react react-native react-native-svg firebase expo @react-native-async-storage/async-storage react-native-maps

3. Configure Firebase
Create a new project on the Firebase Console.

Go to Project Settings > General and create a new Web App (</>).

Copy the firebaseConfig object.

Paste your configuration into the firebaseConfig object at the top of App.js.

In the Firebase Console, go to Build > Authentication > Sign-in method and enable Anonymous sign-in.

Go to Build > Firestore Database and create a database. Start in test mode.

4. Configure package.json
Open your package.json file and add the following line to ensure Expo knows where to start your app:

"main": "node_modules/expo/AppEntry.js",

5. Run the Application
Start the development server. The --clear flag is recommended to avoid