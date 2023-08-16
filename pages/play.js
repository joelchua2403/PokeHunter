import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { ApiContext } from "../context/apiContext";
import { useState, useEffect, useContext, useRef } from "react";
import background from "../assets/background.jpg";
import PokemonBattleScene from "../components/PokemonBattle";
import { GyroContext } from "../context/gyroContext";
import { Gyroscope } from "expo-sensors";
import LandscapeScroll from "../components/LandscapeScroll";
import { Accelerometer } from 'expo-sensors';

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
    setCapturedPokemon,
    capturedPokemon,
    capturePokemon,
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



  const _slow = () => Accelerometer.setUpdateInterval(200);

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(setData));
    Accelerometer.setUpdateInterval(200);

  };

  const _unsubscribe = () => {
    subscription && subscription.remove();

    
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);


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

  // useEffect(() => {
  //   if (pokemonHP > 0 && selectedPokemon && (x > 1 || x < -1)) {
  //     setPokemonHP(pokemonHP - 10);
  //     checkDefeat();
  //   }
  //   if (pokemonHP > 0 && selectedPokemon && (y > 1 || y < -1)) {
  //     setPokemonHP(pokemonHP - 20);
  //     checkDefeat();
  //   }
  //   if (pokemonHP > 0 && selectedPokemon && (z > 1 || z < -1)) {
  //     setPokemonHP(pokemonHP - 30);
  //     checkDefeat();
  //   }
  // }, [x, y, z]); // Add

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

  const [pokemonLocation, setPokemonLocation] = useState(Math.random() * 1.6 - 0.8);

  const movePokemon = () => {
    let randomValue;

    do {
      randomValue = Math.random() * 1.6 - 0.8;
    } while (randomValue < pokemonLocation + 0.3 && randomValue > pokemonLocation - 0.3);

    setPokemonLocation(randomValue);

  }

  const registerHit = () => {
    if (Math.abs(x + pokemonLocation) < 0.15){
      console.log("hit!");
      movePokemon();
      startCountdown();
      return (true);
    }else {
      console.log("false");
      return (false);
    }
  }

  const [redHue, setRedHue] = useState(0);
  const [attackIncoming, setAttackIncoming] =useState(5);

  const intervalRef = useRef();
  const countdownIntervalRef = useRef();

  const startCountdown = () => {
    setAttackIncoming(5);
    clearInterval(countdownIntervalRef.current);
    startCountdownInterval();
  };

  const stopCountdown = () => {
    setAttackIncoming(5);
    clearInterval(countdownIntervalRef.current);
  }

  const attacked = () => {
    const animationDuration = 2000; // 2 seconds
    const steps = 60; // Number of steps in the animation
    const stepDuration = animationDuration / steps;
    setRedHue(1);

    let currentStep = 0;
    intervalRef.current = setInterval(() => {
      currentStep++;

      if (currentStep >= steps) {
        clearInterval(intervalRef.current);
        setRedHue(0);
      } else {
        const progress = 1 - currentStep / steps;
        setRedHue(progress);
      }
    }, stepDuration);
  };

  const startCountdownInterval = () => {
    let currentStep = 5;
    countdownIntervalRef.current = setInterval(() => {
      if (currentStep > 0){
        currentStep --;
        setAttackIncoming(currentStep);
        console.log(currentStep);
      } else {
        currentStep = 5;
        setAttackIncoming(5);
        attacked();
        Vibration.vibrate(500);
      }
    }, 1000); 
  };


  return (
    <View>
      {/* <View>
        <Image source={background} style={styles.background} />
        {pokemonImage && selectedPokemon ? (
          <View style={styles.pokemonContainer}>
            <LandscapeScroll x ={x}/>
            <Text style={styles.pokemonName}>{selectedPokemon.name}</Text>
            <Image
              source={{ uri: pokemonImage }}
              style={{ width: 200, height: 200 }}
            />

            {pokemonHP > 0 && selectedPokemon ? (
              <Text style={styles.pokemonHP}>HP: {pokemonHP}</Text>
            ) : null}
            {selectedPokemon.name && pokemonHP <= 0 && (
              <Text>You have defeated {selectedPokemon.name}!</Text>
            )}
          </View>
        ) : (
          <Image source={background} style={styles.background} />
        )}
      </View> */}
      <LandscapeScroll x ={x.toFixed(2)} name = {selectedPokemon.name} image = {pokemonImage} HP ={pokemonHP} selectedPokemon={selectedPokemon} pokemonLocation= {pokemonLocation} hue= {redHue}/>

      <View style={styles.container}>
        <Button title="Find a Pokémon" onPress={()=>{findPokemon(); movePokemon(); startCountdown();}} />
        <View style={styles.buttonContainer}>

        {x > 1 || x < -1 ? <Text style={styles.text}>Punch</Text> : null}
      {y > 1 || y < -1 ? <Text style={styles.text}>Kick</Text> : null}
      {z > 1 || z < -1 ? <Text style={styles.text}>Throw</Text> : null}
      </View>
        <PokemonBattleScene onKick={()=> {if(registerHit()){onKick()}}} onPunch={onGyroPunch} onThrow={()=> {if(registerHit()){onThrow()}}} capturePokemon={()=> {if(registerHit()){capturePokemon()}}} />
        <Text>Gyroscope:</Text>
      <Text >x: {x}</Text>
      <Text >y: {y}</Text>
      <Text >z: {z}</Text>
     
      <View >
      <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <Button onPress={_slow} title="slow" />
         
       
      </View>


        <View>
          <TouchableOpacity
            onPress={subscription ? _unsubscribe : _subscribe}
            style={styles.button}
          >
            <Text>{subscription ? "On" : "Off"}</Text>
          </TouchableOpacity>
          <Button onPress={_slow} title="slow" />

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
    backgroundColor: "lightgrey",
  },
});
