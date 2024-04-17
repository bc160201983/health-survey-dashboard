// Import the necessary functions from Firebase

import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "./firebase";

export const sendPushNotification = async (message) => {
  const url = "https://exp.host/--/api/v2/push/send?useFcmV1=true";
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    "accept-encoding": "gzip, deflate",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error("Failed to send push notification");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};

export async function getAllNotificationTokens() {
  try {
    const notificationTokenCollection = collection(db, "notificationToken");
    const snapshot = await getDocs(notificationTokenCollection);

    const tokens = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.token) {
        tokens.push(data.token);
      }
    });

    return tokens;
  } catch (error) {
    console.error("Error fetching notification tokens:", error);
    throw error;
  }
}

async function sendNotificationToToken(token, notification) {
  try {
    await messaging.send({
      token,
      notification,
    });

    console.log("Notification sent successfully to token:", token);
  } catch (error) {
    console.error("Error sending notification to token:", token, error);
    throw error;
  }
}

export const sendPushNotificationToAllUser = async () => {
  const token = await getAllNotificationTokens();
  console.log(token);
  const message = {
    to: token,
    sound: "default",
    title: "New Survey Available",
    body: "A new survey is now available for you to complete.",
  };
  const url = "https://exp.host/--/api/v2/push/send?useFcmV1=true";
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    "accept-encoding": "gzip, deflate",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error("Failed to send push notification");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};

export async function updateNotificationToken(tokenId, notification) {
  try {
    const tokenQuery = query(
      collection(db, "notificationToken"),
      where("token", "==", tokenId)
    );

    const tokenSnapshot = await getDocs(tokenQuery);

    if (!tokenSnapshot.empty) {
      // Assuming there's only one document per token
      const tokenDoc = tokenSnapshot.docs[0].id;
      const tokenRef = doc(db, "notificationToken", tokenDoc);

      await updateDoc(tokenRef, {
        notifications: arrayUnion(notification),
      });

      console.log(`Notification added to token ${tokenId} successfully`);
    } else {
      console.log(`No token found for token ${tokenId}`);
    }
  } catch (error) {
    console.error(`Error adding notification to token ${tokenId}:`, error);
    throw error;
  }
}
