import React, { useState } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, Button, FormControl, Select, MenuItem } from '@mui/material';
import PokemonInfo from './components/PokemonInfo';
import PokemonCard from './components/PokemonCard';
import backgroundImage from './backgrounpoke.jpg';
import pokeball from './pokeball.jpeg';
import './App.css';

const POKEMON_TCG_API_KEY = 'db932cee-4682-406c-8e11-3c5c32cce377';

function App() {
  const [pokemonData, setPokemonData] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayOption, setDisplayOption] = useState('both');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError(null);
    setPokemonData(null);
    setCardData(null);

    try {
      if (displayOption === 'both' || displayOption === 'pokemon') {
        // Fetch Pokemon data from PokeAPI
        const pokemonResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
        );
        setPokemonData(pokemonResponse.data);
      }

      if (displayOption === 'both' || displayOption === 'card') {
        // Fetch card data from Pokemon TCG API
        const cardResponse = await axios.get(
          `https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}`,
          {
            headers: {
              'X-Api-Key': POKEMON_TCG_API_KEY
            }
          }
        );
        setCardData(cardResponse.data.data[0]);
      }
    } catch (err) {
      setError('Pokemon not found. Please try another search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <img src={backgroundImage} alt="Pokemon Background" className="background-image" />
      <div className="content-wrapper">
        <div className="search-container">
          <div className="title-container">
            <img src={pokeball} alt="Pokeball" className="pokeball-logo" />
            <h1>Pokemon Info Hub</h1>
          </div>
          <form onSubmit={handleSearch} className="search-form">
            <TextField
              className="search-box"
              variant="outlined"
              placeholder="Search for Pokemon and their Trading Cards"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small" className="display-select">
              <Select
                value={displayOption}
                onChange={(e) => setDisplayOption(e.target.value)}
                displayEmpty
              >
                <MenuItem value="both">Show Both</MenuItem>
                <MenuItem value="pokemon">Pokemon Info Only</MenuItem>
                <MenuItem value="card">Trading Card Only</MenuItem>
              </Select>
            </FormControl>
            <Button
              className="search-button"
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        {(pokemonData || cardData) && (
          <Container maxWidth="lg" sx={{ mt: 4, bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, p: 3 }}>
            <Grid container spacing={3}>
              {pokemonData && displayOption !== 'card' && (
                <Grid item xs={12} md={6}>
                  <PokemonInfo pokemon={pokemonData} />
                </Grid>
              )}
              {cardData && displayOption !== 'pokemon' && (
                <Grid item xs={12} md={6}>
                  <PokemonCard card={cardData} />
                </Grid>
              )}
            </Grid>
          </Container>
        )}
      </div>
    </div>
  );
}

export default App;
