import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBIxqhIgRIP2VIDtRuwka3t009g7RccdDg",
  authDomain: "huz360.firebaseapp.com",
  projectId: "huz360",
  storageBucket: "huz360.appspot.com",
  messagingSenderId: "193056801857",
  appId: "1:193056801857:web:f178787de37c0d09fd32c0",
  measurementId: "G-23KR9HG185",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (setTokenFound) => {
  try {
    const status = await Notification.requestPermission();
    if (status && status === "granted") {
      const currentToken = await getToken(messaging, {
        vapidKey: "BHnSNZId1KqRNghd0HfevowbhkfYQk0Q0FGCoC7RS2kF-2BxULfg7wd2t-eidiQHOLPeEZXPtpeBSfFUghEvsIg",
      });
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        localStorage.setItem("firebase_Token", currentToken); // Store token in localStorage
        if (setTokenFound) setTokenFound(true);
      } else {
        console.log("No registration token available. Request permission to generate one.");
        if (setTokenFound) setTokenFound(false);
      }
    } else {
      console.log("Notification permission not granted or blocked.");
      if (setTokenFound) setTokenFound(false);
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
