import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, FormControl, Select, MenuItem, Paper, Typography, Tabs, Tab, Box } from '@mui/material';
import PokemonInfo from './components/PokemonInfo';
import PokemonCard from './components/PokemonCard';
import PokemonQuiz from './components/PokemonQuiz';
import PokemonNews from './components/PokemonNews';
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
  const [activeTab, setActiveTab] = useState(0);
  const [showSearchBox, setShowSearchBox] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError(null);
    setPokemonData(null);
    setCardData(null);

    try {
      if (displayOption === 'both' || displayOption === 'pokemon') {
        const pokemonResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
        );
        setPokemonData(pokemonResponse.data);
      }

      if (displayOption === 'both' || displayOption === 'card') {
        const cardResponse = await axios.get(
          `https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}*&orderBy=name`,
          {
            headers: {
              'X-Api-Key': POKEMON_TCG_API_KEY
            }
          }
        );
        
        if (cardResponse.data.data && cardResponse.data.data.length > 0) {
          setCardData(cardResponse.data);
        } else {
          setError('No trading cards found for this Pokemon.');
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Pokemon not found. Please check the spelling and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setShowSearchBox(false);
    setPokemonData(null);
    setCardData(null);
    setError(null);
  };

  const toggleSearchBox = () => {
    setShowSearchBox(!showSearchBox);
  };

  return (
    <div className="App">
      <img src={backgroundImage} alt="Background" className="background-image" />
      <div className="content-wrapper">
        <Container>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            className="navigation-tabs"
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Quiz" />
            <Tab label="News" />
          </Tabs>

          <Box 
            className="search-prompt"
            onClick={toggleSearchBox}
          >
            <Typography variant="h5" className="search-prompt-text">
              Click here to search for Pokémon
            </Typography>
          </Box>

          {showSearchBox && (
            <Paper className="search-container">
              <div className="title-container">
                <img src={pokeball} alt="Pokeball" className="pokeball-logo" />
                <Typography variant="h5" className="app-title">PokeInfo Hub</Typography>
              </div>
              
              <form onSubmit={handleSearch} className="search-form">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Enter Pokemon Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  size="small"
                />
                
                <FormControl fullWidth variant="outlined" size="small" className="display-option">
                  <Select
                    value={displayOption}
                    onChange={(e) => setDisplayOption(e.target.value)}
                  >
                    <MenuItem value="both">Show Both</MenuItem>
                    <MenuItem value="pokemon">Pokemon Info Only</MenuItem>
                    <MenuItem value="card">Trading Cards Only</MenuItem>
                  </Select>
                </FormControl>
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  className="search-button"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </form>
            </Paper>
          )}

          <div className="results-container">
            {error && (
              <Paper className="error-container">
                <Typography variant="body1">{error}</Typography>
              </Paper>
            )}

            {activeTab === 0 ? (
              <PokemonQuiz />
            ) : activeTab === 1 ? (
              <PokemonNews />
            ) : null}

            {pokemonData && displayOption !== 'card' && (
              <PokemonInfo pokemon={pokemonData} />
            )}
            
            {cardData && displayOption !== 'pokemon' && (
              <div className="cards-container">
                <Typography variant="h5" className="results-title">
                  {cardData.data && cardData.data.length > 0 
                    ? `Found ${cardData.count} Trading Cards` 
                    : 'No Trading Cards Found'}
                </Typography>
                
                {cardData.data && cardData.data.map((card) => (
                  <PokemonCard key={card.id} card={card} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default App;
