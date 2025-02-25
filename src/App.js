import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Box, TextField, Button } from '@mui/material';
import SearchBar from './components/SearchBar';
import PokemonInfo from './components/PokemonInfo';
import PokemonCard from './components/PokemonCard';
import './App.css';

const POKEMON_TCG_API_KEY = 'db932cee-4682-406c-8e11-3c5c32cce377';

function App() {
  const [pokemonData, setPokemonData] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    try {
      // Fetch Pokemon data from PokeAPI
      const pokemonResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      );
      setPokemonData(pokemonResponse.data);

      // Fetch card data from Pokemon TCG API
      const cardResponse = await axios.get(
        `https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}`,
        {
          headers: {
            'X-Api-Key': POKEMON_TCG_API_KEY
          }
        }
      );
      if (cardResponse.data.data && cardResponse.data.data.length > 0) {
        setCardData(cardResponse.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <div className="search-container">
        <h1>Pokemon Info Hub</h1>
        <form onSubmit={handleSearch}>
          <TextField
            className="search-box"
            variant="outlined"
            placeholder="Search for Pokemon and their Trading Cards"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <Button
            className="search-button"
            type="submit"
            variant="contained"
          >
            Search
          </Button>
        </form>
      </div>

      {(pokemonData || cardData) && (
        <Container maxWidth="lg" sx={{ mt: 4, bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, p: 3 }}>
          <Grid container spacing={3}>
            {pokemonData && (
              <Grid item xs={12} md={6}>
                <PokemonInfo pokemon={pokemonData} />
              </Grid>
            )}
            {cardData && (
              <Grid item xs={12} md={6}>
                <PokemonCard card={cardData} />
              </Grid>
            )}
          </Grid>
        </Container>
      )}
    </div>
  );
}

export default App;
