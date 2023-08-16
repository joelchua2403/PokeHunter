import { createContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { useRef } from "react";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [pokeData, setPokeData] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [pokemonImage, setPokemonImage] = useState(null);
  const [pokemonHP, setPokemonHP] = useState(0);
  const [isDefeated, setIsDefeated] = useState(false);
  const [capturedPokemon, setCapturedPokemon] = useState([]);
  const [captured, setCaptured] = useState(false);
  const [punchDetected, setPunchDetected] = useState(false);
  const [kickDetected, setKickDetected] = useState(false);
  const [throwDetected, setThrowDetected] = useState(false);
  const [captureDetected, setCaptureDetected] = useState(false);
  const [attackIncoming, setAttackIncoming] = useState(5);

  const countdownIntervalRef = useRef();

  const checkDefeat = () => {
    if (pokemonHP <= 5) {
      setIsDefeated(true);
    }
  };

  const capturePokemon = () => {
    // Define the capture rate (e.g., 0.5 for 50% chance)
    const captureRate = 1 - pokemonHP / 100;
    const randomChance = Math.random(); // Generates a random number between 0 and 1
    setCaptureDetected(true);
    setTimeout(() => {
      setCaptureDetected(false);
    }, 800);
    // If randomChance is less than or equal to the capture rate, then capture is successful
    if (randomChance <= captureRate) {
      setCapturedPokemon([...capturedPokemon, selectedPokemon]);
      setCaptured(true);
      setPokemonHP(100);
      stopCountdown();
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
    setKickDetected(true);
    setTimeout(() => {
      setKickDetected(false);
    }, 800);
  };

  const onPunch = () => {
    setPokemonHP(pokemonHP - 10);
    checkDefeat();
    setPunchDetected(true);
    setTimeout(() => {
      setPunchDetected(false);
    }, 800);
  };

  const onThrow = () => {
    setPokemonHP(pokemonHP - 30);
    checkDefeat();
    setThrowDetected(true);
    setTimeout(() => {
      setThrowDetected(false);
    }, 800);
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
    setCaptured(false);
  };
  const findTypePokemon = () => {
    // Ensure pokeData has data before proceeding
    if (pokeData && pokeData.length > 0) {
      // Select a random Pokémon from the results
      const randomIndex = Math.floor(Math.random() * pokeData.length);
      const selected = pokeData[randomIndex];
      setSelectedPokemon(selected);

      fetch(selected.url)
        .then((response) => response.json())
        .then((data) => {
          // Check if the sprite is null or undefined
          if (data.sprites && data.sprites.front_default) {
            setPokemonImage(data.sprites.front_default);
            console.log(selected);
            setPokemonHP(100);
            setIsDefeated(false);
          } else {
            // If sprite is null or undefined, select another Pokémon
            findTypePokemon();
          }
        })
        .catch((error) => {
          console.error("Error fetching Pokémon details:", error);
        });
    } else {
      console.error("pokeData is empty or not loaded yet.");
    }
  };

  const stopCountdown = () => {
    setAttackIncoming(5);
    clearInterval(countdownIntervalRef.current);
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
        punchDetected,
        kickDetected,
        throwDetected,
        captureDetected,
        attackIncoming,
        setAttackIncoming,
        stopCountdown,
        countdownIntervalRef,
        captured,
        findTypePokemon,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
