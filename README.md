# PokeInfo Hub

A modern web application that serves as your comprehensive Pokémon information center. This interactive platform allows users to search and explore Pokémon cards, view detailed information about different Pokémon, discover their characteristics and abilities, enjoy interactive quizzes, stay updated with Pokémon news, and experience Pokémon sounds.

<img width="1512" alt="Screenshot 2025-02-27 at 2 39 32 AM" src="https://github.com/user-attachments/assets/73bcddfa-2fc1-4849-a224-d5254affbb3f" />



## Features

### Pokémon Search
- Search for Pokémon by name
- View detailed information including stats, types, and abilities
- See 3D models of Pokémon
- Play Pokémon cries when viewing details
- Option to display both Pokémon info and trading cards

### Trading Cards
- Browse Pokémon trading cards
- View card details including rarity, set information, and market prices
- Direct links to purchase cards from TCGPlayer
- Filter cards by various criteria

### Pokémon Quiz
- Test your Pokémon knowledge with interactive quizzes
- Questions about Pokémon types, abilities, and characteristics
- Score tracking and feedback

### Pokémon News
- Stay updated with the latest Pokémon news
- Filter news by category (TCG, TV Show, Video Games, Mobile Games)
- Read detailed articles with images

### Sounds Library
- Browse and play Pokémon cries
- Create a favorites list of your preferred Pokémon sounds
- Search for specific Pokémon sounds
- Interactive sound buttons throughout the application

### UI Features
- Modern, responsive design with Material-UI
- Dark theme with Pokémon-themed styling
- Smooth animations and transitions
- Easy navigation with tabs and floating buttons
- Mobile-friendly layout

## Tools & Technologies Used

- **React.js** - Frontend framework
- **Material-UI (MUI)** - UI component library
- **Pokémon TCG API** - For fetching Pokémon card data
- **PokéAPI** - For fetching Pokémon information
- **Axios** - HTTP client for API requests
- **Web Audio API** - For playing Pokémon cries and sound effects
- **Local Storage** - For saving user preferences and favorites

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pokeinfo-hub.git
cd pokeinfo-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

- **Search for Pokémon**: Click on the search prompt and enter a Pokémon name
- **View Trading Cards**: Search for a Pokémon and select the "Show Both" or "Cards Only" option
- **Take a Quiz**: Click on the "Quiz" tab to test your Pokémon knowledge
- **Read News**: Click on the "News" tab to browse the latest Pokémon news
- **Explore Sounds**: Click on the "Sounds" tab to browse and play Pokémon cries
- **Play Sounds**: Click on the speaker icon next to any Pokémon to hear its cry

## API Keys

The application uses the following APIs:
- Pokémon TCG API: A free API key is included, but for production use, please obtain your own from [Pokémon TCG Developers](https://dev.pokemontcg.io/)
- PokéAPI: No API key required

## License

This project is licensed under the MIT License - see the LICENSE file for details.
