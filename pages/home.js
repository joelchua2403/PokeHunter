import { StyleSheet, Text, View, Image, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import logo from "../assets/logo.png";
import home from "../assets/home.png";

const Tab = createBottomTabNavigator();

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={home} style={{ width: "100%", height: "100%" }}>
        <View style={styles.imagebox}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.playbox}>
          <Button
            contentStyle={{ padding: 5 }}
            labelStyle={{ fontSize: 23 }}
            icon="pokeball"
            textColor="dodgerblue"
            buttonColor="rgba(255,255,255,0.7)"
            onPress={() => navigation.navigate("PlayTabs")}
          >
            <Text style={{ fontSize: 18 }}>PLAY</Text>
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  logo: {
    height: "55%",
    resizeMode: "contain",
  },
  imagebox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playbox: {
    flex: 1,
    alignItems: "center",
  },
});
