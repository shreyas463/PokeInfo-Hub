import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Box } from '@mui/material';
import SearchBar from './components/SearchBar';
import PokemonInfo from './components/PokemonInfo';
import PokemonCard from './components/PokemonCard';
import backgroundImage from './poke.jpg';

const POKEMON_TCG_API_KEY = 'db932cee-4682-406c-8e11-3c5c32cce377';

function App() {
  const [pokemonData, setPokemonData] = useState(null);
  const [cardData, setCardData] = useState(null);

  const handleSearch = async (searchTerm) => {
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
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Box sx={{ 
          my: 4, 
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          p: 3
        }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Pokemon Info Hub
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Search for Pokemon and their Trading Cards
          </Typography>
        </Box>
        
        <SearchBar onSearch={handleSearch} />
        
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
    </Box>
  );
}

export default App;
