// useOutsideClick.ts
import { onMounted, onUnmounted, type Ref } from "vue";

export default function useOutsideClick<T extends HTMLElement>(
  elementRef: Ref<T | null>,
  callback: (event: MouseEvent) => void,
): void {
  // Handler that checks if the click is outside the provided element
  const handleClick = (event: MouseEvent): void => {
    // If the element doesn't exist, do nothing.
    if (!elementRef.value) return;

    // Use a type assertion to ensure that event.target is considered a Node.
    if (!elementRef.value.contains(event.target as Node)) {
      callback(event);
    }
  };

  // Register the event listener on component mount.
  onMounted(() => {
    document.addEventListener("click", handleClick);
  });

  // Clean up the event listener when the component unmounts.
  onUnmounted(() => {
    document.removeEventListener("click", handleClick);
  });
}
