<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { IPaginationProps } from "~/types/components/pagination.types.ts";

const {total, size, maxView = 5} = defineProps<IPaginationProps>();
const currentPage = defineModel<number>({
  default: 1,
});
const router = useRouter();
const route = useRoute();

const pages = computed(() => Math.ceil(total / size));

function goToPage(page: number) {
  if (page !== currentPage.value && page >= 1 && page <= pages.value) {
    currentPage.value = page;
    router.push({ path: route.path, query: { ...route.query, page } });
  }
}

const paginationItems = computed(() => {
  const total = pages.value;
  const current = currentPage.value;
  const items: (number | string)[] = [];

  if (total <= maxView + 2) {
    for (let i = 1; i <= total; i++) items.push(i);
    return items;
  }

  const showLeftDots = currentPage.value > Math.floor(maxView / 2) + 2;
  const showRightDots = currentPage.value < total - Math.floor(maxView / 2) - 1;

  items.push(1); // Always show first page

  if (showLeftDots) items.push("...");

  const start = Math.max(
      2,
      Math.min(currentPage.value - Math.floor(maxView / 2), total - maxView)
  );
  const end = Math.min(total - 1, start + maxView - 1);

  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== total) items.push(i);
  }

  if (showRightDots) items.push("...");

  items.push(total); // Always show last page
  return items;
});
</script>

<template>
  <ul class="pagination-list flex items-center">
    <li class="page__item">
      <button
          class="link"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          aria-label="Previous page"
      >
        ‹
      </button>
    </li>

    <li
        v-for="(item, idx) in paginationItems"
        :key="idx"
        class="page__item"
        :class="{ active: item === currentPage }"
    >
      <button
          v-if="typeof item === 'number'"
          class="link"
          @click="goToPage(item)"
      >
        {{ item }}
      </button>
      <span v-else class="dots">...</span>
    </li>

    <li class="page__item">
      <button
          class="link"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= pages"
          aria-label="Next page"
      >
        ›
      </button>
    </li>
  </ul>
</template>

<style scoped>
.pagination-list {
  background-color: var(--easy-dark);
  padding: 8px;
  border-radius: 8px;
  gap: 6px;
}

.link {
  padding: 4px 12px;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  border: none;
  color: white;
}

.link[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

.page__item.active .link {
  background-color: var(--primary-dark);
  color: white;
}

.dots {
  padding: 4px 12px;
  color: #aaa;
}
</style>
