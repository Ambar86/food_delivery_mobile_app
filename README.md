Food Delivery Checkout & Status Tracker
A complete React Native mobile application that provides a seamless food ordering and live delivery tracking experience, built with Expo and Firebase.

Table of Contents
Overview

Features

Technology Stack

Project Structure

Setup and Installation Guide

AI Tools Used

Overview
This project is a functional prototype of a modern food delivery application, built from the ground up. It features a user-friendly multi-step checkout process and a real-time order status page that includes a live map for tracking the delivery agent. The application is built using a robust and scalable architecture with React Native for the frontend and Firebase for backend services, demonstrating a complete end-to-end user flow.

Features
Multi-Step Checkout Process: A clean and intuitive interface for reviewing cart items, selecting mock payment methods (UPI, COD), and placing an order.

Real-Time Order Status: After an order is placed, users are redirected to a status page that automatically updates every 10 seconds, showing the order's progress from "Placed" to "Delivered".

Firestore Integration: All order data is persisted in a secure and scalable Firestore database, with real-time listeners updating the UI instantly.

Anonymous User Authentication: Firebase Auth is used to seamlessly manage user sessions without requiring a manual login, with auth state persisted across app sessions.

⭐ Bonus: Live Delivery Tracking: A map view that simulates the delivery agent's movement from the restaurant to the user's location in real-time. The agent's position is managed globally to ensure it doesn't reset when navigating between screens.

Technology Stack
Frontend: React Native with Expo

Backend & Database: Firebase (Authentication, Firestore)

Mapping: react-native-maps for the live tracking feature

Styling: React Native StyleSheet for a clean, cross-platform UI

Build & Deployment: Expo Application Services (EAS) for creating development builds

Project Structure
.
├── App.js                 # Main component with routing and state management
├── app.json               # Expo app configuration (including API key)
├── .env                   # Environment variables (for API key)
├── .gitignore             # Files to be ignored by Git
├── components/              # Reusable UI components
│   ├── IconCheck.js
│   └── IconMapPin.js
├── screens/                 # Application screens
│   ├── CheckoutScreen.js
│   ├── StatusScreen.js
│   └── TrackOrderScreen.js
└── README.md

Setup and Installation Guide
Follow these steps carefully to get the project running on your local machine.

Prerequisites
Node.js (v18 or newer)

npm or yarn

Expo Go app on an iOS or Android device

Step 1: Clone the Repository
git clone <your-repository-url>
cd <repository-folder>

Step 2: Install Dependencies
This project uses the local Expo CLI, which is the recommended approach.

# Initialize a package.json file if you haven't already
npm init -y

# Install all necessary packages with compatible versions
npx expo install react react-native react-native-svg firebase expo @react-native-async-storage/async-storage react-native-maps

Step 3: Configure Firebase
Create a new project on the Firebase Console.

In Project Settings, create a new Web App (</>).

Copy the firebaseConfig object and paste it into the firebaseConfig constant at the top of App.js.

In the Firebase Console, go to Build > Authentication > Sign-in method and enable Anonymous sign-in.

Go to Build > Firestore Database and create a database. Start in test mode.

Step 4: Securely Configure Google Maps API Key
It is critical to protect your API key. Do not commit it directly to your code.

Get an API Key: Follow the Google Maps Platform documentation to enable the Maps SDK for Android and create an API key.

Create a .env file in the root of your project and add your key:

# .env
GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"

Add .env to .gitignore: Create a .gitignore file if it doesn't exist and add the following line to it:

.env

Configure app.json: Create an app.json file in your root directory. This file tells Expo how to configure your native app, including how to use the API key from your .env file.

{
  "expo": {
    "name": "assignment",
    "slug": "assignment",
    "version": "1.0.0",
    "android": {
      "package": "com.yourname.assignment",
      "config": {
        "googleMaps": {
          "apiKey": "${GOOGLE_MAPS_API_KEY}"
        }
      }
    }
  }
}

Set EAS Secret (for builds): When you build your app for sharing, the build server needs to know your secret key. Run this command in your terminal:

eas secret:create --name GOOGLE_MAPS_API_KEY --value YOUR_API_KEY_HERE

Step 5: Run the Application
Start the development server. The --clear flag is recommended to avoid caching issues.

npx expo start --clear

Scan the QR code with the Expo Go app on your mobile device to see the app in action.

AI Tools Used
Gemini: Utilized for initial code generation, component structuring, debugging complex state management and asynchronous issues (especially with Firebase and animation logic), and providing step-by-step setup and deployment guidance.
