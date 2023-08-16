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
import Icon from "react-native-vector-icons/Ionicons";
import { GyroProvider } from "./context/gyroContext";

export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  return (
    <ApiProvider>

      <SliderProvider>

      <GyroProvider>

        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={Home}  
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              ),
            }}
            />
            <Tab.Screen name="Play" component={Play} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="game-controller-outline" color={color} size={size} />
              ),
            }}
            />
            <Tab.Screen name="PokeDex" component={Achievements} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="book-outline" color={color} size={size} />
              ),
            }}
            />
            <Tab.Screen name="Settings" component={NotificationSettings} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="settings-outline" color={color} size={size} />
              ),
            }}
            />
          </Tab.Navigator>
        </NavigationContainer>

      </GyroProvider>
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
