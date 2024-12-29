import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const SparkleContainer = styled(motion.div)`
  position: absolute;
  pointer-events: none;
`;

const SparkleParticle = styled(motion.div)`
  position: absolute;
  width: 3px;
  height: 3px;
  background: #FFD700;
  border-radius: 50%;
  box-shadow: 0 0 4px #FFD700;
`;

interface SparkleProps {
  x: number;
  y: number;
  onComplete: () => void;
}

const particleCount = 12;

export const Sparkle = ({ x, y, onComplete }: SparkleProps) => {
  const [particles, setParticles] = useState<Array<{ delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, () => ({
      delay: Math.random() * 0.2,
    }));
    setParticles(newParticles);

    const timer = setTimeout(onComplete, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <SparkleContainer style={{ left: x, top: y }}>
      {particles.map((particle, i) => (
        <SparkleParticle
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 40],
            y: [0, (Math.random() - 0.5) * 40],
          }}
          transition={{
            duration: 0.5,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </SparkleContainer>
  );
}; 