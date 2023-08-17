import { View, Text } from "react-native";
import { ApiContext } from "../context/apiContext";
import { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, ScrollView, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
export default function Player({navigation}){
    const {playerHealth, healPlayer, inventory, deleteBerry} = useContext(ApiContext);
    const [berries, setBerries] = useState([])

    const heartIcon = require('../assets/pngwingHeart.com.png'); 
    const playerIcon = require('../assets/PlayerSprite.png')

    useEffect(()=> {
        const fetchBerry = async()=> {
            const berryDetalsTemp = [];
            for (const berry of inventory) {
                const response = await fetch(`https://pokeapi.co/api/v2/berry/${berry}/`)
                const data = await response.json();
                let newBerry = {"name": data.name, "image": 
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berries/${data.name}-berry.png`}
                berryDetalsTemp.push(newBerry)
            }
            setBerries(berryDetalsTemp);
            console.log(berryDetalsTemp)
        };
        
        fetchBerry();
    }, [inventory])

    return(
        <View style={styles.container}>
        <View style={styles.playerContainer}>
            <Text style={styles.playerHealth}> |
            {Array.from({ length: playerHealth }).map((_, index) => (
            <Image key={index} source={heartIcon} style={styles.heartIcon} />
          ))}|
          </Text>
        </View>
        <Image source={playerIcon} style={styles.PlayerImage} />
        <View style={{flex: 2}}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
          <View style={styles.tasksWrapper}>
            {berries.map((item, index) => (
              <TouchableOpacity key={index} onPress={()=> {healPlayer(); deleteBerry(index);}}>
                <View style={styles.berryContainer}>
                  <Text style={styles.berryName}>{item.name.toUpperCase()}</Text>
                  <Image source={{ uri: item.image }} style={styles.berryImage} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FF87B2',
      padding: 20,
    },
    playerContainer: {
      flex: 0.4,
      flexDirection: 'row',
      justifyContent: 'center',
      // marginBottom: 20,
    },
    playerHealth: {
      fontSize: 20,
      fontWeight: 'bold',
      padding: 10,
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: "space-evenly",
    },
    tasksWrapper: {},
    berryContainer: {
      backgroundColor: '#FFE898',
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    berryName: {
      flex: 1,
      fontSize: 16,
      marginRight: 10,
    },
    berryImage: {
      width: 60,
      height: 60,
      resizeMode: "contain",
    },
    PlayerImage: {
      flex: 1,
      resizeMode: "contain",
      // width: 120,
      // height: 220,
      alignSelf: 'center',
    },
    heartIcon: {
        width: 30,
        height: 30,
        resizeMode: 'cover'
    },
  });