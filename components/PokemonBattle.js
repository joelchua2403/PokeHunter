import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PokemonBattleScene = ({ onKick, onPunch, onThrow, capturePokemon}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={onPunch}>
          <Text style={styles.buttonText}>Punch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onKick}>
          <Text style={styles.buttonText}>Kick</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={onThrow}>
          <Text style={styles.buttonText}>Throw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={capturePokemon}>
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'lightgrey',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PokemonBattleScene;
