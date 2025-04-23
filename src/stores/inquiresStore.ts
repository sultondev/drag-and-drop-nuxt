// stores/inquiries.ts
import type { GameListItem } from '~/types/components/drag-drop-item.types'

export const useInquiriesStore = defineStore('inquiries', () => {
  const inquiries = ref<GameListItem[]>([])
  const history = ref<GameListItem[][]>([])
  const future = ref<GameListItem[][]>([])

  // ========== Actions ==========

  function updateInquiries(newData: GameListItem[]) {
    saveToHistory()
    inquiries.value = newData
    future.value = []
    persist()
  }

  function undo() {
    if (history.value.length === 0) return

    const current = JSON.parse(JSON.stringify(inquiries.value))
    future.value.unshift(current)

    const lastState = history.value.pop()
    if (lastState) {
      inquiries.value = lastState
      persist()
    }
  }

  function redo() {
    if (future.value.length === 0) return

    const current = JSON.parse(JSON.stringify(inquiries.value))
    history.value.push(current)

    const nextState = future.value.shift()
    if (nextState) {
      inquiries.value = nextState
      persist()
    }
  }

  function saveToHistory() {
    const snapshot = JSON.parse(JSON.stringify(inquiries.value))
    history.value.push(snapshot)

    if (history.value.length > 20) {
      history.value.shift()
    }
  }

  function persist() {
    localStorage.setItem('inquiries', JSON.stringify(inquiries.value))
    localStorage.setItem('history', JSON.stringify(history.value))
    localStorage.setItem('future', JSON.stringify(future.value))
  }

  function initializeFromStorage() {
    const saved = localStorage.getItem('inquiries')
    const savedHistory = localStorage.getItem('history')
    const savedFuture = localStorage.getItem('future')

    if (saved) inquiries.value = JSON.parse(saved)
    if (savedHistory) history.value = JSON.parse(savedHistory)
    if (savedFuture) future.value = JSON.parse(savedFuture)
  }

  return {
    inquiries,
    updateInquiries,
    undo,
    redo,
    initializeFromStorage,
    saveToHistory
  }
})
