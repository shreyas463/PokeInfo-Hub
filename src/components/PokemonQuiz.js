import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  Card, 
  CardContent,
  CircularProgress,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

// Quiz questions with multiple choice answers
const quizQuestions = [
  {
    question: "Which Pokémon is known as the 'Flame Pokémon'?",
    options: ["Charizard", "Flareon", "Moltres", "Charmander"],
    correctAnswer: "Charizard, Flareon, Moltres, Charmander"
  },
  {
    question: "Which of these Pokémon types was introduced in Generation II?",
    options: ["Dark", "Fairy", "Steel", "Dragon"],
    correctAnswer: "Dark"
  },
  {
    question: "Which Pokémon has the Pokédex number #001?",
    options: ["Pikachu", "Bulbasaur", "Charmander", "Squirtle"],
    correctAnswer: "Bulbasaur"
  },
  {
    question: "Which item is used to evolve Pikachu into Raichu?",
    options: ["Thunder Stone", "Moon Stone", "Fire Stone", "Leaf Stone"],
    correctAnswer: "Thunder Stone"
  },
  {
    question: "Which Pokémon can learn the move 'Splash', which has no effect in battle?",
    options: ["Magikarp", "Gyarados", "Goldeen", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    question: "Which of these Pokémon is NOT a Legendary?",
    options: ["Articuno", "Suicune", "Dragonite", "Entei"],
    correctAnswer: "Dragonite"
  },
  {
    question: "Who is the creator of Pokémon?",
    options: ["Shigeru Miyamoto", "Satoshi Tajiri", "Junichi Masuda", "Ken Sugimori"],
    correctAnswer: "Satoshi Tajiri"
  }
];

function PokemonQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [randomPokemonImage, setRandomPokemonImage] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Load a random Pokemon image for each question
  useEffect(() => {
    if (showScore) return;
    
    const fetchRandomPokemon = async () => {
      setLoading(true);
      try {
        // Get a random Pokemon ID (1-898)
        const randomId = Math.floor(Math.random() * 898) + 1;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        setRandomPokemonImage(response.data.sprites.other['official-artwork'].front_default);
      } catch (error) {
        console.error('Error fetching random Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPokemon();
  }, [currentQuestion, showScore]);

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isAnswerCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    
    if (isAnswerCorrect) {
      setScore(score + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    
    setShowFeedback(true);
    
    // Show feedback for 1.5 seconds before moving to next question
    setTimeout(() => {
      setShowFeedback(false);
      
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizQuestions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer('');
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setShowScore(false);
    setShowFeedback(false);
  };

  return (
    <Box className="quiz-container">
      <Typography variant="h4" className="quiz-title">
        Pokémon Trivia Quiz
      </Typography>
      
      {showScore ? (
        <Card className="score-card">
          <CardContent>
            <Typography variant="h5" className="score-title">
              Quiz Complete!
            </Typography>
            <Typography variant="h6" className="final-score">
              Your Score: {score} out of {quizQuestions.length}
            </Typography>
            <Typography variant="body1" className="score-message">
              {score === quizQuestions.length 
                ? "Perfect score! You're a true Pokémon Master!" 
                : score >= quizQuestions.length / 2 
                  ? "Great job! You know your Pokémon well!" 
                  : "Keep training to become a Pokémon Master!"}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={restartQuiz}
              className="restart-button"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="question-card">
          <CardContent>
            <Box className="progress-container">
              <Typography variant="body2">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(currentQuestion / quizQuestions.length) * 100} 
                className="quiz-progress"
              />
            </Box>
            
            {loading ? (
              <Box className="loading-container">
                <CircularProgress />
              </Box>
            ) : randomPokemonImage && (
              <Box className="pokemon-image-container">
                <img 
                  src={randomPokemonImage} 
                  alt="Random Pokémon" 
                  className="quiz-pokemon-image" 
                />
              </Box>
            )}
            
            <Typography variant="h6" className="question-text">
              {quizQuestions[currentQuestion].question}
            </Typography>
            
            <FormControl component="fieldset" className="options-container">
              <RadioGroup
                value={selectedAnswer}
                onChange={handleAnswerSelect}
              >
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                    className="answer-option"
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="submit-answer-button"
            >
              Submit Answer
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Snackbar 
        open={showFeedback} 
        autoHideDuration={1500}
      >
        <Alert 
          severity={isCorrect ? "success" : "error"} 
          variant="filled"
        >
          {isCorrect 
            ? "Correct! Well done!" 
            : `Incorrect. The right answer is ${quizQuestions[currentQuestion].correctAnswer}.`}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PokemonQuiz;
