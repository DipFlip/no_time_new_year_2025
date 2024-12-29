import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const FireworkContainer = styled(motion.div)`
  position: absolute;
  pointer-events: none;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${props => props.color};
`;

interface FireworkProps {
  x: number;
  y: number;
  onComplete: () => void;
}

const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
const particleCount = 20;

export const Firework = ({ x, y, onComplete }: FireworkProps) => {
  const [particles, setParticles] = useState<Array<{ angle: number; color: string }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i * 360) / particleCount,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);

    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <FireworkContainer
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{ left: x, top: y }}
    >
      {particles.map((particle, i) => (
        <Particle
          key={i}
          color={particle.color}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [1, 0],
            x: [0, Math.cos(particle.angle * Math.PI / 180) * 100],
            y: [0, Math.sin(particle.angle * Math.PI / 180) * 100],
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />
      ))}
    </FireworkContainer>
  );
}; 