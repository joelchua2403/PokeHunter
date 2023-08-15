import { createContext, useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { Gyroscope } from "expo-sensors";
import { ApiContext } from "./apiContext";

export const GyroContext = createContext();

export const GyroProvider = ({ children }) => {
  const {
    selectedPokemon,

    pokemonHP,
    setPokemonHP,

    checkDefeat,

    onKick,
    onPunch,
    onThrow,
  } = useContext(ApiContext);

  const onGyroPunch = () => {
    if (pokemonHP > 0 && selectedPokemon) {
      setPokemonHP(pokemonHP - 10);
      checkDefeat();
      console.log("Punch");
    } else {
      return;
    }
  };

  const onGyroKick = () => {
    if (pokemonHP > 0 && selectedPokemon) {
      setPokemonHP(pokemonHP - 20);
      checkDefeat();
      console.log("Kick");
    } else {
      return;
    }
  };

  const onGyroThrow = () => {
    if (pokemonHP > 0 && selectedPokemon) {
      setPokemonHP(pokemonHP - 30);
      checkDefeat();
      console.log("throw");
    } else {
      return;
    }
  };

  const onRun = (findPokemon) => {};

  // const handleGyroscopeData = ({ x, y, z }) => {
  //   // Define threshold for triggering actions
  //   const threshold = 0.2;

  //   if (x > threshold) {
  //     onPunch();
  //   } else if (x < -threshold) {
  //     onKick();
  //   } else if (y > threshold) {
  //     onThrow();
  //   } else if (y < -threshold) {
  //     onRun();
  //   }
  // };

  // useEffect(() => {
  //   // Set the gyroscope update interval
  //   Gyroscope.setUpdateInterval(1000);

  //   // Subscribe to gyroscope updates
  //   const subscription = Gyroscope.addListener(handleGyroscopeData);

  //   // Unsubscribe when the component unmounts
  //   return () => {
  //     subscription && subscription.remove();
  //   };
  // }, []);

  return (
    <GyroContext.Provider
      value={{
        onGyroPunch,
        onGyroKick,
        onGyroThrow,
        onRun,
      }}
    >
      {children}
    </GyroContext.Provider>
  );
};
