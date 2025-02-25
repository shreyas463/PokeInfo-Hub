import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const PokemonCard = ({ card }) => {
  if (!card) return null;

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="300"
        image={card.images?.small || card.images?.large}
        alt={card.name}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {card.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Set: {card.set?.name}
          <br />
          Rarity: {card.rarity}
        </Typography>
        {card.cardmarket?.prices && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Market Prices:</Typography>
            <Typography variant="body2">
              Average: €{card.cardmarket.prices.averageSellPrice?.toFixed(2) || 'N/A'}
              <br />
              Trend: €{card.cardmarket.prices.trendPrice?.toFixed(2) || 'N/A'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PokemonCard;
