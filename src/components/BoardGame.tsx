import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const BoardContainer = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  border: 4px solid #2a2a2a;
  border-radius: 10px;
  padding: 20px;
`;

const Path = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border: 2px dashed #666;
  border-radius: 5px;
`;

const GamePiece = styled(motion.div)`
  width: 30px;
  height: 30px;
  background: #ff6b6b;
  border-radius: 50%;
  position: absolute;
`;

interface BoardGameProps {
  onRoundComplete: () => void;
}

const positions = [
  { x: 0, y: 0 },
  { x: 240, y: 0 },
  { x: 240, y: 240 },
  { x: 0, y: 240 },
];

export const BoardGame: React.FC<BoardGameProps> = ({ onRoundComplete }) => {
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    if (currentPosition === positions.length) {
      setCurrentPosition(0);
      onRoundComplete();
    }
  }, [currentPosition, onRoundComplete]);

  const handlePieceAnimationComplete = () => {
    setCurrentPosition(prev => prev + 1);
  };

  return (
    <BoardContainer>
      <Path />
      <GamePiece
        initial={positions[currentPosition % positions.length]}
        animate={positions[(currentPosition + 1) % positions.length]}
        transition={{ duration: 2, ease: "easeInOut" }}
        onAnimationComplete={handlePieceAnimationComplete}
      />
    </BoardContainer>
  );
}; 