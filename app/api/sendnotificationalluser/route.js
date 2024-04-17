import {
  getAllNotificationTokens,
  updateNotificationToken,
} from "@/app/lib/sendPushNotification";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  const { surveyId } = await request.json();
  const tokens = await getAllNotificationTokens();

  const message = {
    to: tokens,
    sound: "default",
    title: "New Survey Available",
    body: "A new survey is now available for you to complete.",
  };
  const url = "https://exp.host/--/api/v2/push/send?useFcmV1=true";
  const headers = {
    //   "Content-Type": "application/json",
    //   accept: "application/json",
    //   "accept-encoding": "gzip, deflate",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Failed to send push notification",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const notification = {
      notificationId: uuidv4(),
      title: message.title,
      body: message.body,
      surveyId: surveyId,
      seen: false,
      timestamp: new Date().toISOString(),
    };
    // Iterate through each token and add the notification
    await Promise.all(
      tokens.map(async (token) => {
        notification.notificationId = uuidv4();
        await updateNotificationToken(token, notification);
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification sent successfully to all users",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending push notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send notification" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
