<script setup lang="ts">
import type {ButtonProps} from "~/types/components/button.types";

const attrs = useAttrs()
const {variant = 'primary'} = defineProps<ButtonProps>()


</script>

<template>
  <button v-bind="attrs" :class="[variant]">
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </button>
</template>

<style scoped>
.primary {
  width: 100%;
  background-color: var(--primary-purple);
  color: #fff;
  outline: none;
  border-radius: 12px;
}
</style>