import { useState, useEffect, useRef, useContext } from "react";
import {
  Text,
  View,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import SliderContext from "../Slider/SliderContext";

const pokemonImage = require("../assets/pokemon.jpeg");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NotificationSettings({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [interval, setInterval] = useState(2);
  const [intervalType, setIntervalType] = useState("seconds");
  const [shouldRepeat, setShouldRepeat] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [notificationId, setNotificationId] = useState(null);

  // Slider state
  const { sliderValue, setSliderValue } = useContext(SliderContext);

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
        handleNotificationTap(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleNotificationTap = (response) => {
    navigation.navigate("Play");
  };

  useEffect(() => {
    setIsScheduled(false);
  }, [interval, intervalType]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
      }}
    >
      <Text style={{ marginBottom: 0, fontSize: 17, fontWeight: "bold" }}>
        Gyroscope sensitivity
      </Text>
      <Slider
        style={{ width: 300, height: 20, marginBottom: 10 }}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onValueChange={(value) => setSliderValue(value)}
        value={sliderValue}
      />
      <Text style={{ marginBottom: 0 }}>
        Sensitivty Level: {sliderValue.toFixed(0)}%
      </Text>

      <Text style={{ marginBottom: 0 }}>
        Adjust the sensitivity of your motion detector
      </Text>
      <Text style={{ marginTop: 30, fontSize: 20, fontWeight: "bold" }}>
        Notification Settings
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Picker
          selectedValue={interval}
          style={{ height: 50, width: 100, marginTop: 0 }}
          mode="dialog"
          onValueChange={(itemValue) => setInterval(itemValue)}
        >
          {Array.from({ length: 59 }, (_, i) => i + 1).map((number) => (
            <Picker.Item
              key={number}
              label={number.toString()}
              value={number}
            />
          ))}
        </Picker>

        <Picker
          selectedValue={intervalType}
          style={{ height: 50, width: 150, marginTop: 0 }}
          onValueChange={(itemValue) => setIntervalType(itemValue)}
        >
          <Picker.Item label="Seconds" value="seconds" />
          <Picker.Item label="Minutes" value="minutes" />
          <Picker.Item label="Hours" value="hours" />
        </Picker>
      </View>

      <Picker
        selectedValue={shouldRepeat}
        style={{ height: 50, width: 300, marginBottom: 150, marginTop: 50 }}
        onValueChange={(itemValue) => setShouldRepeat(itemValue)}
      >
        <Picker.Item label="Do Not Repeat" value={false} />
        <Picker.Item label="Repeat" value={true} />
      </Picker>

      <ImageBackground
        source={pokemonImage}
        style={{
          width: "100%",
          height: 100,
          justifyContent: "center",
          borderRadius: 40,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: 40,
            borderRadius: 5,
            height: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={async () => {
            await schedulePushNotification(
              interval,
              intervalType,
              shouldRepeat,
              notificationId,
              setNotificationId
            );
            setIsScheduled(true);
          }}
          disabled={isScheduled}
        >
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            SCHEDULE PUSH NOTIFICATION
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

async function schedulePushNotification(
  interval,
  intervalType,
  shouldRepeat,
  notificationId,
  setNotificationId
) {
  let seconds = interval;

  if (intervalType === "minutes") {
    seconds = interval * 60;
  } else if (intervalType === "hours") {
    seconds = interval * 3600;
  }

  if (shouldRepeat && seconds < 60) {
    alert("Interval must be at least 60 seconds for repeated notifications.");
    return;
  }

  // Cancel the existing notification if there's one
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  const targetDate = new Date();
  targetDate.setSeconds(targetDate.getSeconds() + seconds);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "PokeHunter!",
      body: "(๑´>᎑<)~* Catch your next pokemon now ૮ ˶ᵔ ᵕ ᵔ˶ ა!",
    },
    trigger: {
      date: targetDate,
      repeats: shouldRepeat,
    },
  });

  // Store the new notification identifier
  setNotificationId(id);
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
    //token = (await Notifications.getExpoPushTokenAsync()).data;
    //console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
