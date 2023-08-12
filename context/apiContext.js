import { createContext, useState, useEffect } from 'react';

export const ApiContext = createContext();



export const ApiProvider = ({ children }) => {
    const [pokeData, setPokeData] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState([]);
    const [pokemonImage, setPokemonImage] = useState([]);

    const catchPokemon = () => {
        // Select a random Pokémon from the results
        const randomIndex = Math.floor(Math.random() * pokeData.length);
        const selected = pokeData[randomIndex];
        setSelectedPokemon(selected);
    
        fetch(selected.url)
            .then((response) => response.json())
            .then((data) => {
                setPokemonImage(data.sprites.front_default);
            });
    }

    return (
        <ApiContext.Provider value={{pokeData, setPokeData, selectedPokemon, setSelectedPokemon, catchPokemon, pokemonImage, setPokemonImage}}>
            {children}
        </ApiContext.Provider>
    )
}

