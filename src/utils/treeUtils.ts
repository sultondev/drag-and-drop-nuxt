// utils/treeUtils.ts
import type { GameListItem } from '~/types/components/drag-drop-item.types'

export function getItemByPath(data: GameListItem[], path: number[]): GameListItem {
    let current: GameListItem = data[path[0]]; // First level

    for (let i = 1; i < path.length; i++) {
        if (!current.subCategories || !current.subCategories[path[i]]) {
            throw new Error(`Invalid path at depth ${i}: ${path}`)
        }
        current = current.subCategories[path[i]]
    }

    return current
}

export function getParentByPath(data: GameListItem[], path: number[]): { parent: GameListItem[]; index: number } | null {
    if (path.length === 0) return null

    const index = path[path.length - 1]

    if (path.length === 1) {
        return { parent: data, index }
    }

    const parent = getItemByPath(data, path.slice(0, -1)).subCategories
    return parent ? { parent, index } : null
}

export function moveItemByPath(
    data: GameListItem[],
    fromPath: number[],
    toPath: number[]
) {
    const fromInfo = getParentByPath(data, fromPath)
    const toInfo = getParentByPath(data, toPath)

    if (!fromInfo || !toInfo) return

    const [movedItem] = fromInfo.parent.splice(fromInfo.index, 1)

    const target = getItemByPath(data, toPath)
    target.subCategories ||= []
    target.subCategories.push(movedItem)
}
