import { useState, useEffect, useRef, useContext } from "react";
import {
  Text,
  View,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Switch,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import SliderContext from "../Slider/SliderContext";
import BackgroundSettingsContext from "../Slider/BackgroundSettingsContext";

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
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  // Slider state
  const { sliderValue, setSliderValue } = useContext(SliderContext);
  // Slider state
  const { backgroundValue, setBackgroundValue } = useContext(
    BackgroundSettingsContext
  );

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
    navigation.navigate("PlayTabs");
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

      <Text>Adjust the sensitivity of your motion detector</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between", // This will space them apart
          paddingHorizontal: 20, // Add some padding to the sides
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Notification Settings
        </Text>

        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() =>
            setIsNotificationsEnabled((prevState) => !prevState)
          }
          value={isNotificationsEnabled}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Picker
          selectedValue={interval}
          style={{ height: 50, width: 100, marginTop: 0 }}
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
        style={{ height: 50, width: 300, marginBottom: 150, marginTop: 100 }}
        onValueChange={(itemValue) => setShouldRepeat(itemValue)}
      >
        <Picker.Item label="Do Not Repeat" value={false} />
        <Picker.Item label="Repeat" value={true} />
      </Picker>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      ></View>

      <ImageBackground
        source={pokemonImage}
        style={{
          width: "100%",
          height: 100,
          justifyContent: "center",
          borderRadius: 40,
          overflow: "hidden",
          marginBottom: 20,
          marginTop: 0,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 5,
            height: 150,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={async () => {
            await schedulePushNotification(
              interval,
              intervalType,
              shouldRepeat,
              notificationId,
              setNotificationId,
              isNotificationsEnabled
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
  setNotificationId,
  isNotificationsEnabled
) {
  if (!isNotificationsEnabled) {
    alert("Notifications are turned off. Please enable them to schedule.");
    return;
  }

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
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
