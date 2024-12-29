import { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { WeirdClock } from './components/WeirdClock';
import { Hourglass, HourglassRef } from './components/Hourglass';
import { BoardGame } from './components/BoardGame';
import { Bird } from './components/Bird';
import { Timeline } from './components/Timeline';
import { Sparkle } from './components/Sparkle';
import { Firework } from './components/Firework';

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

interface Effect {
  id: number;
  type: 'sparkle' | 'firework';
  x: number;
  y: number;
}

function App() {
  const [hourglassSpeed, setHourglassSpeed] = useState(1);
  const hourglassRefs = useRef<Map<number, HourglassRef>>(new Map());
  const [effects, setEffects] = useState<Effect[]>([]);
  const effectIdRef = useRef(0);

  const addEffect = (type: 'sparkle' | 'firework', x: number, y: number) => {
    const id = effectIdRef.current++;
    setEffects(prev => [...prev, { id, type, x, y }]);
  };

  const removeEffect = (id: number) => {
    setEffects(prev => prev.filter(effect => effect.id !== id));
  };

  // Create 10 fixed positions for hourglasses
  const hourglassPositions: HourglassPosition[] = [
    { x: 200, y: 150, id: 0 },  // Top left
    { x: 500, y: 180, id: 1 },  // Top middle
    { x: 800, y: 140, id: 2 },  // Top right
    { x: 300, y: 300, id: 3 },  // Middle left
    { x: 650, y: 320, id: 4 },  // Middle
    { x: 900, y: 280, id: 5 },  // Middle right
    { x: 180, y: 450, id: 6 },  // Bottom left
    { x: 450, y: 480, id: 7 },  // Bottom middle
    { x: 750, y: 440, id: 8 },  // Bottom right
    { x: 1000, y: 400, id: 9 }, // Far right
  ];

  const handleHourglassFill = useCallback((x: number, y: number) => {
    addEffect('firework', x, y);
  }, []);

  const handleRoundComplete = useCallback(() => {
    console.log('Round complete!');
  }, []);

  const handleBirdNearHourglass = useCallback((birdX: number, birdY: number) => {
    hourglassRefs.current.forEach((hourglass, id) => {
      const hourglassElement = document.querySelector(`[data-hourglass-id="${id}"]`);
      if (!hourglassElement) return;

      const rect = hourglassElement.getBoundingClientRect();
      const hourglassX = rect.left + rect.width / 2;
      const hourglassY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(birdX - hourglassX, 2) + 
        Math.pow(birdY - hourglassY, 2)
      );

      const detectionRadius = 100;
      if (distance < detectionRadius) {
        addEffect('sparkle', hourglassX, hourglassY);
        hourglass.addFill(50);
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
            onFill={() => handleHourglassFill(pos.x, pos.y)}
            ref={(el: HourglassRef | null) => {
              if (el) {
                hourglassRefs.current.set(pos.id, el);
              } else {
                hourglassRefs.current.delete(pos.id);
              }
            }}
          />
        ))}
        <Bird onHourglassHover={handleBirdNearHourglass} />
        {effects.map(effect => (
          effect.type === 'sparkle' ? (
            <Sparkle
              key={effect.id}
              x={effect.x}
              y={effect.y}
              onComplete={() => removeEffect(effect.id)}
            />
          ) : (
            <Firework
              key={effect.id}
              x={effect.x}
              y={effect.y}
              onComplete={() => removeEffect(effect.id)}
            />
          )
        ))}
      </PlayArea>
      <TimelineSection>
        <Timeline duration={20} />
      </TimelineSection>
    </AppContainer>
  );
}

export default App;
