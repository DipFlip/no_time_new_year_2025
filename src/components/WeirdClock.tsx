import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { ReactElement } from 'react';

const ClockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const TimeDisplay = styled(motion.div)`
  font-size: 2rem;
  font-weight: bold;
  color: #2a2a2a;
`;

const items = [
  { name: 'frog', emoji: '🐸' },
  { name: 'pizza', emoji: '🍕' },
  { name: 'rocket', emoji: '🚀' },
  { name: 'star', emoji: '⭐' },
  { name: 'moon', emoji: '🌙' },
];

export const WeirdClock = (): ReactElement => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentItem, setCurrentItem] = useState(items[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCurrentItem(items[Math.floor(Math.random() * items.length)]);
    }, 60000); // Change every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <ClockContainer>
      <TimeDisplay
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {`It's ${currentItem.emoji} ${currentItem.name} o'clock`}
      </TimeDisplay>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {currentItem.emoji}
      </motion.div>
    </ClockContainer>
  );
}; 