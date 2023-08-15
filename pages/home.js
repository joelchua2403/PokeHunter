import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useRef, useContext } from "react";
import SliderContext from "../Slider/SliderContext";

// Slider state

export default function Home() {
  const { sliderValue, setSliderValue } = useContext(SliderContext);
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>{sliderValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
