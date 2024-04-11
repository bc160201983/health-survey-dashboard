import db from "@/app/lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Expo } from "expo-server-sdk";
import { sendPushNotification } from "@/app/lib/sendPushNotification";
import { v4 as uuidv4 } from "uuid";

// Initialize Expo SDK client
const expo = new Expo();

export async function POST(request) {
  // Extract necessary data from the request body
  let token;
  const { deviceUUID, surveyId } = await request.json();

  try {
    const TokenNotiRef = doc(db, "notificationToken", deviceUUID);
    const docSnap = await getDoc(TokenNotiRef);
    if (docSnap.exists()) {
      token = docSnap.data().token;
    } else {
      console.log("No such document!");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Document not found for deviceUUID",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Push token not found for device",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Construct the notification message
    const notification = {
      to: token,
      sound: "default",
      title: "Survey Reminder",
      body: "You have pending surveys to complete.",
      surveyId: surveyId,
      data: { type: "surveyReminder" }, // Optional data to include with the notification
    };

    // Send the notification using Expo HTTP/2 API
    const response = await sendPushNotification(notification);

    // Handle the response
    if (response.data && response.data.status === "ok") {
      await updateDoc(TokenNotiRef, {
        notifications: arrayUnion({
          notificationId: uuidv4(),
          title: notification.title,
          body: notification.body,
          surveyId: surveyId,
          seen: false,
          timestamp: new Date().toISOString(),
        }),
      });
      return new Response(
        JSON.stringify({
          success: true,
          message: "Notification sent successfully",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      throw new Error("Failed to send push notification");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send notification" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
