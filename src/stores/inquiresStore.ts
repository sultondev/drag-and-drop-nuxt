import type { GameListItem } from '~/types/components/drag-drop-item.types'
import type {Movement, PageHistory} from "~/types/components/movements.types.ts";

export const useInquiriesStore = defineStore('inquiries', () => {
  const originalData = ref<GameListItem[]>([])
  const inquiries = ref<GameListItem[]>([])
  const movementHistory = ref<PageHistory>({})
  const futureMovements = ref<PageHistory>({})

  const currentPage = ref(1)

  function setOriginalData(data: GameListItem[]) {
    originalData.value = data
    inquiries.value = JSON.parse(JSON.stringify(data))
  }

  function replayHistoryForPage(page: number) {
    const data = JSON.parse(JSON.stringify(originalData.value))
    const moves = movementHistory.value[page] || []

    moves.forEach(([fromPath, toPath]) => {
      const from = fromPath.split('.').map(Number)
      const to = toPath.split('.').map(Number)
      applyMovement(data, from, to)
    })

    inquiries.value = data
  }

  function applyMovement(data: GameListItem[], from: number[], to: number[]): boolean {
    const fromParent = getParentList(data, from)
    const toParent = getParentList(data, to)

    if (!fromParent || !toParent || fromParent !== toParent) return false

    const fromIdx = from[from.length - 1]
    const toIdx = to[to.length - 1]

    const [movedItem] = fromParent.splice(fromIdx, 1)
    fromParent.splice(toIdx, 0, movedItem)

    return true
  }

  function moveItemByFinderPath(fromPath: string, toPath: string, options?: { isRedo?: boolean }) {
    const from = fromPath.split('.').map(Number)
    const to = toPath.split('.').map(Number)
    const cloned = JSON.parse(JSON.stringify(inquiries.value))

    if (applyMovement(cloned, from, to)) {
      inquiries.value = cloned

      const page = currentPage.value
      const history = movementHistory.value[page] || []
      history.push([fromPath, toPath])
      if (history.length > 20) history.shift()
      movementHistory.value[page] = history

      if (!options?.isRedo) {
        // ✅ only clear future when it's a manual move, not redo
        futureMovements.value[page] = []
      }

      persist()
    }
  }

  function redo() {
    const page = currentPage.value
    const future = futureMovements.value[page]
    if (!future || future.length === 0) return

    const [fromPath, toPath] = future.shift()!
    moveItemByFinderPath(fromPath, toPath, { isRedo: true })

    persist()
  }

  function undo() {
    const page = currentPage.value
    const history = movementHistory.value[page]
    if (!history || history.length === 0) return

    const [fromPath, toPath] = history.pop()!
    const reversedMove: Movement = [toPath, fromPath]
    const data = JSON.parse(JSON.stringify(originalData.value))

    // Reapply remaining history (excluding the undone one)
    const remaining = [...history]
    remaining.forEach(([f, t]) => {
      applyMovement(data, f.split('.').map(Number), t.split('.').map(Number))
    })

    inquiries.value = data

    // ✅ Push to redo
    const redoStack = futureMovements.value[page] || []
    redoStack.unshift([fromPath, toPath])
    futureMovements.value[page] = redoStack

    persist()
  }

  function persist() {
    localStorage.setItem('movementHistory', JSON.stringify(movementHistory.value))
    localStorage.setItem('futureMovements', JSON.stringify(futureMovements.value))
  }

  function initializeFromStorage() {
    const saved = localStorage.getItem('movementHistory')
    const future = localStorage.getItem('futureMovements')

    if (saved) movementHistory.value = JSON.parse(saved)
    if (future) futureMovements.value = JSON.parse(future)
  }


  return {
    inquiries,
    movementHistory,
    currentPage,
    moveItemByFinderPath,
    initializeFromStorage,
    undo,
    setOriginalData,
    replayHistoryForPage,
    redo
  }
})
