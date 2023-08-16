import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { ApiProvider } from "./context/apiContext";
import Home from "./pages/home";
import Play from "./pages/play";
import Achievements from "./pages/achievements";
import NotificationSettings from "./pages/NotificationSettings";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//Settings
import SliderProvider from "./Slider/SliderProvider";
import BackgroundSettingsProvider from "./Slider/BackgroundSettingsProvider.js";
//
import Icon from "react-native-vector-icons/Ionicons";
import { GyroProvider } from "./context/gyroContext";
import pokemon from "./assets/pokemon.jpeg";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={NotificationSettings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings-outline" color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
}

function PlayTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Play"
        component={Play}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="game-controller-outline" color={color} size={size} />
          ),
          title: "Pokémon Hunt",
          headerStyle: {
            backgroundColor: "gainsboro",
          },
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="PokeDex"
        component={Achievements}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-outline" color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <BackgroundSettingsProvider>
      <ApiProvider>
        <SliderProvider>
          <GyroProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="HomeTabs" component={HomeTabs} />
                <Stack.Screen name="PlayTabs" component={PlayTabs} />
              </Stack.Navigator>
              {/* <Tab.Navigator>
              <Tab.Screen
                name="Home"
                component={Home}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="home-outline" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Play"
                component={Play}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon
                      name="game-controller-outline"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="PokeDex"
                component={Achievements}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="book-outline" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Settings"
                component={NotificationSettings}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="settings-outline" color={color} size={size} />
                  ),
                }}
              />
            </Tab.Navigator> */}
            </NavigationContainer>
          </GyroProvider>
        </SliderProvider>
      </ApiProvider>
    </BackgroundSettingsProvider>
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
