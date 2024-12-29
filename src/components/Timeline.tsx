import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const TimelineContainer = styled.div`
  width: 100%;
  height: 400px;
  padding: 2rem;
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TimelinePath = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const TimelineSegment = styled.div<{ direction: 'horizontal' | 'vertical' }>`
  position: absolute;
  background: #e0e0e0;
  border-radius: 2px;
  ${props => props.direction === 'horizontal' 
    ? 'height: 4px; width: 100%;'
    : 'width: 4px; height: 50px;'}
`;

const Progress = styled(motion.div)<{ direction: 'horizontal' | 'vertical' }>`
  position: absolute;
  background: #2a2a2a;
  border-radius: 2px;
  ${props => props.direction === 'horizontal' 
    ? 'height: 100%; left: 0;'
    : 'width: 100%; bottom: 0;'}
`;

const AddButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: #2a2a2a;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s;
  z-index: 10;

  &:hover {
    transform: translateX(-50%) scale(1.05);
  }
`;

const EmojiMarker = styled(motion.div)<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}px;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  z-index: 5;
`;

const emojis = ['🌟', '🎈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎮', '🎸', '🎺', '🎨', '🎭'];

interface TimelineProps {
  duration: number; // in minutes
}

interface Marker {
  emoji: string;
  progress: number;
  id: number;
}

interface Segment {
  direction: 'horizontal' | 'vertical';
  top: number;
  left: number;
  progressStart: number;
  progressEnd: number;
}

const createSegments = (): Segment[] => {
  const segments: Segment[] = [];
  const verticalGap = 50; // Height of vertical segments
  let currentProgress = 0;
  const progressPerRow = 100 / 8; // 8 horizontal segments

  for (let i = 0; i < 8; i++) {
    // Horizontal segment
    segments.push({
      direction: 'horizontal',
      top: i * verticalGap,
      left: i % 2 === 0 ? 0 : 0,
      progressStart: currentProgress,
      progressEnd: currentProgress + progressPerRow,
    });
    currentProgress += progressPerRow;

    // Vertical segment (except for the last row)
    if (i < 7) {
      segments.push({
        direction: 'vertical',
        top: i * verticalGap,
        left: i % 2 === 0 ? 100 : 0,
        progressStart: currentProgress,
        progressEnd: currentProgress,
      });
    }
  }

  return segments;
};

export const Timeline: React.FC<TimelineProps> = ({ duration }) => {
  const [progress, setProgress] = useState(0);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [markerId, setMarkerId] = useState(0);
  const segments = createSegments();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (duration * 60));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const getMarkerPosition = (progress: number): { x: number; y: number } => {
    const segment = segments.find(s => 
      progress >= s.progressStart && progress <= s.progressEnd
    );

    if (!segment) return { x: 0, y: 0 };

    if (segment.direction === 'horizontal') {
      const segmentProgress = (progress - segment.progressStart) / 
        (segment.progressEnd - segment.progressStart);
      const x = segment.left + (segment.left === 0 ? segmentProgress * 100 : (1 - segmentProgress) * 100);
      return { x, y: segment.top };
    } else {
      const segmentProgress = (progress - segment.progressStart) / 
        (segment.progressEnd - segment.progressStart);
      return { x: segment.left, y: segment.top + segmentProgress * 50 };
    }
  };

  const handleAddEmoji = () => {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setMarkers(prev => [...prev, {
      emoji: randomEmoji,
      progress,
      id: markerId,
    }]);
    setMarkerId(prev => prev + 1);
  };

  return (
    <TimelineContainer>
      <TimelinePath>
        {segments.map((segment, index) => (
          <TimelineSegment
            key={index}
            direction={segment.direction}
            style={{
              top: `${segment.top}px`,
              left: `${segment.left}%`,
            }}
          >
            <Progress
              direction={segment.direction}
              style={{
                width: segment.direction === 'horizontal' 
                  ? `${Math.max(0, Math.min(100, 
                      ((progress - segment.progressStart) / 
                      (segment.progressEnd - segment.progressStart)) * 100
                    ))}%`
                  : '100%',
                height: segment.direction === 'vertical'
                  ? `${Math.max(0, Math.min(100,
                      ((progress - segment.progressStart) /
                      (segment.progressEnd - segment.progressStart)) * 100
                    ))}%`
                  : '100%',
              }}
            />
          </TimelineSegment>
        ))}
        {markers.map(marker => {
          const position = getMarkerPosition(marker.progress);
          return (
            <EmojiMarker
              key={marker.id}
              x={position.x}
              y={position.y}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              {marker.emoji}
            </EmojiMarker>
          );
        })}
      </TimelinePath>
      <AddButton onClick={handleAddEmoji}>Add Emoji</AddButton>
    </TimelineContainer>
  );
}; 