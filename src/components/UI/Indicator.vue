<script setup lang="ts">
import type { IPropsIndicator } from "~/types/components/indicator.types";

const { variant } = defineProps<IPropsIndicator>();
</script>

<template>
  <div class="indicator" :class="variant">
    <slot />
  </div>
</template>

<style scoped>
.success {
  background-color: var(--dark-green);
  color: var(--light-green);
}

.neon-green {
  background-color: var(--light-green);
  color: var(--primary-dark);
}

.indicator {
  width: fit-content;
  height: fit-content;
  padding: 1px 10px;
  border-radius: 30px;
}
</style>
