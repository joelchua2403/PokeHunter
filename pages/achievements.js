import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions } from 'react-native';
import { useContext } from 'react';
import { ApiContext } from '../context/apiContext';

export default function Achievements() {
    const { capturedPokemon } = useContext(ApiContext);
    const { width, height } = Dimensions.get('window'); // Get the screen dimensions
    const [pokemonWithDetails, setPokemonWithDetails] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            const pokemonWithDetailsTemp = [];
            for (const pokemon of capturedPokemon) {
                const response = await fetch(pokemon.url);
                const data = await response.json();
                pokemonWithDetailsTemp.push({
                    name: pokemon.name,
                    image: data.sprites.front_default,
                    types: data.types.map(t => t.type.name).join(', '),
                    abilities: data.abilities.map(a => a.ability.name).join(', '),
                    height: data.height,
                    weight: data.weight,
                });
            }
            setPokemonWithDetails(pokemonWithDetailsTemp);
        };

        fetchDetails();
    }, [capturedPokemon]);

    return (
        <View style={styles.container}>
            <FlatList
                data={pokemonWithDetails}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={[styles.pokemonItem, { width, height }]}>
                        <Text style={styles.text}>{index + 1}. {item.name}</Text>
                        <Image source={{ uri: item.image }} style={styles.pokemonImage} />
                        <Text style={styles.details}>Types: {item.types}</Text>
                        <Text style={styles.details}>Abilities: {item.abilities}</Text>
                        <Text style={styles.details}>Height: {item.height}</Text>
                        <Text style={styles.details}>Weight: {item.weight}</Text>
                    </View>
                )}
                horizontal // Enable horizontal scrolling
                pagingEnabled // Snap to full width
                showsHorizontalScrollIndicator={false} // Hide scroll indicator
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    pokemonItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pokemonImage: {
        width: '70%', // You can adjust these as needed
        height: '50%',
    },
    details: {
        fontSize: 14,
        color: 'gray',
    },
});
