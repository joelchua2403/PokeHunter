import { FlatList, StyleSheet, Text, View, Image, Button } from "react-native";
import { ApiContext } from "../context/apiContext";
import { useState, useEffect, useContext } from "react";
import background from "../assets/background.jpg";
import PokemonBattleScene from "../components/PokemonBattle";

export default function Play() {
  const {
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
  } = useContext(ApiContext);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((response) => response.json())
      .then((data) => {
        setPokeData(data.results);
        // Select a random Pokémon from the results
        // const randomIndex = Math.floor(Math.random() * data.results.length);
        // setSelectedPokemon(data.results[randomIndex]);

        //   fetch(selectedPokemon.url)
        //     .then((response) => response.json())
        //     .then((data) => {
        //       setPokemonImage(data.sprites.front_default);
        //     });
      });
  }, []);

  
    

  return (
    <View>
      <View>
        <Image source={background} style={styles.background} />
        {pokemonImage && selectedPokemon ? (
          <View style={styles.pokemonContainer}>
            <Text style={styles.pokemonName}>{selectedPokemon.name}</Text>
            <Image
              source={{ uri: pokemonImage }}
              style={{ width: 200, height: 200 }}
            />

            {pokemonHP > 0 && selectedPokemon ? (
              <Text style={styles.pokemonHP}>HP: {pokemonHP}</Text>
            ) : (

               <Text>
            You have defeated {selectedPokemon.name}!
          </Text>
            )}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>

      <View style={styles.container}>
        {selectedPokemon && pokemonHP <= 0? (
           <Button title="Find another Pokémon" onPress={findPokemon} />
         ) : (
          <Button title="Find Pokémon" onPress={findPokemon} />
        )}
        <PokemonBattleScene onKick={onKick} onPunch={onPunch} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    height: "100%",
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pokemonHP: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pokemonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    padding: 24,
  },
  background: {
    height: "100%",
    zIndex: -1,
    position: "absolute",
  },
});
