import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';

const HourglassContainer = styled.div`
  width: 100px;
  height: 160px;
  position: relative;
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
  onFill: () => void;
}

export const Hourglass: React.FC<HourglassProps> = ({ onFill }) => {
  const sandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sandRef.current) return;

    const tl = gsap.timeline({
      repeat: -1,
      onRepeat: onFill,
    });

    tl.fromTo(
      sandRef.current,
      { height: '0%' },
      {
        height: '100%',
        duration: 20, // 5 minutes = 300 seconds
        ease: 'linear',
      }
    );

    return () => {
      tl.kill();
    };
  }, [onFill]);

  return (
    <HourglassContainer>
      <Glass>
        <Sand ref={sandRef} />
      </Glass>
    </HourglassContainer>
  );
}; 