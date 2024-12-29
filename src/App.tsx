import { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { WeirdClock } from './components/WeirdClock';
import { Hourglass, HourglassRef } from './components/Hourglass';
import { BoardGame } from './components/BoardGame';
import { Bird } from './components/Bird';
import { Timeline } from './components/Timeline';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  width: 100%;
`;

const Title = styled.h1`
  color: #2a2a2a;
  font-size: 3rem;
  text-align: center;
  padding: 1rem;
  position: absolute;
  top: 0;
  width: 100%;
  background: linear-gradient(to bottom, #f5f5f5, transparent);
  z-index: 10;
`;

const PlayArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
`;

const TimelineSection = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 2rem 1rem;
  background: linear-gradient(to bottom, transparent, #f5f5f5 20%);
  z-index: 10;
`;

interface HourglassPosition {
  x: number;
  y: number;
  id: number;
}

function App() {
  const [hourglassSpeed, setHourglassSpeed] = useState(1);
  const hourglassRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Create 10 random positions for hourglasses with better spacing
  const hourglassPositions: HourglassPosition[] = Array.from({ length: 10 }, (_, i) => {
    const gridSize = Math.ceil(Math.sqrt(10));
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    
    // Use viewport units for positioning
    const cellWidth = window.innerWidth / gridSize;
    const cellHeight = (window.innerHeight - 200) / gridSize; // Account for title and timeline
    
    // Add padding from edges
    const padding = 100;
    const availableWidth = window.innerWidth - padding * 2;
    const availableHeight = window.innerHeight - 300; // Account for title and timeline
    
    return {
      x: padding + (col * availableWidth / (gridSize - 1)),
      y: padding + (row * availableHeight / (gridSize - 1)),
      id: i,
    };
  });

  const handleHourglassFill = useCallback(() => {
    console.log('Hourglass filled!');
  }, []);

  const handleRoundComplete = useCallback(() => {
    console.log('Round complete!');
  }, []);

  const handleBirdNearHourglass = useCallback((birdX: number, birdY: number) => {
    hourglassRefs.current.forEach((hourglass, id) => {
      const rect = hourglass.getBoundingClientRect();
      const hourglassX = rect.left + rect.width / 2;
      const hourglassY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(birdX - hourglassX, 2) + 
        Math.pow(birdY - hourglassY, 2)
      );

      if (distance < 50) {
        console.log(`Bird near hourglass ${id}!`);
        if (hourglass && 'addFill' in hourglass) {
          (hourglass as any).addFill(10);
        }
      }
    });
  }, []);

  return (
    <AppContainer className="app-container">
      <Title>No Time New Year 2025! 🎉</Title>
      <PlayArea>
        {hourglassPositions.map((pos) => (
          <Hourglass
            key={pos.id}
            id={pos.id}
            x={pos.x}
            y={pos.y}
            onFill={handleHourglassFill}
            ref={(el: HTMLDivElement | null) => {
              if (el) {
                hourglassRefs.current.set(pos.id, el);
              } else {
                hourglassRefs.current.delete(pos.id);
              }
            }}
          />
        ))}
        <Bird onHourglassHover={handleBirdNearHourglass} />
      </PlayArea>
      <TimelineSection>
        <Timeline duration={20} />
      </TimelineSection>
    </AppContainer>
  );
}

export default App;
