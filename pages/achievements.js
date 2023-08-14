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
                        <View style={styles.header}>
                            <Text style={styles.text}>{index + 1}. {item.name.toUpperCase()}</Text>
                        </View>
                        <Image source={{ uri: item.image }} style={styles.pokemonImage} />
                        <View style={styles.detailsContainer}>
                            <Text style={styles.details}>Types: {item.types}</Text>
                            <Text style={styles.details}>Abilities: {item.abilities}</Text>
                            <Text style={styles.details}>Height: {item.height}</Text>
                            <Text style={styles.details}>Weight: {item.weight}</Text>
                        </View>
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
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        backgroundColor: '#cc0000',
        padding: 10,
        alignItems: 'center',
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    pokemonItem: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
    },
    pokemonImage: {
        width: '60%',
        height: '40%',
        borderRadius: 10,
    },
    detailsContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        marginTop: 16,
        shadowColor: '#000',
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
        color: 'black',
        marginBottom: 8,
    },
});
