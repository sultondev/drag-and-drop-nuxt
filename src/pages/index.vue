<script setup lang="ts">
import DragDropItem from "~/components/UI/DragDropItem.vue";
import type { GameListItem } from "~/types/components/drag-drop-item.types";

const inquiriesStore = useInquiriesStore()

const pageForm = reactive({
  pageSize: 10,
  pageIndex: 1,
  totalItems: 0,
})

async function loadPageData(page = 1) {
  const { data } = await useFetch('/api/inquiries', {
    query: {
      page,
      perPage: pageForm.pageSize
    }
  })

  if (data.value) {
    const serverData = data.value.data as GameListItem[]
    pageForm.totalItems = data.value.pagination?.total || serverData.length

    // Sync store logic
    inquiriesStore.setOriginalData(serverData)
    inquiriesStore.currentPage = page
    inquiriesStore.replayHistoryForPage(page)
  }
}

// Initial load
onMounted(async () => {
  inquiriesStore.initializeFromStorage()
})

// await loadPageData(pageForm.pageIndex)

// Re-fetch on pageIndex change
watch(() => pageForm.pageIndex, async (page) => {
  await loadPageData(page)
})

// Drag handler (reorder)
function onDrop(event: DragEvent) {
  const fromPath = event.dataTransfer?.getData("text/plain")
  const toPath = (event.currentTarget as HTMLElement)?.dataset.finderId

  if (!fromPath || !toPath || fromPath === toPath) return

  inquiriesStore.moveItemByFinderPath(fromPath, toPath)
}
</script>
<template>
  <div class="container page-wrapper">
    <header class="header flex items-center justify-between">
      <div class="header-left flex items-center">
        <h1 class="header__title">Game List</h1>

        <UIIndicator variant="neon-green">
          <span class="header__info"> Found: {{ inquiriesStore.inquiries?.length }} </span>
        </UIIndicator>
      </div>
      <div class="flex gap-x-3">
        <UIButton
          variant="secondary"
          class="action__btn"
          @click="inquiriesStore.undo"
        >
          <Icon name="icon-park-outline:return" class="undo__icon" />
        </UIButton>
        <UIButton
          variant="secondary"
          class="action__btn"
          @click="inquiriesStore.redo"
        >
          <Icon name="icon-park-outline:return" class="redo__icon" />
        </UIButton>
      </div>
    </header>
    <div class="main-content flex flex-col gap-y-1">
      <DragDropItem
        v-for="(item, index) in inquiriesStore.inquiries"
        :data="item"
        :order="index"
        :on-drop="onDrop"
        :item-idx="String(index)"
        is-last-item
        :key="item.id"
      />
    </div>

    <footer class="flex justify-between items-center">
      <span>
        showing {{ pageForm.pageSize }} of {{ pageForm.totalItems }}
      </span>

      <UIPagination
        v-model="pageForm.pageIndex"
        :size="pageForm.pageSize"
        :total="pageForm.totalItems"
      />
    </footer>
  </div>
</template>

<style scoped>
.page-wrapper {
  padding: 60px;
}

.main-content {
  padding: 34px 0;
}

.header-left {
  column-gap: 14px;
}
.header__title {
  font-weight: 600;
  font-size: 28px;
  line-height: 36px;
  vertical-align: middle;
  color: var(--milk-white);
}

.header__info {
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0px;
  color: var(--primary-dark);
  vertical-align: middle;
}

.action__btn {
  padding: 8px;
  height: fit-content;
}

.redo__icon {
  transform: scaleX(-1);
}
</style>
