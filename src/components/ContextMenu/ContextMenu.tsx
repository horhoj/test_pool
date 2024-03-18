import styles from './ContextMenu.module.scss';
import { Button } from '~/ui/Button';
import { Color } from '~/App/core/color';
import { getUUID } from '~/utils/getUUID';

interface ContextMenuProps {
  onChangeColor: (color: Color) => void;
}

interface MenuDataItem {
  id: string;
  color: Color;
  title: string;
}

const MENU_DATA_LIST: MenuDataItem[] = [
  { id: getUUID(), color: Color.black, title: 'черный' },
  { id: getUUID(), color: Color.blue, title: 'синий' },
  { id: getUUID(), color: Color.green, title: 'зеленый' },
  { id: getUUID(), color: Color.teal, title: 'тиаловый' },
  { id: getUUID(), color: Color.red, title: 'красный' },
  { id: getUUID(), color: Color.orange, title: 'оранжевый' },
];

export function ContextMenu({ onChangeColor }: ContextMenuProps) {
  return (
    <div className={styles.ContextMenu}>
      <div>Выберите цвет:</div>
      <ul className={styles.ul}>
        {MENU_DATA_LIST.map((el) => (
          <li key={el.id}>
            <Button
              className={styles.button}
              style={{ backgroundColor: el.color }}
              onClick={() => onChangeColor(el.color)}
            >
              {el.title}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
