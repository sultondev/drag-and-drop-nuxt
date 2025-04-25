import {
  ref,
  computed,
  watch,
  onMounted,
  unref,
  type Ref
} from 'vue'

/**
 * A composable for syncing a reactive value with localStorage under a dynamic key.
 *
 * @param key    A string or Ref<string> key under which to store the value.
 * @param initialValue  The initial/default value (will be used if nothing is in storage).
 */
export function useLocalStorage<T>(
    key: string | Ref<string>,
    initialValue: T
) {
  const keyRef = computed(() => unref(key))

  const storedValue = ref<T>(initialValue)

  function load() {
    if (typeof window === 'undefined') {
      // SSR: do nothing
      return
    }
    try {
      const json = localStorage.getItem(keyRef.value)
      if (json != null) {
        storedValue.value = JSON.parse(json) as T
      } else {
        // write initialValue so storage stays in sync
        localStorage.setItem(
            keyRef.value,
            JSON.stringify(initialValue)
        )
      }
    } catch (e) {
      console.warn(`useLocalStorage(${keyRef.value}):`, e)
    }
  }

  onMounted(load)

  watch(keyRef, () => {
    load()
  })

  watch(
      storedValue,
      (newVal) => {
        if (typeof window === 'undefined') return
        try {
          localStorage.setItem(
              keyRef.value,
              JSON.stringify(newVal)
          )
        } catch (e) {
          console.warn(`useLocalStorage(${keyRef.value}):`, e)
        }
      },
      { deep: true }
  )

  return storedValue
}
