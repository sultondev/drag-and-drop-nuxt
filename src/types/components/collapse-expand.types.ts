export interface CollapseExpandEmits {
    (e: "before-appear", el: Element): void;

    (e: "appear", el: Element, done?: () => void): void;

    (e: "after-appear", el: Element): void;

    (e: "appear-cancelled", el: Element): void;

    (e: "before-enter", el: Element): void;

    (e: "enter", el: Element, done: () => void): void;

    (e: "after-enter", el: Element): void;

    (e: "enter-cancelled", el: Element): void;

    (e: "before-leave", el: Element): void;

    (e: "leave", el: Element, done: () => void): void;

    (e: "after-leave", el: Element): void;

    (e: "leave-cancelled", el: Element): void;
}