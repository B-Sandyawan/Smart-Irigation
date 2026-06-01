import { useMemo } from 'react';
import styles from './AnimatedBackground.module.css';

const createCircleStyle = () => {
  const size = Math.floor(Math.random() * 90) + 24;
  return {
    left: `${Math.random() * 90}%`,
    width: `${size}px`,
    height: `${Math.floor(size * (0.65 + Math.random() * 0.6))}px`,
    bottom: `${-Math.floor(Math.random() * 140 + 40)}px`,
    animationDuration: `${Math.floor(Math.random() * 18 + 18)}s`,
    animationDelay: `${-Math.floor(Math.random() * 15)}s`,
    opacity: 0.4 + Math.random() * 0.35,
    borderRadius: `${12 + Math.floor(Math.random() * 26)}%`,
  };
};

const AnimatedBackground = () => {
  const circles = useMemo(() => Array.from({ length: 12 }, createCircleStyle), []);

  return (
    <div className={styles.context}>
      <div className={styles.area}>
        <ul className={styles.circles}>
          {circles.map((style, index) => (
            <li key={index} className={styles.circle} style={style} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnimatedBackground;
