export interface GameListItem {
    folderName: string;
    order: number;
    id: string;
    subCategories: GameListItem[];
}

export interface IDragProps {
    data: GameListItem;
    indexNumber: string;
    onDrop: (dragId: string, dropId: string, dropPosition: 'before' | 'after' | 'inside') => void
    isSubCategories?: boolean;
}