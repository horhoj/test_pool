import { useRef, useState } from 'react';
import styles from './App.module.scss';
import { Core } from './core/core';
import { Color } from './core/color';
import { ContextMenuData } from './App.types';
import { BALL_DATA_LIST } from './balls';
import { ContextMenu } from '~/components/ContextMenu';
import { Modal } from '~/ui/Modal';

export function App() {
  const coreRef = useRef<Core | null>(null);
  const [contextMenuData, setContextMenuData] =
    useState<ContextMenuData | null>(null);

  const createCore = (canvasWrapper: HTMLDivElement) => {
    if (coreRef.current) {
      return;
    }

    coreRef.current = new Core(canvasWrapper);
    BALL_DATA_LIST.forEach((ballData) => {
      coreRef.current?.addBall(ballData);
    });
    coreRef.current.setContextMenuDataSetter(setContextMenuData);
  };

  const handleChangeColor = (color: Color) => {
    if (coreRef.current && contextMenuData !== null) {
      coreRef.current.setBallColor(contextMenuData.ballIndex, color);
    }

    setContextMenuData(null);
  };

  return (
    <div className={styles.App}>
      <Modal
        isOpen={contextMenuData !== null}
        onClose={() => setContextMenuData(null)}
      >
        {contextMenuData && (
          <div
            style={{
              position: 'absolute',
              left: `${contextMenuData.x}px`,
              top: `${contextMenuData.y}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ContextMenu onChangeColor={handleChangeColor} />
          </div>
        )}
      </Modal>

      <div ref={createCore} className={styles.canvasWrapper}></div>
      <ol className={styles.rules}>
        <li>
          Пока шары двигаются, возможности для удара/смены цвета заблокированы
        </li>
        <li>
          Для выполнения удара наведите мышь на шар (должна появиться обводка
          шара), затем нажмите левую клавишу мыши и не отпуская ее переместите
          куда нибудь курсор мыши и отпустите левую кнопку мыши. Шар полетит в
          сторону последнего положения курсора мыши
        </li>
        <li>
          Если нажать правой кнопкой мыши по шару, то появиться меню для смены
          цвета
        </li>
        <li>
          иногда может возникнуть коллизия (застревание шара в борту или в
          другом шаре). В связи с редкостью бага, отловить пока не удалось ))
        </li>
      </ol>
    </div>
  );
}
