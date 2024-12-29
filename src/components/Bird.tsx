import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const BirdContainer = styled(motion.div)`
  position: absolute;
  font-size: 2rem;
  cursor: pointer;
`;

interface BirdProps {
  onSpeedChange: (multiplier: number) => void;
}

export const Bird: React.FC<BirdProps> = ({ onSpeedChange }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFlying, setIsFlying] = useState(false);

  const handleClick = () => {
    if (!isFlying) {
      setIsFlying(true);
      const newX = Math.random() * window.innerWidth;
      const newY = Math.random() * window.innerHeight;
      setPosition({ x: newX, y: newY });

      // Random speed multiplier between 0.5 and 2
      const speedMultiplier = 0.5 + Math.random() * 1.5;
      onSpeedChange(speedMultiplier);
    }
  };

  useEffect(() => {
    if (isFlying) {
      const timer = setTimeout(() => {
        setIsFlying(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFlying]);

  return (
    <BirdContainer
      initial={position}
      animate={isFlying ? {
        x: position.x,
        y: position.y,
        rotate: [0, 15, -15, 0],
      } : {}}
      transition={{
        type: "spring",
        duration: 3,
        rotate: {
          repeat: Infinity,
          duration: 0.5,
        },
      }}
      onClick={handleClick}
    >
      🦜
    </BirdContainer>
  );
}; 