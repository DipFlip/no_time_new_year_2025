import { forwardRef, useImperativeHandle, useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

const HourglassContainer = styled.div.attrs<{ $x: number; $y: number }>(props => ({
  style: {
    transform: `translate(${props.$x}px, ${props.$y}px)`,
  },
}))`
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  contain: layout style paint;
`;

const HourglassBody = styled.div<{ $isFull: boolean }>`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border: 3px solid #2a2a2a;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
  box-shadow: ${props => props.$isFull ? '0 0 20px rgba(255, 215, 0, 0.6)' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  transition: box-shadow 0.3s ease;
  contain: layout style paint;
  animation: ${props => props.$isFull ? 'pulse 2s ease-in-out infinite' : 'none'};

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const Sand = styled.div.attrs<{ $fillPercentage: number }>(props => ({
  style: {
    transform: `translateX(-50%) scaleY(${props.$fillPercentage / 100})`,
  },
}))`
  width: 60px;
  height: 100%;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  position: absolute;
  bottom: 10px;
  left: 50%;
  will-change: transform;
  transform-origin: bottom;
  contain: paint style;
`;

interface HourglassProps {
  id: number;
  x: number;
  y: number;
  onFill: () => void;
}

export interface HourglassRef {
  addFill: (amount: number) => void;
}

export const Hourglass = forwardRef<HourglassRef, HourglassProps>(({ id, x, y, onFill }, ref) => {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const fillAnimation = useRef<gsap.core.Tween | null>(null);
  const progressValue = useRef({ value: 0 });
  
  // Generate a random duration between 30 and 200 seconds
  const fillDuration = useRef(30 + Math.random() * 170);

  useEffect(() => {
    // Create a GSAP animation for continuous filling with random duration
    const tween = gsap.to(progressValue.current, {
      value: 100,
      duration: fillDuration.current,
      ease: "linear",
      onUpdate: () => {
        setFillPercentage(progressValue.current.value);
        if (progressValue.current.value >= 100 && !isFull) {
          setIsFull(true);
          onFill();
        }
      },
      // Reset and repeat the animation when complete
      onComplete: () => {
        progressValue.current.value = 0;
        setFillPercentage(0);
        setIsFull(false);
        // Start a new animation with a new random duration
        fillDuration.current = 30 + Math.random() * 170;
        gsap.to(progressValue.current, {
          value: 100,
          duration: fillDuration.current,
          ease: "linear",
          onUpdate: () => {
            setFillPercentage(progressValue.current.value);
            if (progressValue.current.value >= 100 && !isFull) {
              setIsFull(true);
              onFill();
            }
          },
          repeat: -1
        });
      }
    });

    return () => {
      tween.kill();
      if (fillAnimation.current) {
        fillAnimation.current.kill();
      }
    };
  }, [onFill, isFull]);

  const addFill = useCallback((amount: number) => {
    // Kill any existing fill animation
    if (fillAnimation.current) {
      fillAnimation.current.kill();
    }

    const targetValue = Math.min(100, progressValue.current.value + amount);

    // Create a new animation for the bonus fill
    fillAnimation.current = gsap.to(progressValue.current, {
      value: targetValue,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        setFillPercentage(progressValue.current.value);
        if (progressValue.current.value >= 100 && !isFull) {
          setIsFull(true);
          onFill();
        }
      }
    });
  }, [onFill, isFull]);

  useImperativeHandle(ref, () => ({
    addFill
  }), [addFill]);

  return (
    <HourglassContainer $x={x} $y={y} data-hourglass-id={id}>
      <HourglassBody $isFull={isFull}>
        <Sand $fillPercentage={fillPercentage} />
      </HourglassBody>
    </HourglassContainer>
  );
});

Hourglass.displayName = 'Hourglass'; 