import type { GameListItem } from "~/types/components/drag-drop-item.types";

// utils/getParentList.ts

export function getParentList(
  data: GameListItem[],
  path: number[],
): GameListItem[] | null {
  if (path.length === 1) return data;
  const parentPath = path.slice(0, -1);
  let current: GameListItem = data[parentPath[0]];

  for (let i = 1; i < parentPath.length; i++) {
    if (!current.subCategories) return null;
    current = current.subCategories[parentPath[i]];
  }

  return current.subCategories || null;
}

export function swapItemsInSameParent(
  root: GameListItem[],
  fromPath: number[],
  toPath: number[],
): boolean {
  if (fromPath.length !== toPath.length) return false;

  const fromParent = getParentList(root, fromPath);
  const toParent = getParentList(root, toPath);

  if (!fromParent || !toParent || fromParent !== toParent) return false;

  const fromIndex = fromPath[fromPath.length - 1];
  const toIndex = toPath[toPath.length - 1];

  const temp = fromParent[fromIndex];
  fromParent[fromIndex] = fromParent[toIndex];
  fromParent[toIndex] = temp;

  return true;
}
