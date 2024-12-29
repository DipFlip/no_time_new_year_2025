import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { WeirdClock } from './components/WeirdClock';
import { Hourglass } from './components/Hourglass';
import { BoardGame } from './components/BoardGame';
import { Bird } from './components/Bird';
import { Timeline } from './components/Timeline';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  padding-bottom: 500px;
`;

const Title = styled.h1`
  color: #2a2a2a;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const GameSection = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  position: relative;
  margin-bottom: 2rem;
`;

const TimelineSection = styled.div`
  width: 100%;
  max-width: 1200px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 2rem;
`;

function App() {
  const [hourglassSpeed, setHourglassSpeed] = useState(1);

  const handleHourglassFill = useCallback(() => {
    // Move the board game piece
    console.log('Hourglass filled!');
  }, []);

  const handleRoundComplete = useCallback(() => {
    // Release the bird
    console.log('Round complete!');
  }, []);

  const handleBirdSpeedChange = useCallback((multiplier: number) => {
    setHourglassSpeed(multiplier);
    console.log(`Speed changed to ${multiplier}x`);
  }, []);

  return (
    <AppContainer>
      <Title>No Time New Year 2025! 🎉</Title>
      <WeirdClock />
      <GameSection>
        <Hourglass onFill={handleHourglassFill} />
        <BoardGame onRoundComplete={handleRoundComplete} />
        <Bird onSpeedChange={handleBirdSpeedChange} />
      </GameSection>
      <TimelineSection>
        <Timeline duration={20} />
      </TimelineSection>
    </AppContainer>
  );
}

export default App;
