import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Html, Billboard, useTexture } from '@react-three/drei';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import * as THREE from 'three';

// Model component that displays a Pokemon using its sprite
function PokemonModel({ pokemonId, scale = 1 }) {
  const modelRef = useRef();
  const [spriteUrl, setSpriteUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Animate rotation
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });
  
  // Load the Pokemon sprite
  useEffect(() => {
    if (!pokemonId) return;
    
    setLoading(true);
    setError(null);
    
    // Get the official artwork from PokeAPI
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    
    // Check if the sprite exists
    fetch(spriteUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          setSpriteUrl(spriteUrl);
        } else {
          // Fallback to regular sprite if official artwork is not available
          const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
          setSpriteUrl(fallbackUrl);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading Pokemon sprite:', err);
        setError('Could not load Pokemon image');
        setLoading(false);
      });
  }, [pokemonId]);
  
  // If still loading or error, show nothing
  if (loading || error || !spriteUrl) {
    return null;
  }
  
  return (
    <group ref={modelRef} scale={[scale, scale, scale]}>
      <SpritePlane url={spriteUrl} />
    </group>
  );
}

// Component to display a sprite on a billboard (always facing camera)
function SpritePlane({ url }) {
  const texture = useTexture(url);
  
  // Make the texture have transparent background
  texture.transparent = true;
  
  // Calculate aspect ratio to maintain sprite proportions
  const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1;
  const width = 2; // Base width
  const height = width / aspectRatio;
  
  return (
    <Billboard follow={false} lockX={false} lockY={false} lockZ={false}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>
    </Billboard>
  );
}

// Fallback component to show while loading
function ModelLoader() {
  return (
    <Html center>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress />
        <Typography variant="body1">Loading Pokemon model...</Typography>
      </Box>
    </Html>
  );
}

// Main 3D Viewer component
function Pokemon3DViewer({ pokemonId, pokemonName }) {
  const [modelScale, setModelScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([0, 0, 5]);
  
  // Reset camera position
  const controlsRef = useRef();
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.update();
    }
    // Force a re-render to ensure controls update
    setCameraPosition([0, 0, 5]);
  };
  
  // Zoom controls
  const zoomIn = () => setModelScale(prev => Math.min(prev + 0.5, 5));
  const zoomOut = () => setModelScale(prev => Math.max(prev - 0.5, 0.5));

  return (
    <Box className="model-viewer-container">
      <Typography variant="h6" className="model-viewer-title">
        3D Model Viewer - {pokemonName}
      </Typography>
      
      <Box className="canvas-container">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={cameraPosition} />
          <ambientLight intensity={1.0} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Suspense fallback={<ModelLoader />}>
            <PokemonModel pokemonId={pokemonId} scale={modelScale} />
            <Environment preset="sunset" />
          </Suspense>
          <OrbitControls 
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
        </Canvas>
      </Box>
      
      <Box className="model-controls">
        <Button 
          variant="contained" 
          startIcon={<RotateLeftIcon />}
          onClick={resetCamera}
          size="small"
        >
          Reset View
        </Button>
        <Button 
          variant="contained" 
          startIcon={<ZoomInIcon />}
          onClick={zoomIn}
          size="small"
        >
          Zoom In
        </Button>
        <Button 
          variant="contained" 
          startIcon={<ZoomOutIcon />}
          onClick={zoomOut}
          size="small"
        >
          Zoom Out
        </Button>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        This is a 3D representation using official Pokémon artwork. Rotate to view from different angles!
      </Typography>
    </Box>
  );
}

export default Pokemon3DViewer;
