import { FlatList, StyleSheet, Text, View, Image, Button } from 'react-native';
import { ApiContext } from '../context/apiContext';
import { useState, useEffect, useContext } from 'react';

export default function Play() {

    const { pokeData, setPokeData, selectedPokemon, setSelectedPokemon, catchPokemon, pokemonImage, setPokemonImage } = useContext(ApiContext);


    
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((response) => response.json())
      .then((data) => {
        setPokeData(data.results);
        // Select a random Pokémon from the results
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setSelectedPokemon(data.results[randomIndex]);
    
    //   fetch(selectedPokemon.url)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setPokemonImage(data.sprites.front_default);
    //     });

      });
  }, []);

  return (
    <View style={styles.container}>
      {selectedPokemon ? (
        <View>
        <Text>Selected Pokémon: {selectedPokemon.name}</Text>
        <Image source={{ uri: pokemonImage }} style={{ width: 200, height: 200 }} />
        <Button title="Catch Pokémon" onPress={catchPokemon} />
        </View>

      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

    const styles = StyleSheet.create({
        container: {
            padding: 24,
        },
    });