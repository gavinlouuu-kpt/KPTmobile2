/**
 * @format
 */
import * as React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import { AuthProvider } from './src/Authentication/AuthProvider';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from "native-base";
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    databaseURL: "your-database-url",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

const Root = () => (
    <NavigationContainer>
        <NativeBaseProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </NativeBaseProvider>
    </NavigationContainer>
);

AppRegistry.registerComponent(appName, () => Root);

// AppRegistry.registerComponent(appName, () => App);
