export interface GameListItem {
  folderName: string;
  order: number;
  id: string;
  subCategories: GameListItem[];
}

export interface IDragProps {
  data: GameListItem;
  itemIdx: string;
  parentIdx?: string;
  onDrop: (event: DragEvent) => void;
  isSubCategories?: boolean;
  order: number;
}
