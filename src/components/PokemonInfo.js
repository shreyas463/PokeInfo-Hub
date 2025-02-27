import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';

const PokemonInfo = ({ pokemon }) => {
  if (!pokemon) return null;

  // Function to get color based on Pokemon type
  const getTypeColor = (type) => {
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
      default: '#777777'
    };
    
    return typeColors[type] || typeColors.default;
  };

  return (
    <Card className="pokemon-info-card">
      <CardContent className="pokemon-info-content">
        <div className="pokemon-header">
          <Typography variant="h4" component="h2" className="pokemon-name">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Typography>
          <Typography variant="h6" component="div" className="pokemon-id">
            #{pokemon.id}
          </Typography>
        </div>
        
        <div className="pokemon-images">
          <div className="sprite-container main-sprite">
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
              alt={pokemon.name}
              className="pokemon-sprite"
            />
          </div>
          <div className="sprite-variants">
            {pokemon.sprites.front_default && (
              <img src={pokemon.sprites.front_default} alt={`${pokemon.name} front`} className="small-sprite" />
            )}
            {pokemon.sprites.back_default && (
              <img src={pokemon.sprites.back_default} alt={`${pokemon.name} back`} className="small-sprite" />
            )}
            {pokemon.sprites.front_shiny && (
              <img src={pokemon.sprites.front_shiny} alt={`${pokemon.name} shiny`} className="small-sprite" />
            )}
          </div>
        </div>
        
        <Grid container spacing={2} className="pokemon-details">
          <Grid item xs={12} sm={6}>
            <Box className="detail-section">
              <Typography variant="h6" className="section-title">Physical</Typography>
              <div className="detail-row">
                <Typography variant="body1" className="detail-label">Height:</Typography>
                <Typography variant="body1" className="detail-value">{pokemon.height / 10}m</Typography>
              </div>
              <div className="detail-row">
                <Typography variant="body1" className="detail-label">Weight:</Typography>
                <Typography variant="body1" className="detail-value">{pokemon.weight / 10}kg</Typography>
              </div>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box className="detail-section">
              <Typography variant="h6" className="section-title">Types</Typography>
              <div className="type-chips">
                {pokemon.types.map((typeInfo, index) => (
                  <Chip 
                    key={index} 
                    label={typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)} 
                    className="type-chip"
                    style={{ backgroundColor: getTypeColor(typeInfo.type.name), color: '#fff' }}
                  />
                ))}
              </div>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box className="detail-section">
              <Typography variant="h6" className="section-title">Abilities</Typography>
              <div className="abilities-list">
                {pokemon.abilities.map((abilityInfo, index) => (
                  <Chip 
                    key={index} 
                    label={abilityInfo.ability.name.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
                    className="ability-chip"
                    variant={abilityInfo.is_hidden ? "outlined" : "filled"}
                  />
                ))}
              </div>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box className="detail-section">
              <Typography variant="h6" className="section-title">Base Stats</Typography>
              <div className="stats-container">
                {pokemon.stats.map((statInfo, index) => (
                  <div key={index} className="stat-row">
                    <Typography variant="body2" className="stat-name">
                      {statInfo.stat.name.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                    </Typography>
                    <div className="stat-bar-container">
                      <div 
                        className="stat-bar" 
                        style={{ 
                          width: `${Math.min(100, (statInfo.base_stat / 255) * 100)}%`,
                          backgroundColor: statInfo.base_stat > 100 ? '#5e81ac' : 
                                          statInfo.base_stat > 70 ? '#81a1c1' : 
                                          statInfo.base_stat > 50 ? '#88c0d0' : '#bf616a'
                        }}
                      ></div>
                      <Typography variant="body2" className="stat-value">
                        {statInfo.base_stat}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PokemonInfo;
