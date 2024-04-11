import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "../../health-app-3d491-firebase-adminsdk-61hy9-ba9a819ccd.json";

const initializeFirebaseAdmin = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
};

export const sendNotification = async (token, title, body) => {
  initializeFirebaseAdmin();

  const messaging = getMessaging();

  try {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    const response = await messaging.send(message);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
