import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';

interface Viewer3DProps {
  videoSource?: string;
  isLoading?: boolean;
}

const Viewer3D: React.FC<Viewer3DProps> = ({ videoSource, isLoading = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // If video element exists and source is provided, play the video
    if (videoRef.current && videoSource) {
      videoRef.current.load();
      
      // Play video when it's ready
      videoRef.current.oncanplaythrough = () => {
        if (videoRef.current) {
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }
      };
    }
  }, [videoSource]);

  // Show 3D scene if no video source, or loading state
  if (!videoSource || isLoading) {
    return (
      <div className="h-full bg-[#151515] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/70">
            <div className="text-[#00F0FF] font-orbitron text-xl animate-pulse">
              Generating 3D model...
            </div>
          </div>
        ) : null}
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
            />
            <Grid
              args={[10, 10]}
              cellSize={1}
              cellThickness={1}
              cellColor="#00F0FF"
              sectionSize={3}
              fadeDistance={30}
              fadeStrength={1}
            />
            <OrbitControls />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white/30 font-orbitron text-4xl rotate-[-30deg]">
            PREVIEW MODE
          </span>
        </div>
      </div>
    );
  }

  // Show video when source is available
  return (
    <div className="h-full bg-[#0D0D0D] relative flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full max-w-4xl mx-auto relative"
      >
        <video
          ref={videoRef}
          src={videoSource}
          className="w-full h-full object-contain"
          loop
          muted
          playsInline
          controls
          style={{ filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.5))' }}
        />
      </motion.div>

      {/* Cyber grid background */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default Viewer3D;