import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, FormControl, Select, MenuItem, Paper, Typography, Tabs, Tab, Box, Grid } from '@mui/material';
import PokemonInfo from './components/PokemonInfo';
import PokemonCard from './components/PokemonCard';
import PokemonQuiz from './components/PokemonQuiz';
import PokemonNews from './components/PokemonNews';
import backgroundImage from './backgrounpoke.jpg';
import pokeballIcon from './assets/pokeball.svg';
import './App.css';

const POKEMON_TCG_API_KEY = 'db932cee-4682-406c-8e11-3c5c32cce377';

function App() {
  const [pokemonData, setPokemonData] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayOption, setDisplayOption] = useState('both');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showNews, setShowNews] = useState(false);

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
          `https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}`,
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
      
      setShowSearchBox(false);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Pokemon not found. Please check the spelling and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Hide all components first
    setShowQuiz(false);
    setShowNews(false);
    setPokemonData(null);
    setCardData(null);
    setShowSearchBox(false);
    
    // Show only the selected component
    if (newValue === 'quiz') {
      setShowQuiz(true);
    } else if (newValue === 'news') {
      setShowNews(true);
    } else {
      // Default tab - show search prompt
      setShowSearchBox(false);
    }
  };

  const toggleSearchBox = () => {
    // If showing search box, just toggle it
    if (showSearchBox) {
      setShowSearchBox(false);
      return;
    }
    
    // If not showing search box, hide other components first
    setShowQuiz(false);
    setShowNews(false);
    
    // Then show the search box
    setShowSearchBox(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
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
            <Tab label="Quiz" value="quiz" />
            <Tab label="News" value="news" />
          </Tabs>

          {/* Always show search prompt */}
          <Box 
            className="search-prompt"
            onClick={toggleSearchBox}
          >
            <Typography variant="h5" className="search-prompt-text">
              <img src={pokeballIcon} alt="Pokeball" className="search-prompt-icon" />
              Click here to search for Pokémon
            </Typography>
          </Box>

          {showSearchBox && (
            <Paper className="search-container">
              <div className="title-container">
                <img src={pokeballIcon} alt="Pokeball" className="pokeball-logo" />
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

            {showQuiz && (
              <PokemonQuiz />
            )}
            
            {showNews && (
              <PokemonNews />
            )}

            {/* Only show search results if not showing Quiz or News */}
            {(pokemonData || cardData) && !showQuiz && !showNews && (
              <Box className="search-results">
                <Box className="search-results-header">
                  <Typography variant="h5" className="results-title">
                    Search Results for "{searchTerm}"
                  </Typography>
                  <div className="header-buttons">
                    <Button 
                      variant="contained" 
                      className="search-again-button"
                      onClick={toggleSearchBox}
                    >
                      Search Again
                    </Button>
                    <Button 
                      variant="contained" 
                      className="navigation-button top-button"
                      onClick={scrollToTop}
                    >
                      Top ↑
                    </Button>
                    <Button 
                      variant="contained" 
                      className="navigation-button bottom-button"
                      onClick={scrollToBottom}
                    >
                      Bottom ↓
                    </Button>
                  </div>
                </Box>
                
                <Grid container spacing={3}>
                  {pokemonData && displayOption !== 'card' && (
                    <Grid item xs={12} md={cardData && displayOption !== 'pokemon' ? 6 : 12}>
                      <PokemonInfo pokemon={pokemonData} />
                    </Grid>
                  )}
                  
                  {cardData && displayOption !== 'pokemon' && (
                    <Grid item xs={12} md={pokemonData && displayOption !== 'card' ? 6 : 12}>
                      <div className="cards-container">
                        <Typography variant="h6" className="cards-title">
                          {cardData.data && cardData.data.length > 0 
                            ? `Found ${cardData.count} Trading Cards` 
                            : 'No Trading Cards Found'}
                        </Typography>
                        
                        {cardData.data && cardData.data.map((card, index) => (
                          <PokemonCard key={index} card={card} />
                        ))}
                      </div>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </div>
        </Container>
        
        {/* Floating navigation buttons - only show when search results are visible */}
        {(pokemonData || cardData) && !showQuiz && !showNews && (
          <div className="floating-nav">
            <Button 
              variant="contained" 
              className="floating-nav-button"
              onClick={scrollToTop}
            >
              ↑ Top
            </Button>
            <Button 
              variant="contained" 
              className="floating-nav-button"
              onClick={scrollToBottom}
            >
              ↓ Bottom
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
