import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ApiProvider } from "./context/apiContext";
import Home from "./pages/home";
import Play from "./pages/play";
import Achievements from "./pages/achievements";
import NotificationSettings from "./pages/NotificationSettings";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SliderProvider from "./Slider/SliderProvider";
export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  return (
    <ApiProvider>
      <SliderProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Play" component={Play} />
            <Tab.Screen name="Achievements" component={Achievements} />
            <Tab.Screen
              name="Notification Settings"
              component={NotificationSettings}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SliderProvider>
    </ApiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
