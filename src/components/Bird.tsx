import { motion } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';

const BirdWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const BirdContainer = styled(motion.div)`
  position: absolute;
  font-size: 2rem;
  cursor: pointer;
  z-index: 100;
  user-select: none;
  filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.2));
  pointer-events: auto;
`;

interface BirdProps {
  onHourglassHover: (x: number, y: number) => void;
}

interface Position {
  x: number;
  y: number;
}

const PADDING = 30; // Reduced padding from edges

export const Bird = ({ onHourglassHover }: BirdProps) => {
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isFlying, setIsFlying] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const getRandomPosition = useCallback(() => {
    if (!wrapperRef.current) return { x: 20, y: 20 };

    const rect = wrapperRef.current.getBoundingClientRect();
    const maxX = rect.width - PADDING * 2;
    const maxY = rect.height - PADDING * 2;

    // Generate random position within bounds (in pixels)
    const x = Math.random() * maxX + PADDING;
    const y = Math.random() * maxY + PADDING;

    return { x, y };
  }, []);

  const calculateRotation = useCallback((start: Position, end: Position) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }, []);

  const flyToNewPosition = useCallback(() => {
    if (!wrapperRef.current) return;

    const newPosition = getRandomPosition();
    const newRotation = calculateRotation(position, newPosition);
    
    // Temporarily show landing spot
    const tempSpot = document.createElement('div');
    tempSpot.style.cssText = `
      position: absolute;
      left: ${newPosition.x}px;
      top: ${newPosition.y}px;
      width: 8px;
      height: 8px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      pointer-events: none;
      transition: opacity 0.3s;
      z-index: 99;
    `;
    wrapperRef.current.appendChild(tempSpot);
    setTimeout(() => {
      tempSpot.style.opacity = '0';
      setTimeout(() => tempSpot.remove(), 300);
    }, 100);

    setRotation(newRotation);
    setPosition(newPosition);
    
    // Convert position to relative coordinates for hourglass interaction
    const rect = wrapperRef.current.getBoundingClientRect();
    onHourglassHover(rect.left + newPosition.x, rect.top + newPosition.y);
  }, [position, getRandomPosition, calculateRotation, onHourglassHover]);

  // Initial setup
  useEffect(() => {
    const initialPosition = getRandomPosition();
    setPosition(initialPosition);
    setIsFlying(true);
  }, [getRandomPosition]);

  // Handle flying
  useEffect(() => {
    const flyInterval = setInterval(flyToNewPosition, 3000);
    return () => clearInterval(flyInterval);
  }, [flyToNewPosition]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const newPosition = getRandomPosition();
      setPosition(newPosition);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getRandomPosition]);

  return (
    <BirdWrapper ref={wrapperRef}>
      <BirdContainer
        animate={{
          x: position.x,
          y: position.y,
          rotate: rotation,
        }}
        initial={false}
        transition={{
          type: "spring",
          duration: 3,
          bounce: 0.3,
        }}
      >
        {isFlying ? '🦜' : '🪺'}
      </BirdContainer>
    </BirdWrapper>
  );
}; 