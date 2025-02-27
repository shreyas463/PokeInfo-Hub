import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  IconButton, 
  TextField,
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';

const PokemonSounds = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemonSoundFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Fetch initial Pokémon list
    fetchPokemonList();
  }, []);

  const fetchPokemonList = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch first 151 Pokémon (Gen 1)
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      
      // Get detailed info for each Pokémon to have their images
      const pokemonDetails = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const detailResponse = await axios.get(pokemon.url);
          return {
            id: detailResponse.data.id,
            name: pokemon.name,
            image: detailResponse.data.sprites.other['official-artwork'].front_default,
            soundUrl: `https://play.pokemonshowdown.com/audio/cries/${pokemon.name}.mp3`
          };
        })
      );
      
      setPokemonList(pokemonDetails);
      setFilteredPokemon(pokemonDetails);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
      setError('Failed to load Pokémon sounds. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    if (searchValue === '') {
      setFilteredPokemon(pokemonList);
    } else {
      const filtered = pokemonList.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchValue) || 
        pokemon.id.toString().includes(searchValue)
      );
      setFilteredPokemon(filtered);
    }
  };

  const playSound = (soundUrl, pokemonName) => {
    const audio = new Audio(soundUrl);
    audio.play().catch(error => {
      console.error(`Error playing ${pokemonName} sound:`, error);
      // If the Pokémon Showdown URL fails, try the backup URL
      const backupAudio = new Audio(`https://pokemoncries.com/cries/${pokemonName}.mp3`);
      backupAudio.play().catch(backupError => {
        console.error(`Backup sound also failed for ${pokemonName}:`, backupError);
      });
    });
  };

  const toggleFavorite = (pokemon) => {
    let newFavorites;
    if (favorites.some(fav => fav.id === pokemon.id)) {
      newFavorites = favorites.filter(fav => fav.id !== pokemon.id);
    } else {
      newFavorites = [...favorites, pokemon];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('pokemonSoundFavorites', JSON.stringify(newFavorites));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const displayPokemon = activeTab === 0 ? filteredPokemon : favorites;

  return (
    <Box className="sounds-container">
      <Typography variant="h4" className="section-title" gutterBottom>
        Pokémon Sounds Library
      </Typography>
      
      <Paper className="sounds-tabs-container">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="All Sounds" />
          <Tab label="Favorites" />
        </Tabs>
      </Paper>
      
      <Box className="search-box" mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Pokémon by name or number"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : displayPokemon.length === 0 ? (
        <Typography align="center">
          {activeTab === 0 ? 'No Pokémon found. Try a different search term.' : 'No favorite Pokémon sounds yet.'}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {displayPokemon.map((pokemon) => (
            <Grid item xs={6} sm={4} md={3} key={pokemon.id}>
              <Card className="sound-card">
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" component="div" className="pokemon-name">
                      #{pokemon.id} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    </Typography>
                    <IconButton 
                      onClick={() => toggleFavorite(pokemon)}
                      color="primary"
                      className="favorite-button"
                    >
                      {favorites.some(fav => fav.id === pokemon.id) ? 
                        <FavoriteIcon color="error" /> : 
                        <FavoriteBorderIcon />
                      }
                    </IconButton>
                  </Box>
                  
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    my={2}
                    className="pokemon-image-container"
                  >
                    <img 
                      src={pokemon.image} 
                      alt={pokemon.name} 
                      className="pokemon-sound-image" 
                    />
                  </Box>
                  
                  <Box display="flex" justifyContent="center">
                    <IconButton 
                      onClick={() => playSound(pokemon.soundUrl, pokemon.name)}
                      color="primary"
                      size="large"
                      className="play-sound-button"
                    >
                      <VolumeUpIcon fontSize="large" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PokemonSounds;
