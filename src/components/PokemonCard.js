import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

function PokemonCard({ cards }) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="cards-container">
      {cards.map((card, index) => (
        <Card key={index} className="pokemon-card">
          <CardContent className="card-content">
            <div className="card-image-container">
              <img 
                src={card.images.large} 
                alt={card.name}
                className="card-image"
              />
            </div>
            <div className="card-details">
              <div className="card-header">
                <Typography variant="h5" component="h2" className="card-title">
                  {card.name} {card.supertype && `(${card.supertype})`}
                </Typography>
                <Chip label={`HP: ${card.hp || 'N/A'}`} color="primary" className="hp-chip" />
              </div>

              <Typography className="card-type">
                Type: {card.types ? card.types.join(', ') : 'Colorless'}
              </Typography>

              {card.abilities && card.abilities.map((ability, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Ability: {ability.name}
                  </Typography>
                  <Typography variant="body2">
                    {ability.text}
                  </Typography>
                </Box>
              ))}

              {card.attacks && card.attacks.map((attack, i) => (
                <Box key={i} className="attack-box">
                  <div className="attack-header">
                    <Typography variant="subtitle1" className="attack-name">
                      Attack: {attack.name} {attack.damage && `- ${attack.damage}`}
                    </Typography>
                    {attack.damage && (
                      <Chip 
                        label={attack.damage} 
                        size="small" 
                        className="damage-chip"
                      />
                    )}
                  </div>
                  <Typography className="attack-cost">
                    Cost: {attack.cost ? attack.cost.join(', ') : 'None'}
                  </Typography>
                  {attack.text && (
                    <Typography className="attack-effect">
                      Effect: {attack.text}
                    </Typography>
                  )}
                </Box>
              ))}

              {card.weaknesses && (
                <div className="weakness-section">
                  <Typography className="weakness-text">
                    Weaknesses: {card.weaknesses.map(w => `${w.type} (${w.value})`).join(', ')}
                  </Typography>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default PokemonCard;
