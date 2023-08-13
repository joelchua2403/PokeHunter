import { createContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [pokeData, setPokeData] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [pokemonImage, setPokemonImage] = useState([]);
  const [pokemonHP, setPokemonHP] = useState(0);
  const [isDefeated, setIsDefeated] = useState(false);

  const checkDefeat = () => {
    if (pokemonHP <= 0) {
      setIsDefeated(true);
      showDefeat();
    }
  };

  const showDefeat = () => {
      return (
        <View >
          <Text>
            You have defeated {selectedPokemon.name}!
          </Text>
          <Button title="Find another Pokémon" onPress={findPokemon} />
        </View>
      );
    }
  

  const onKick = () => {
   if( pokemonHP > 0 && selectedPokemon ) {
    setPokemonHP(pokemonHP - 20);
    checkDefeat();
   } else {
    return 
   }
  };

  const onPunch = () => {
    if( pokemonHP > 0 && selectedPokemon ) {
        setPokemonHP(pokemonHP - 10);
        checkDefeat();
       } else {
        return
       }
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

      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
