<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type { CollapseExpandEmits } from "@/types/components/collapse-expand.types.ts";

/**
 * Define component props
 */
interface Props {
  name: string;
  dimension: "height" | "width";
  duration: number;
  easing: string;
}

const {
  name = "collapse",
  dimension = "height",
  duration = 300,
  easing = "ease-in-out",
} = defineProps<Props>();

/**
 * Define emitted events – note that all events now use `Element` as the type.
 */
const emit = defineEmits<CollapseExpandEmits>();

/**
 * This ref will cache the dimensions (and related paddings) of the transitioning element.
 */
const cachedStyles = ref<Record<string, string> | null>(null);

/**
 * Computed property that returns a CSS transition string for each property that will be animated.
 */
const transition = computed(() => {
  if (!cachedStyles.value) return "";
  const transitions: string[] = [];
  for (const key in cachedStyles.value) {
    transitions.push(`${convertToCssProperty(key)} ${duration}ms ${easing}`);
  }
  return transitions.join(", ");
});

/**
 * When the `dimension` prop changes, clear the cached dimensions.
 */
watch(
  () => dimension,
  () => {
    clearCachedDimensions();
  },
);

/* Transition hook methods – note that the parameter is now of type `Element`.
   Inside the functions, if you need HTMLElement‐only properties (like offsetHeight),
   you can cast the element to HTMLElement. */

function beforeAppear(el: Element): void {
  emit("before-appear", el);
}

function appear(el: Element): void {
  emit("appear", el);
}

function afterAppear(el: Element): void {
  emit("after-appear", el);
}

function appearCancelled(el: Element): void {
  emit("appear-cancelled", el);
}

function beforeEnter(el: Element): void {
  emit("before-enter", el);
}

function enter(el: Element, done: () => void): void {
  const htmlEl = el as HTMLElement;
  detectAndCacheDimensions(htmlEl);
  setClosedDimensions(htmlEl);
  hideOverflow(htmlEl);
  forceRepaint(htmlEl);
  setTransition(htmlEl);
  setOpenedDimensions(htmlEl);

  emit("enter", el, done);
  setTimeout(done, duration);
}

function afterEnter(el: Element): void {
  const htmlEl = el as HTMLElement;
  unsetOverflow(htmlEl);
  unsetTransition(htmlEl);
  unsetDimensions(htmlEl);
  clearCachedDimensions();
  emit("after-enter", el);
}

function enterCancelled(el: Element): void {
  emit("enter-cancelled", el);
}

function beforeLeave(el: Element): void {
  emit("before-leave", el);
}

function leave(el: Element, done: () => void): void {
  const htmlEl = el as HTMLElement;
  detectAndCacheDimensions(htmlEl);
  setOpenedDimensions(htmlEl);
  hideOverflow(htmlEl);
  forceRepaint(htmlEl);
  setTransition(htmlEl);
  setClosedDimensions(htmlEl);

  emit("leave", el, done);
  setTimeout(done, duration);
}

function afterLeave(el: Element): void {
  const htmlEl = el as HTMLElement;
  unsetOverflow(htmlEl);
  unsetTransition(htmlEl);
  unsetDimensions(htmlEl);
  clearCachedDimensions();
  emit("after-leave", el);
}

function leaveCancelled(el: Element): void {
  emit("leave-cancelled", el);
}

/* Utility functions – these continue to work with HTMLElement since they access DOM-specific properties. */

function detectAndCacheDimensions(el: HTMLElement): void {
  if (cachedStyles.value !== null) return;

  const originalVisibility = el.style.visibility;
  const originalDisplay = el.style.display;

  el.style.visibility = "hidden";
  el.style.display = "";
  cachedStyles.value = detectRelevantDimensions(el);
  el.style.visibility = originalVisibility;
  el.style.display = originalDisplay;
}

function clearCachedDimensions(): void {
  cachedStyles.value = null;
}

function detectRelevantDimensions(el: HTMLElement): Record<string, string> {
  if (dimension === "height") {
    return {
      height: el.offsetHeight + "px",
      paddingTop: el.style.paddingTop || getCssValue(el, "padding-top"),
      paddingBottom:
        el.style.paddingBottom || getCssValue(el, "padding-bottom"),
    };
  } else if (dimension === "width") {
    return {
      width: el.offsetWidth + "px",
      paddingLeft: el.style.paddingLeft || getCssValue(el, "padding-left"),
      paddingRight: el.style.paddingRight || getCssValue(el, "padding-right"),
    };
  }
  return {};
}

function setTransition(el: HTMLElement): void {
  el.style.transition = transition.value;
}

function unsetTransition(el: HTMLElement): void {
  el.style.transition = "";
}

function hideOverflow(el: HTMLElement): void {
  el.style.overflow = "hidden";
}

function unsetOverflow(el: HTMLElement): void {
  el.style.overflow = "";
}

function setClosedDimensions(el: HTMLElement): void {
  if (!cachedStyles.value) return;
  Object.keys(cachedStyles.value).forEach((key) => {
    el.style.setProperty(key, "0");
  });
}

function setOpenedDimensions(el: HTMLElement): void {
  if (!cachedStyles.value) return;
  Object.keys(cachedStyles.value).forEach((key) => {
    el.style.setProperty(key, cachedStyles.value![key]);
  });
}

function unsetDimensions(el: HTMLElement): void {
  if (!cachedStyles.value) return;
  Object.keys(cachedStyles.value).forEach((key) => {
    el.style.removeProperty(key);
  });
}

function forceRepaint(el: HTMLElement): void {
  // Accessing a property forces the browser to repaint.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  getComputedStyle(el)[dimension];
}

function getCssValue(el: HTMLElement, styleProp: string): string {
  return getComputedStyle(el).getPropertyValue(styleProp);
}

function convertToCssProperty(style: string): string {
  const upperChars = style.match(/([A-Z])/g);
  if (!upperChars) {
    return style;
  }
  for (const char of upperChars) {
    style = style.replace(new RegExp(char), "-" + char.toLowerCase());
  }
  if (style.startsWith("-")) {
    style = style.slice(1);
  }
  return style;
}
</script>

<template>
  <transition
    :name="name"
    @appear="appear"
    @enter="enter"
    @leave="leave"
    @before-appear="beforeAppear"
    @after-appear="afterAppear"
    @appear-cancelled="appearCancelled"
    @before-enter="beforeEnter"
    @after-enter="afterEnter"
    @enter-cancelled="enterCancelled"
    @before-leave="beforeLeave"
    @after-leave="afterLeave"
    @leave-cancelled="leaveCancelled"
  >
    <slot></slot>
  </transition>
</template>
