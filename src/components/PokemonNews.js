import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Link, 
  CircularProgress, 
  Chip,
  Button
} from '@mui/material';

// Sample news data (in a real app, this would come from an API)
const sampleNewsData = [
  {
    id: 1,
    title: "New Pokémon TCG Set 'Scarlet & Violet—Twilight Masquerade' Announced",
    summary: "The Pokémon Company has announced a new expansion for the Pokémon Trading Card Game called 'Scarlet & Violet—Twilight Masquerade', featuring Ogerpon and other Pokémon from the Kitakami region.",
    date: "2025-02-15",
    imageUrl: "https://assets.pokemon.com/assets/cms2/img/cards/web/SV5/SV5_EN_195.png",
    source: "pokemon.com",
    category: "TCG",
    url: "https://www.pokemon.com/us/pokemon-tcg"
  },
  {
    id: 2,
    title: "Pokémon Horizons: The Series Coming to Netflix",
    summary: "The newest Pokémon animated series, Pokémon Horizons: The Series, will be available on Netflix starting next month, following the adventures of dual protagonists Liko and Roy.",
    date: "2025-02-10",
    imageUrl: "https://assets.pokemon.com/assets/cms2/img/watch-pokemon-tv/seasons/season25/season25_ep01_ss01.jpg",
    source: "netflix.com",
    category: "TV Show",
    url: "https://www.netflix.com"
  },
  {
    id: 3,
    title: "Pokémon GO Announces Spring Festival Event",
    summary: "Niantic has announced the upcoming Spring Festival event for Pokémon GO, featuring special spring-themed Pokémon, bonuses, and research tasks.",
    date: "2025-02-05",
    imageUrl: "https://assets.pokemon.com/assets/cms2/img/video-games/_tiles/pokemon-go/02142022/pokemon-go-169.jpg",
    source: "pokemongolive.com",
    category: "Mobile Game",
    url: "https://pokemongolive.com"
  },
  {
    id: 4,
    title: "New Legendary Pokémon Revealed for Scarlet and Violet DLC",
    summary: "Game Freak has revealed a new Legendary Pokémon that will be featured in the upcoming DLC for Pokémon Scarlet and Violet. The new Pokémon is said to have unique abilities never seen before.",
    date: "2025-01-28",
    imageUrl: "https://assets.pokemon.com/assets/cms2/img/video-games/_tiles/pokemon-scarlet-violet/12152022/pokemon-scarlet-violet-169-en.jpg",
    source: "pokemon.com",
    category: "Video Game",
    url: "https://scarletviolet.pokemon.com/"
  },
  {
    id: 5,
    title: "Pokémon TCG Live Global Launch Date Announced",
    summary: "The Pokémon Company has announced the global launch date for Pokémon TCG Live, the new digital platform for playing the Pokémon Trading Card Game online.",
    date: "2025-01-20",
    imageUrl: "https://assets.pokemon.com/assets/cms2/img/video-games/_tiles/pokemon-tcg-live/10132022/pokemon-tcg-live-169.jpg",
    source: "pokemon.com",
    category: "TCG",
    url: "https://www.pokemon.com/us/pokemon-tcg-live"
  }
];

function PokemonNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  useEffect(() => {
    // In a real app, you would fetch news from an API
    // For now, we'll use the sample data
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNews(sampleNewsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  // Get unique categories for filter
  const categories = ['All', ...new Set(sampleNewsData.map(item => item.category))];
  
  // Filter news by category
  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter(item => item.category === selectedCategory);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box className="news-container">
      <Typography variant="h4" className="news-title">
        Pokémon News
      </Typography>
      
      <Box className="category-filter">
        <Typography variant="subtitle1" className="filter-label">
          Filter by Category:
        </Typography>
        <Box className="category-chips">
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryChange(category)}
              color={selectedCategory === category ? "primary" : "default"}
              variant={selectedCategory === category ? "filled" : "outlined"}
              className="category-chip"
            />
          ))}
        </Box>
      </Box>
      
      {loading ? (
        <Box className="loading-container">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} className="news-grid">
          {filteredNews.map(item => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card className="news-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.title}
                  className="news-image"
                />
                <CardContent>
                  <Chip 
                    label={item.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    className="news-category-tag"
                  />
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    className="news-date"
                  >
                    {formatDate(item.date)}
                  </Typography>
                  
                  <Typography variant="h6" className="news-title">
                    {item.title}
                  </Typography>
                  
                  <Typography variant="body2" className="news-summary">
                    {item.summary}
                  </Typography>
                  
                  <Box className="news-footer">
                    <Typography variant="caption" color="text.secondary">
                      Source: {item.source}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      component={Link}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="read-more-button"
                    >
                      Read More
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default PokemonNews;
