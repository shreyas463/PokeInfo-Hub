import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, Collapse, IconButton } from '@mui/material';
import Pokemon3DViewer from './Pokemon3DViewer';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import { playPokemonCry, playUISound } from '../utils/soundUtils';

// Type color mapping
const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

// Stat color mapping
const statColors = {
  hp: '#FF5959',
  attack: '#F5AC78',
  defense: '#FAE078',
  'special-attack': '#9DB7F5',
  'special-defense': '#A7DB8D',
  speed: '#FA92B2',
};

// Format stat name for display
const formatStatName = (stat) => {
  switch (stat) {
    case 'hp': return 'HP';
    case 'attack': return 'Attack';
    case 'defense': return 'Defense';
    case 'special-attack': return 'Sp. Atk';
    case 'special-defense': return 'Sp. Def';
    case 'speed': return 'Speed';
    default: return stat;
  }
};

const PokemonInfo = ({ pokemon }) => {
  const [show3DViewer, setShow3DViewer] = useState(false);
  
  if (!pokemon) return null;
  
  // Calculate max stat value for the stat bars (usually 255 is the max possible)
  const maxStatValue = 255;
  
  return (
    <Card className="pokemon-info-card">
      <CardContent className="pokemon-info-content">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" className="pokemon-name">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Typography>
          <Box>
            <IconButton 
              color="primary" 
              onClick={() => {
                playPokemonCry(pokemon.id);
                playUISound('click');
              }}
              className="sound-button"
              title="Play Pokémon cry"
            >
              <VolumeUpIcon />
            </IconButton>
            <Button 
              variant="contained" 
              className="view-3d-button"
              startIcon={<ThreeDRotationIcon />}
              onClick={() => setShow3DViewer(!show3DViewer)}
            >
              {show3DViewer ? 'Hide 3D Model' : 'View 3D Model'}
            </Button>
          </Box>
        </Box>
        
        <div className="pokemon-images">
          <div className="sprite-container">
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
              alt={pokemon.name}
              className="pokemon-sprite"
            />
          </div>
          <div className="sprite-variants">
            {pokemon.sprites.front_default && (
              <img 
                src={pokemon.sprites.front_default} 
                alt={`${pokemon.name} front`}
                className="small-sprite"
              />
            )}
            {pokemon.sprites.back_default && (
              <img 
                src={pokemon.sprites.back_default} 
                alt={`${pokemon.name} back`}
                className="small-sprite"
              />
            )}
            {pokemon.sprites.front_shiny && (
              <img 
                src={pokemon.sprites.front_shiny} 
                alt={`${pokemon.name} shiny`}
                className="small-sprite"
              />
            )}
          </div>
        </div>
        
        <Collapse in={show3DViewer} timeout="auto" unmountOnExit>
          <Pokemon3DViewer pokemonId={pokemon.id} pokemonName={pokemon.name} />
        </Collapse>
        
        <Box className="pokemon-details">
          <div className="detail-section">
            <Typography variant="h6" className="section-title">Physical</Typography>
            <div className="detail-row">
              <Typography className="detail-label">Height:</Typography>
              <Typography className="detail-value">{pokemon.height / 10}m</Typography>
            </div>
            <div className="detail-row">
              <Typography className="detail-label">Weight:</Typography>
              <Typography className="detail-value">{pokemon.weight / 10}kg</Typography>
            </div>
          </div>
          
          <div className="detail-section">
            <Typography variant="h6" className="section-title">Types</Typography>
            <div className="type-chips">
              {pokemon.types.map((typeInfo, index) => (
                <Chip 
                  key={index}
                  label={typeInfo.type.name.toUpperCase()}
                  className="type-chip"
                  style={{ 
                    backgroundColor: typeColors[typeInfo.type.name] || '#A8A77A',
                    color: ['normal', 'electric', 'ice', 'ground', 'fairy'].includes(typeInfo.type.name) ? '#2E3440' : 'white'
                  }}
                />
              ))}
            </div>
          </div>
          
          {pokemon.abilities && pokemon.abilities.length > 0 && (
            <div className="detail-section">
              <Typography variant="h6" className="section-title">Abilities</Typography>
              <div className="abilities-list">
                {pokemon.abilities.map((abilityInfo, index) => (
                  <Chip 
                    key={index}
                    label={abilityInfo.ability.name.replace('-', ' ')}
                    className="ability-chip"
                    variant={abilityInfo.is_hidden ? "outlined" : "filled"}
                  />
                ))}
              </div>
            </div>
          )}
          
          {pokemon.stats && pokemon.stats.length > 0 && (
            <div className="detail-section">
              <Typography variant="h6" className="section-title">Base Stats</Typography>
              <div className="stats-container">
                {pokemon.stats.map((statInfo, index) => (
                  <div key={index} className="stat-row">
                    <Typography className="stat-name">
                      {formatStatName(statInfo.stat.name)}:
                    </Typography>
                    <div className="stat-bar-container">
                      <div 
                        className="stat-bar"
                        style={{ 
                          width: `${(statInfo.base_stat / maxStatValue) * 100}%`,
                          backgroundColor: statColors[statInfo.stat.name] || '#A8A77A'
                        }}
                      ></div>
                      <Typography className="stat-value">
                        {statInfo.base_stat}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PokemonInfo;
