import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import punch from "../assets/punch.png";
import kick from "../assets/kick.png";
import throwimg from "../assets/throwimg.png";
import capture from "../assets/capture.png";
import { useContext } from "react";
import { ApiContext } from "../context/apiContext";
//
import BackGroundDefault from "../assets/BackGroundGrass.png";
import ForeGroundDefault from "../assets/ForeGroundGrass.png";
import BackGroundFire from "../assets/backGroundfire.png";
import ForeGroundFire from "../assets/foreGroundfire.png";
import BackGroundDessert from "../assets/backGroundDessert.png";
import ForeGroundDessert from "../assets/foreGroundDessert.png";
import BackGroundGrassType from "../assets/backGroundJungle.png";
import ForeGroundGrassType from "../assets/foreGroundJungle.png";

import BackgroundSettingsContext from "../Slider/BackgroundSettingsContext.js";
const scrollSpeed = 450;
export default function LandscapeScroll({
  x,
  name,
  image,
  HP,
  selectedPokemon,
  pokemonLocation,
  hue,
}) {
  const {
    punchDetected,
    kickDetected,
    throwDetected,
    captureDetected,
    captured,
    stopCountdown,
  } = useContext(ApiContext);

  const { backgroundValue } = useContext(BackgroundSettingsContext);

  // To stop the countdown when the pokemon is defeated
  useEffect(() => {
    if (name && HP <= 0) {
      stopCountdown();
    }
  }, [name, HP]);


  let backgroundSource, foregroundSource;

  switch (backgroundValue) {
    case "fire":
      backgroundSource = BackGroundFire;
      foregroundSource = ForeGroundFire;
      break;
    case "grass":
      backgroundSource = BackGroundGrassType;
      foregroundSource = ForeGroundGrassType;
      break;
    case "ground":
      backgroundSource = BackGroundDessert;
      foregroundSource = ForeGroundDessert;
      break;
    default:
      backgroundSource = BackGroundDefault; // default background
      foregroundSource = ForeGroundDefault; // default foreground
      break;
  }

  return (
    <View style={styles.battleContainer}>
      <Image
        source={backgroundSource}
        style={[
          styles.backgroundBattle,
          {
            transform: [{ translateX: x * scrollSpeed * 2 }],
          },
        ]}
      />
      <Image
        source={foregroundSource}
        style={[
          styles.foregroundBattle,
          {
            transform: [{ translateX: (x * scrollSpeed) / 2 }],
          },
        ]}
      />
      {punchDetected && (
        <Image
          source={punch}
          style={[
            styles.punchImage,
            {
              transform: [
                { translateX: pokemonLocation * scrollSpeed + x * scrollSpeed },
                { translateY: 40 },
              ],
            },
          ]}
        />
      )}

      {kickDetected && (
        <Image
          source={kick}
          style={[
            styles.punchImage,
            {
              transform: [
                { translateX: pokemonLocation * scrollSpeed + x * scrollSpeed },
                { translateY: 40 },
              ],
            },
          ]}
        />
      )}

      {throwDetected && (
        <Image
          source={throwimg}
          style={[
            styles.punchImage,
            {
              transform: [{ translateX: pokemonLocation }, { translateY: 40 }],
            },
          ]}
        />
      )}

      {captureDetected && (
        <Image
          source={capture}
          style={[
            styles.punchImage,
            {
              transform: [{ translateX: pokemonLocation }, { translateY: 40 }],
            },
          ]}
        />
      )}

      {}

      {hue > 0 ? (
        <Text style={styles.pokemonName}>{name} Attacked you! </Text>
      ) : null}

      <View
        style={[
          styles.pokemonStats,
          {
            transform: [
              { translateX: pokemonLocation * scrollSpeed + x * scrollSpeed },
              { translateY: 40 },
            ],
          },
        ]}
      >
        {!captured && (
          <View>
            <Text style={styles.pokemonName}>{name}</Text>
            {HP > 0 && selectedPokemon ? (
              <Text style={styles.pokemonHP}>HP: {HP}</Text>
            ) : null}
            {name && HP <= 0 && <Text>You have defeated {name}!</Text>}
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          </View>
        )}
      </View>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: `rgba(255, 0, 0, ${hue})`,
          zIndex: 10,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  battleContainer: {
    topPadding: -10,
    height: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  pokemonName: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  pokemonHP: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  pokemonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    padding: 24,
  },
  backgroundBattle: {
    height: "100%",
    zIndex: -1,
    position: "absolute",
    resizeMode: "contain",
  },
  foregroundBattle: {
    height: "40%", // Adjust the size of the foreground image
    position: "absolute", // Position the foreground image on top of the background
    bottom: 0,
    zIndex: 2,
    resizeMode: "contain",
  },

  text: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    padding: 20,
    backgroundColor: "lightgrey",
  },
  pokemonStats: {},
  punchImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    position: "absolute",
    zIndex: 1,
  },
});
