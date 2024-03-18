import { useRef } from 'react';
import styles from './App.module.scss';
import { Core } from './core/core';
import { Color } from './core/color';

export function App() {
  const coreRef = useRef<Core | null>(null);

  const createCore = (canvasWrapper: HTMLDivElement) => {
    coreRef.current = new Core(canvasWrapper);
    coreRef.current.addBall({
      x: 200,
      y: 100,
      r: 20,
      color: Color.teal,
      moveAngle: 0,
      movePower: 0,
    });
    coreRef.current.addBall({
      x: 200,
      y: 200,
      r: 50,
      color: Color.teal,
      moveAngle: 0,
      movePower: 0,
    });
    coreRef.current.addBall({
      x: 300,
      y: 100,
      r: 10,
      color: Color.teal,
      moveAngle: 0,
      movePower: 0,
    });

    coreRef.current.addBall({
      x: 100,
      y: 300,
      r: 20,
      color: Color.teal,
      moveAngle: 0,
      movePower: 0,
    });

    coreRef.current.addBall({
      x: 100,
      y: 400,
      r: 30,
      color: Color.teal,
      moveAngle: 0,
      movePower: 0,
    });
  };

  return (
    <div className={styles.App}>
      <div ref={createCore} className={styles.canvasWrapper}></div>
    </div>
  );
}
