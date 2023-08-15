import { StyleSheet, Text, View, Image } from "react-native";

import logo from "../assets/logo.png";

export default function Home() {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  logo: {
    width: "100%",
    height: "40%",
    resizeMode: "contain",
  },
});
