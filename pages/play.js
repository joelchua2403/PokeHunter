import { FlatList, StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native";
import { ApiContext } from "../context/apiContext";
import { useState, useEffect, useContext } from "react";
import background from "../assets/background.jpg";
import PokemonBattleScene from "../components/PokemonBattle";
import { GyroContext } from "../context/gyroContext";
import { Gyroscope } from "expo-sensors";

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
    onThrow,
  } = useContext(ApiContext);

  // const {
  //   handleGyroscopeData,
  //   onGyroKick,
  //   onGyroPunch,
  //   onGyroThrow,
  // } = useContext(GyroContext);


    const [{ x, y, z }, setData] = useState({
      x: 0,
      y: 0,
      z: 0,
    });
    const [subscription, setSubscription] = useState(null);
  
    const _slow = () => Gyroscope.setUpdateInterval(1000);
    const _fast = () => Gyroscope.setUpdateInterval(16);
  
    const _subscribe = () => {
      setSubscription(
        Gyroscope.addListener(gyroscopeData => {
          setData(gyroscopeData);
        })
      );
    };
  
    const _unsubscribe = () => {
      subscription && subscription.remove();
      setSubscription(null);
    };

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

  useEffect(() => {
    if (pokemonHP > 0 && selectedPokemon && (x > 1 || x < -1)) {
      setPokemonHP(pokemonHP - 10);
      checkDefeat();
    }
    if (pokemonHP > 0 && selectedPokemon && (y > 1 || y < -1)) {
      setPokemonHP(pokemonHP - 20);
      checkDefeat();
    }
    if (pokemonHP > 0 && selectedPokemon && (z > 1 || z < -1)) {
      setPokemonHP(pokemonHP - 30);
      checkDefeat();
    }
  }, [x, y, z]); // Add

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const onGyroPunch = () => {
    if (pokemonHP > 0 && selectedPokemon && (x > 1 || x < -1)) {
      setPokemonHP(pokemonHP - 10);
      checkDefeat();
    }
  };

    

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
 
            {pokemonHP > 0 && selectedPokemon? (
              <Text style={styles.pokemonHP}>HP: {pokemonHP}</Text>
            ) : (
              null
            ) 
            }
            {selectedPokemon.name && pokemonHP <= 0 && (
              <Text>You have defeated {selectedPokemon.name}!</Text>
            ) }
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>

      <View style={styles.container}>
        <Button title="Find a Pokémon" onPress={findPokemon} />
        <View style={styles.buttonContainer}>
        {x > 1 || x < -1 ? <Text style={styles.text}>Punch</Text> : null}
      {y > 1 || y < -1 ? <Text style={styles.text}>Kick</Text> : null}
      {z > 1 || z < -1 ? <Text style={styles.text}>Throw</Text> : null}
      </View>
        <PokemonBattleScene onKick={onKick} onPunch={onGyroPunch} onThrow={onThrow} findPokemon={findPokemon} />
        <Text>Gyroscope:</Text>
      <Text >x: {x}</Text>
      <Text >y: {y}</Text>
      <Text >z: {z}</Text>
     
      <View >
      <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <Button onPress={_slow} title="slow" />
         
       
        <Button onPress={_fast} title="fast"/>
       
      </View>

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
      backgroundColor: 'lightgrey',
    },
});
