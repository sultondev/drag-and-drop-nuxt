import { customRef, watchEffect } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
    return customRef<T>((track, trigger) => {
        const read = (): T => {
            const item = localStorage.getItem(key)
            if (item !== null) {
                try {
                    return JSON.parse(item)
                } catch (e) {
                    console.warn(`useLocalStorage: Failed to parse JSON for key "${key}"`, e)
                }
            }
            // Fallback if key doesn't exist or parse fails
            localStorage.setItem(key, JSON.stringify(defaultValue))
            return defaultValue
        }

        const write = (value: T) => {
            localStorage.setItem(key, JSON.stringify(value))
        }

        let value = read()

        // Listen to storage changes (cross-tab sync)
        const handleStorage = (event: StorageEvent) => {
            if (event.key === key) {
                value = read()
                trigger()
            }
        }

        window.addEventListener('storage', handleStorage)

        return {
            get() {
                track()
                return value
            },
            set(newVal: T) {
                value = newVal
                write(newVal)
                trigger()
            }
        }
    })
}
