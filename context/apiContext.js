import { createContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from "react-native";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [pokeData, setPokeData] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [pokemonImage, setPokemonImage] = useState(null);
  const [pokemonHP, setPokemonHP] = useState(0);
  const [isDefeated, setIsDefeated] = useState(false);
  const [capturedPokemon, setCapturedPokemon] = useState([]);

  const checkDefeat = () => {
    if (pokemonHP <= 5) {
      setIsDefeated(true);
    }
  };

  const capturePokemon = () => {
    // Define the capture rate (e.g., 0.5 for 50% chance)
    const captureRate = 1 - pokemonHP / 100;
    const randomChance = Math.random(); // Generates a random number between 0 and 1

    // If randomChance is less than or equal to the capture rate, then capture is successful
    if (randomChance <= captureRate) {
      setCapturedPokemon([...capturedPokemon, selectedPokemon]);
      Alert.alert("You have captured " + selectedPokemon.name + "!");
    } else {
      Alert.alert("Oh no! " + selectedPokemon.name + " escaped!");
    }
  };

  const showDefeat = () => {
    if (selectedPokemon) {
      return (
        <View>
          <Text>You have defeated {selectedPokemon.name}!</Text>
        </View>
      );
    }
  };

  const onKick = () => {
    setPokemonHP(pokemonHP - 20);
    checkDefeat();
  };

  const onPunch = () => {
    setPokemonHP(pokemonHP - 10);
    checkDefeat();
  };

  const onThrow = () => {
    setPokemonHP(pokemonHP - 30);
    checkDefeat();
  };

  const findPokemon = () => {
    // Select a random Pokémon from the results
    const randomIndex = Math.floor(Math.random() * pokeData.length);
    const selected = pokeData[randomIndex];
    setSelectedPokemon(selected);

    fetch(selected.url)
      .then((response) => response.json())
      .then((data) => {
        setPokemonImage(data.sprites.front_default);
      });

    setPokemonHP(100);
    setIsDefeated(false);
  };

  return (
    <ApiContext.Provider
      value={{
        pokeData,
        setPokeData,
        selectedPokemon,
        setSelectedPokemon,
        findPokemon,
        pokemonImage,
        setPokemonImage,
        pokemonHP,
        setPokemonHP,
        isDefeated,
        setIsDefeated,
        checkDefeat,
        showDefeat,
        onKick,
        onPunch,
        onThrow,
        capturedPokemon,
        setCapturedPokemon,
        capturePokemon,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
