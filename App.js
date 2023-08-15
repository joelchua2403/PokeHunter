import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ApiProvider } from "./context/apiContext";
import Home from "./pages/home";
import Play from "./pages/play";
import Achievements from "./pages/achievements";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GyroProvider } from "./context/gyroContext";

export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  return (
    <ApiProvider>
      <GyroProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Play" component={Play} />
            <Tab.Screen name="PokeDex" component={Achievements} />
          </Tab.Navigator>
        </NavigationContainer>
      </GyroProvider>
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
