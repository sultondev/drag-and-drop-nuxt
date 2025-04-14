<script setup lang="ts">
import type {
  IActionsEmits,
  IActionsProps,
} from "~/types/components/actions.types.ts";

const { actions } = defineProps<IActionsProps>();
const isDropdownOpen = defineModel<boolean>();
const emits = defineEmits<IActionsEmits>();

const dropdownRef = ref<HTMLDivElement | null>(null);

useOutsideClick(dropdownRef, closeDropdown);

function closeDropdown() {
  isDropdownOpen.value = false;
}
</script>

<template>
  <div ref="dropdownRef" class="action-wrapper">
    <!-- The button toggles the dropdown -->
    <UIButton
      @click="isDropdownOpen = !isDropdownOpen"
      class="action__btn flex-center"
    >
      <Icon name="tabler:dots" />
    </UIButton>

    <!-- Transition wrapper with the custom transition name -->
    <transition name="dropdown">
      <!-- Render the dropdown only if open -->
      <ul v-if="isDropdownOpen" class="dropdown">
        <li v-for="action in actions" :key="action.name">
          <button
            @click="emits(action.name)"
            class="action__button flex items-center"
          >
            <Icon
              :name="action.icon"
              class="action__icon"
              :class="action.iconClass"
            />
            <span class="action__name" :class="action.nameClass">
              {{ action.name }}
            </span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
/* Set the parent to relative so the absolute dropdown is scoped correctly */
.action-wrapper {
  position: relative;
  width: fit-content;
}

/* Dropdown styling with absolute positioning */
.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background-color: var(--dark-gray);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  padding: 4px;
  list-style: none;
  min-width: 140px;
  overflow: hidden;
}

/* Transition CSS classes for smooth enter/leave effects */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Button within each dropdown item */
.action__button {
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  text-align: left;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.action__icon {
  color: var(--primary-gray);
}

.action__button:hover {
  background-color: var(--light-dark-gray);
}

.action__name {
  /* Additional styling for the text can be added here */
  color: #fff;
  font-size: 16px;
}

.action__btn {
  width: fit-content;
  padding: 4px;
  font-size: 24px;
}
</style>
