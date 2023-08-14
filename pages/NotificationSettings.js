import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NotificationSettings() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [interval, setInterval] = useState(2); // default value
  const [intervalType, setIntervalType] = useState("seconds"); // default value
  const [shouldRepeat, setShouldRepeat] = useState(false); // default value

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {/* <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View> */}

      <Picker
        selectedValue={interval}
        style={{ height: 50, width: 100 }}
        onValueChange={(itemValue) => setInterval(itemValue)}
      >
        <Picker.Item label="5" value={5} />
        <Picker.Item label="10" value={10} />
        <Picker.Item label="15" value={15} />
      </Picker>

      <Picker
        selectedValue={intervalType}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue) => setIntervalType(itemValue)}
      >
        <Picker.Item label="Seconds" value="seconds" />
        <Picker.Item label="Minutes" value="minutes" />
        <Picker.Item label="Hours" value="hours" />
      </Picker>

      <Picker
        selectedValue={shouldRepeat}
        style={{ height: 50, width: 300 }}
        onValueChange={(itemValue) => setShouldRepeat(itemValue)}
      >
        <Picker.Item label="Do Not Repeat" value={false} />
        <Picker.Item label="Repeat" value={true} />
      </Picker>

      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification(interval, intervalType, shouldRepeat);
        }}
      />
    </View>
  );
}

async function schedulePushNotification(interval, intervalType, shouldRepeat) {
  let seconds = interval;

  if (intervalType === "minutes") {
    seconds = interval * 60;
  } else if (intervalType === "hours") {
    seconds = interval * 3600;
  }

  // Validation check for repeating notifications
  if (shouldRepeat && seconds < 60) {
    alert("Interval must be at least 60 seconds for repeated notifications.");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "PokeHunter!",
      body: "(๑´>᎑<)~* Catch your next pokemon now ૮ ˶ᵔ ᵕ ᵔ˶ ა!",
    },
    trigger: {
      seconds: seconds,
      repeats: shouldRepeat,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
