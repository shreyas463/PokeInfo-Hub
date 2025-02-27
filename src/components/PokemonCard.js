import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, Collapse, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function PokemonCard({ cards }) {
  const [expandedCards, setExpandedCards] = useState({});
  
  if (!cards || cards.length === 0) return null;
  
  const toggleCardExpand = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getPriceInfo = (card) => {
    if (!card.cardmarket || !card.cardmarket.prices) {
      return { available: false };
    }
    
    return {
      available: true,
      averageSellPrice: card.cardmarket.prices.averageSellPrice,
      lowPrice: card.cardmarket.prices.lowPrice,
      trendPrice: card.cardmarket.prices.trendPrice,
      url: card.cardmarket.url
    };
  };

  const getTCGPlayerInfo = (card) => {
    if (!card.tcgplayer || !card.tcgplayer.prices) {
      return { available: false };
    }
    
    return {
      available: true,
      prices: card.tcgplayer.prices,
      url: card.tcgplayer.url
    };
  };

  return (
    <div className="cards-container">
      {cards.map((card, index) => {
        const priceInfo = getPriceInfo(card);
        const tcgPlayerInfo = getTCGPlayerInfo(card);
        const isExpanded = expandedCards[index] || false;
        
        return (
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
                    {card.name}
                  </Typography>
                  <Chip label={`HP: ${card.hp || 'N/A'}`} color="primary" className="hp-chip" />
                </div>

                <Typography className="card-type">
                  Type: {card.types ? card.types.join(', ') : 'Colorless'}
                </Typography>

                <div className="card-actions">
                  <IconButton 
                    onClick={() => toggleCardExpand(index)}
                    aria-expanded={isExpanded}
                    aria-label="show more"
                    className="expand-button"
                  >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    <Typography variant="button" className="expand-text">
                      {isExpanded ? 'Show Less' : 'Show Details'}
                    </Typography>
                  </IconButton>
                </div>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <div className="card-expanded-content">
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
                            Attack: {attack.name}
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
                </Collapse>
                
                <div className="price-section">
                  <Typography variant="h6" className="price-title">
                    Price Information
                  </Typography>
                  
                  {priceInfo.available ? (
                    <div className="price-info">
                      <div className="price-row">
                        <Typography className="price-label">Average Price:</Typography>
                        <Typography className="price-value">€{priceInfo.averageSellPrice?.toFixed(2) || 'N/A'}</Typography>
                      </div>
                      <div className="price-row">
                        <Typography className="price-label">Lowest Price:</Typography>
                        <Typography className="price-value">€{priceInfo.lowPrice?.toFixed(2) || 'N/A'}</Typography>
                      </div>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<ShoppingCartIcon />}
                        className="buy-button cardmarket-button"
                        href={priceInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        Buy on CardMarket
                      </Button>
                    </div>
                  ) : (
                    <Typography className="no-price-info">
                      No CardMarket price information available
                    </Typography>
                  )}
                  
                  {tcgPlayerInfo.available && (
                    <div className="tcgplayer-info">
                      <Typography variant="subtitle1" className="tcgplayer-title">
                        TCGPlayer Prices:
                      </Typography>
                      <div className="tcgplayer-price-summary">
                        {Object.entries(tcgPlayerInfo.prices).slice(0, 1).map(([category, data]) => (
                          <div key={category} className="tcgplayer-category">
                            <Typography className="category-name">
                              {category.charAt(0).toUpperCase() + category.slice(1)}:
                            </Typography>
                            <div className="price-details">
                              {data.low && (
                                <Typography className="price-detail">
                                  Low: ${data.low.toFixed(2)}
                                </Typography>
                              )}
                              {data.market && (
                                <Typography className="price-detail">
                                  Market: ${data.market.toFixed(2)}
                                </Typography>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        startIcon={<ShoppingCartIcon />}
                        className="buy-button tcgplayer-button"
                        href={tcgPlayerInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        Buy on TCGPlayer
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default PokemonCard;
