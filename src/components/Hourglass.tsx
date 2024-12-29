import { useEffect, useRef, useState, forwardRef } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';

const HourglassContainer = styled.div<{ x: number; y: number }>`
  width: 100px;
  height: 160px;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Glass = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: transparent;
  border: 4px solid #2a2a2a;
  border-radius: 10px;
  clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
`;

const Sand = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #f0d78c;
  transform-origin: bottom;
`;

interface HourglassProps {
  x: number;
  y: number;
  onFill: () => void;
  id: number;
}

export const Hourglass = forwardRef<HTMLDivElement, HourglassProps>(
  ({ x, y, onFill, id }, ref) => {
    const sandRef = useRef<HTMLDivElement>(null);
    const [fillPercentage, setFillPercentage] = useState(0);
    const timeline = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
      if (!sandRef.current) return;

      timeline.current = gsap.timeline({
        repeat: -1,
        onRepeat: onFill,
      });

      timeline.current.fromTo(
        sandRef.current,
        { height: '0%' },
        {
          height: '100%',
          duration: 300, // 5 minutes
          ease: 'linear',
          onUpdate: () => {
            if (timeline.current) {
              setFillPercentage(timeline.current.progress() * 100);
            }
          },
        }
      );

      return () => {
        if (timeline.current) {
          timeline.current.kill();
        }
      };
    }, [onFill]);

    const addFill = (amount: number) => {
      if (timeline.current) {
        const newProgress = Math.min(1, timeline.current.progress() + amount / 100);
        timeline.current.progress(newProgress);
      }
    };

    return (
      <HourglassContainer ref={ref} x={x} y={y} data-id={id}>
        <Glass>
          <Sand ref={sandRef} />
        </Glass>
      </HourglassContainer>
    );
  }
);

Hourglass.displayName = 'Hourglass';

// Add this to make the addFill method accessible from outside
export type HourglassRef = {
  addFill: (amount: number) => void;
}; 