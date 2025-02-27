/**
 * Utility functions for handling Pokemon sounds
 */

// Cache for audio objects to prevent recreating them
const audioCache = {};

/**
 * Play a Pokemon cry sound
 * @param {number} pokemonId - The Pokemon ID
 * @returns {Promise} - A promise that resolves when the sound starts playing
 */
export const playPokemonCry = (pokemonId) => {
  return new Promise((resolve, reject) => {
    try {
      // Try primary source first
      const primaryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonId}.mp3`;
      
      // Check if we already have this audio in cache
      if (audioCache[primaryUrl]) {
        audioCache[primaryUrl].currentTime = 0;
        audioCache[primaryUrl].play()
          .then(resolve)
          .catch(() => {
            // If primary fails, try backup
            playBackupSound(pokemonId).then(resolve).catch(reject);
          });
      } else {
        // Create new audio object
        const audio = new Audio(primaryUrl);
        audioCache[primaryUrl] = audio;
        
        audio.play()
          .then(resolve)
          .catch(() => {
            // If primary fails, try backup
            playBackupSound(pokemonId).then(resolve).catch(reject);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Play a backup sound if the primary source fails
 * @param {number} pokemonId - The Pokemon ID
 * @returns {Promise} - A promise that resolves when the sound starts playing
 */
const playBackupSound = (pokemonId) => {
  return new Promise((resolve, reject) => {
    try {
      const backupUrl = `https://pokemoncries.com/cries/${pokemonId}.mp3`;
      
      // Check if we already have this audio in cache
      if (audioCache[backupUrl]) {
        audioCache[backupUrl].currentTime = 0;
        audioCache[backupUrl].play()
          .then(resolve)
          .catch(reject);
      } else {
        // Create new audio object
        const audio = new Audio(backupUrl);
        audioCache[backupUrl] = audio;
        
        audio.play()
          .then(resolve)
          .catch(reject);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Play a UI sound effect
 * @param {string} soundType - The type of sound to play (click, success, error)
 */
export const playUISound = (soundType) => {
  let soundUrl;
  
  switch (soundType) {
    case 'click':
      soundUrl = 'https://play.pokemonshowdown.com/audio/sfx/click.mp3';
      break;
    case 'success':
      soundUrl = 'https://play.pokemonshowdown.com/audio/sfx/success.mp3';
      break;
    case 'error':
      soundUrl = 'https://play.pokemonshowdown.com/audio/sfx/error.mp3';
      break;
    default:
      soundUrl = 'https://play.pokemonshowdown.com/audio/sfx/click.mp3';
  }
  
  try {
    // Check if we already have this audio in cache
    if (audioCache[soundUrl]) {
      audioCache[soundUrl].currentTime = 0;
      audioCache[soundUrl].play().catch(console.error);
    } else {
      // Create new audio object
      const audio = new Audio(soundUrl);
      audioCache[soundUrl] = audio;
      audio.volume = 0.5; // Lower volume for UI sounds
      audio.play().catch(console.error);
    }
  } catch (error) {
    console.error('Error playing UI sound:', error);
  }
};

/**
 * Clear the audio cache to free memory
 */
export const clearAudioCache = () => {
  Object.keys(audioCache).forEach(key => {
    audioCache[key].pause();
    audioCache[key].src = '';
  });
  
  // Clear the cache object
  Object.keys(audioCache).forEach(key => {
    delete audioCache[key];
  });
};
