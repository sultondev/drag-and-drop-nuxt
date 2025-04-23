<script setup lang="ts">
import DragDropItem from "~/components/UI/DragDropItem.vue";
import type { GameListItem } from "~/types/components/drag-drop-item.types";
import {swapItemsInSameParent} from "@/utils/reorder.utils.ts"

const dataList = ref<GameListItem[]>([
  {
    folderName: "Call of Duty",
    order: 49,
    id: "uuid-49",
    subCategories: [
      { folderName: "Gloves", order: 1, subCategories: [], id: "uuid-49-1" },
      {
        folderName: "Heavy",
        order: 2,
        subCategories: [
          {
            folderName: "Gloves",
            order: 1,
            subCategories: [
              {
                folderName: "Heavy",
                order: 2,
                subCategories: [],
                id: "uuid-50-22",
              },
            ],
            id: "uuid-5230-1",
          },
        ],
        id: "uuid-49-2",
      },
    ],
  },
  {
    folderName: "Battlefield",
    order: 50,
    id: "uuid-50",
    subCategories: [
      { folderName: "Gloves", order: 1, subCategories: [], id: "uuid-50-1" },
      { folderName: "Heavy", order: 2, subCategories: [], id: "uuid-50-2" },
      { folderName: "Knives", order: 3, subCategories: [], id: "uuid-50-3" },
    ],
  },
]);

const inquiriesStore = useInquiriesStore();
const pageForm = reactive({
  pageSize: 10,
  pageIndex: 1,
  totalItems: 156,
});
// При маунте страницы, если список обращений пустой, загружаем данные из API
onMounted(async () => {
  inquiriesStore.initializeFromStorage();
  // localStorage.setItem('inquiries', JSON.stringify(dataList.value))
  // if (!inquiriesStore.inquiries.length) {
  //   const { data } = await useFetch("/api/inquiries?page=1&perPage=10");
  //   if (data.value) {
  //     inquiriesStore.updateInquiries(data.value.data);
  //   }
  // }
});

function onDrop(event: DragEvent) {
  const fromPath = event.dataTransfer?.getData('text/plain')?.split('.').map(Number)
  const toPath = (event.currentTarget as HTMLElement)?.dataset.finderId?.split('.').map(Number)

  if (!fromPath || !toPath) return
  if (fromPath.join('.') === toPath.join('.')) return

  const cloned = JSON.parse(JSON.stringify(inquiriesStore.inquiries))
  const success = swapItemsInSameParent(cloned, fromPath, toPath)

  if (success) {
    inquiriesStore.updateInquiries(cloned)
  }
}

onMounted(() => {
  inquiriesStore.initializeFromStorage()
})
</script>

<template>
  <div class="container page-wrapper">
    <header class="header flex items-center justify-between">
      <div class="header-left flex items-center">
        <h1 class="header__title">Game List</h1>

        <UIIndicator variant="neon-green">
          <span class="header__info"> Found: {{ dataList?.length }} </span>
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
        is-first-parent
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
