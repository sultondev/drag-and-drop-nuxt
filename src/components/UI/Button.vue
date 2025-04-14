<script setup lang="ts">
import type { ButtonProps } from "~/types/components/button.types";

const attrs = useAttrs();
const { variant = "primary" } = defineProps<ButtonProps>();
</script>

<template>
  <button v-bind="attrs" :class="['btn', variant]">
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </button>
</template>

<style scoped>
.btn {
  outline: none;
  border-radius: 12px;
}

.primary {
  width: 100%;
  background-color: var(--primary-purple);
  color: #fff;
}

.secondary {
  background-color: var(--light-dark-gray);
  color: var(--milk-white);
}
</style>
