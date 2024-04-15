// Import the necessary functions from Firebase

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
