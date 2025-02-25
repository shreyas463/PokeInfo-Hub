import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const PokemonInfo = ({ pokemon }) => {
  if (!pokemon) return null;

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={pokemon.sprites.front_default}
        alt={pokemon.name}
      />
      <CardContent>
        <Typography variant="h5" component="div" sx={{ textTransform: 'capitalize' }}>
          {pokemon.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Height: {pokemon.height / 10}m
          <br />
          Weight: {pokemon.weight / 10}kg
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Types:</Typography>
          {pokemon.types.map((type, index) => (
            <Typography key={index} variant="body2" sx={{ textTransform: 'capitalize' }}>
              {type.type.name}
            </Typography>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Abilities:</Typography>
          {pokemon.abilities.map((ability, index) => (
            <Typography key={index} variant="body2" sx={{ textTransform: 'capitalize' }}>
              {ability.ability.name}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PokemonInfo;
