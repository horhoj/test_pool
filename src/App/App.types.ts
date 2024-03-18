export interface ContextMenuData {
  x: number;
  y: number;
  ballIndex: number;
}

export type ContextMenuDataSetter = (
  contextMenuData: ContextMenuData | null,
) => void;
