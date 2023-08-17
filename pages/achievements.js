import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  ImageBackground,
  Button,
} from "react-native";
import { useContext } from "react";
import { ApiContext } from "../context/apiContext";
import { createStackNavigator } from "@react-navigation/stack";
import pokedex from "../assets/pokedex.png";
import pokedexball from "../assets/pokedexball.png";
import pokedexbackground from "../assets/pokedexbackground.png";

const Stack = createStackNavigator();

function PokedexGlancePanel({ navigation, id, pokemonList }) {
  const [pokemonDetails, setPokemonDetails] = useState({});

  useEffect(() => {
    (async () => {
      setPokemonDetails(pokemonList[id]);
    })();
  }, []);

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#87cefa" : "rgba(224,224,224,0.8)",
        },
        styles.glancepanel,
      ]}
      onPress={() =>
        navigation.navigate("Detail", {
          pokemonList: pokemonList,
          id: id,
        })
      }
    >
      {id < 9 ? (
        <Text style={styles.glanceid}>00{id + 1}</Text>
      ) : (
        <Text style={styles.glanceid}>0{id + 1}</Text>
      )}
      <Text style={styles.glancename}>{pokemonDetails.name}</Text>
      <Image
        source={{ uri: pokemonDetails.image }}
        style={styles.glanceimage}
      />
    </Pressable>
  );
}

function PokedexGlanceScreen({ navigation }) {
  const { capturedPokemon } = useContext(ApiContext);
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const pokemonDetailsTemp = [];
      for (const pokemon of capturedPokemon) {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        pokemonDetailsTemp.push({
          name: pokemon.name,
          image: data.sprites.front_default,
          types: data.types.map((t) => t.type.name).join(", "),
          abilities: data.abilities.map((a) => a.ability.name).join(", "),
          height: data.height,
          weight: data.weight,
        });
      }
      setPokemonList(pokemonDetailsTemp);
    };

    fetchDetails();
  }, [capturedPokemon]);

  return (
    <View style={styles.glancescreen}>
      <ImageBackground source={pokedexbackground} imageStyle={{ opacity: 0.7 }}>
        <ImageBackground
          source={pokedexball}
          style={{
            width: "100%",
            height: "100%",
          }}
          imageStyle={{ opacity: 0.5 }}
        >
          <FlatList
            data={pokemonList}
            renderItem={({ index }) => (
              <PokedexGlancePanel
                id={index}
                navigation={navigation}
                pokemonList={pokemonList}
              />
            )}
          />
        </ImageBackground>
      </ImageBackground>
    </View>
  );
}

function PokemonDetailScreen({ route }) {
  let pokemonList = route.params.pokemonList;
  let id = route.params.id;
  const { width, height } = Dimensions.get("window"); // Get the screen dimensions

  const getItemLayout = (data, index) => {
    return { length: width, offset: width * index, index };
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={pokedexbackground} imageStyle={{ opacity: 0.7 }}>
        <ImageBackground
          source={pokedexball}
          style={{
            width: "100%",
            height: "100%",
          }}
          imageStyle={{ opacity: 0.5 }}
        >
          <FlatList
            data={pokemonList}
            initialScrollIndex={id}
            keyExtractor={(item, index) => index.toString()}
            getItemLayout={getItemLayout}
            renderItem={({ item, index }) => (
              <View style={[styles.pokemonItem, { width, height }]}>
                <View style={styles.header}>
                  {index < 9 ? (
                    <Text style={styles.text}>00{index + 1} </Text>
                  ) : (
                    <Text style={styles.text}>0{index + 1} </Text>
                  )}
                  <Text style={styles.text}>{item.name.toUpperCase()}</Text>
                </View>
                <Image
                  source={{ uri: item.image }}
                  style={styles.pokemonImage}
                />
                <View style={styles.detailsContainer}>
                  <Text style={styles.details}>Types: {item.types}</Text>
                  <Text style={styles.details}>
                    Abilities: {item.abilities}
                  </Text>
                  <Text style={styles.details}>Height: {item.height}</Text>
                  <Text style={styles.details}>Weight: {item.weight}</Text>
                </View>
              </View>
            )}
            horizontal // Enable horizontal scrolling
            pagingEnabled // Snap to full width
            showsHorizontalScrollIndicator={false} // Hide scroll indicator
          />
        </ImageBackground>
      </ImageBackground>
    </View>
  );
}

export default function Achievements() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Caught Pokémon"
        component={PokedexGlanceScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Detail"
        component={PokemonDetailScreen}
        options={{
          navigationOptions: {
            header: ({ goBack }) => ({
              left: <Left onPress={goBack} />,
            }),
          },
          headerStyle: {
            backgroundColor: "indianred",
          },
          headerTintColor: "white",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "rgba(204,0,0,0.8)",
    padding: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  pokemonItem: {
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
  },
  pokemonImage: {
    flex: 0.5,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  detailsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderColor: "rgba(204,0,0,0.8)",
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  details: {
    fontSize: 14,
    color: "black",
    marginBottom: 8,
  },
  glancepanel: {
    flexDirection: "row",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginTop: 20,
    marginHorizontal: 15,
  },
  glancescreen: {
    flex: 1,
  },
  glanceid: {
    flex: 1,
    fontSize: 25,
    width: 150,
    marginLeft: 10,
    textAlign: "left",
  },
  glancename: {
    flex: 2,
    fontSize: 25,
  },
  glanceimage: {
    flex: 1,
    height: "170%",
    marginBottom: 20,
  },
});
