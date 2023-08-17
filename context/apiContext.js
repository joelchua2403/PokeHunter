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
import { Audio } from "expo-av";

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
  const [playerHealth, setPlayerHealth] = useState(3);
  const [inventory, setInventory] = useState([1, 2, 3]);

  const countdownIntervalRef = useRef();


  const sound = require("../assets/sound.mp3");
  const captureSound = require("../assets/capturesound.wav");
  const soundObjectRef = useRef(new Audio.Sound());
  const captureSoundObjectRef = useRef(new Audio.Sound());
  const [isSoundLoaded, setIsSoundLoaded] = useState(false);

  // Load sound on component mount
  useEffect(() => {
    async function loadSound() {
      try {
        await soundObjectRef.current.loadAsync(sound);
        await captureSoundObjectRef.current.loadAsync(captureSound);

        setIsSoundLoaded(true);
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    }
    loadSound();
  }, []);

  // Play/Stop sound based on conditions
  useEffect(() => {
    if (isSoundLoaded) {
      // Only attempt to play or stop if sound is loaded
      if (isDefeated || captured) {
        playCaptureSound();
        stopSound();
      } else if (pokemonImage) {
        playSound();
      }
    }
  }, [isDefeated, captured, pokemonImage, isSoundLoaded]);

  async function playSound() {
    if (!isSoundLoaded) return; // Guard clause
    try {
      await soundObjectRef.current.setIsLoopingAsync(true);
      await soundObjectRef.current.playAsync();
    } catch (error) {
      console.log(error);
    }
  }

  async function stopSound() {
    console.log("Stopping Sound");
    if (!isSoundLoaded) return; // Guard clause
    try {
      await soundObjectRef.current.stopAsync();
    } catch (error) {
      console.log(error);
    }
  }

  async function playCaptureSound() {
    console.log("Capture Sound");
    if (!isSoundLoaded) return; // Guard clause
    try {
      await captureSoundObjectRef.current.playAsync();
    } catch (error) {
      console.log(error);
    }
  }

  const checkDefeat = (currentHealth) => {
    if (currentHealth <= 5) {
      console.log("defeated!");
      
      newBerry();
      stopCountdown();
      setIsDefeated(true);
      stopSound();
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
    stopSound();
    // If randomChance is less than or equal to the capture rate, then capture is successful
    if (randomChance <= captureRate) {
      setCapturedPokemon([...capturedPokemon, selectedPokemon]);
      setCaptured(true);
      playCaptureSound();
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
    checkDefeat(pokemonHP - 20);
    setKickDetected(true);
    setTimeout(() => {
      setKickDetected(false);
    }, 800);
  };

  const onPunch = () => {
    setPokemonHP(pokemonHP - 10);
    checkDefeat(pokemonHP - 10);
    setPunchDetected(true);
    setTimeout(() => {
      setPunchDetected(false);
    }, 800);
  };

  const onThrow = () => {
    setPokemonHP(pokemonHP - 30);
    checkDefeat(pokemonHP - 30);
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
    playSound();
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
            setCaptured(false);
            playSound();
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

  const damagePlayer = () => {
    if (playerHealth > 0) {
      setPlayerHealth((health) => health - 1);
    }
  };

  const healPlayer = () => {
    if (playerHealth < 3) {
      setPlayerHealth((health) => health + 1);
    }
  };

  const newBerry = () => {

    const newBerry = Math.floor(Math.random() * 20) + 1;
    setInventory(berries => [...berries, newBerry])
  }

  const deleteBerry= (n) => {
    const newBerries = inventory.filter((el, i) => i !== n);
    setInventory(newBerries);
  }

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
        damagePlayer,
        healPlayer,
        newBerry,
        playerHealth,
        inventory,
        stopSound,
        deleteBerry,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
