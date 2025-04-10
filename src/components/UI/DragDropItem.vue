<script setup lang="ts">
import type { IDragProps } from "@/types/components/drag-drop-item.types";
import type { Inquiry } from '~/types'
import CollapseExpand from "~/components/UI/CollapseExpand.vue";

const { data, indexNumber, onDrop, isSubCategories} = defineProps<IDragProps>()


// Локальные ссылки для работы с DOM, если требуется
const inquiryRef = ref<HTMLElement | null>(null)

// Обработчик начала перетаскивания
const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData('text/plain', data.id)
  // Можно задать эффект, например: event.dataTransfer.effectAllowed = 'move'
}

// Обработчик перетаскивания над элементом
const onDragOver = (event: DragEvent) => {
  event.preventDefault()  // разрешаем drop
  // Можно определить позицию курсора и визуальные подсказки
}

// Обработчик отпускания
const onDropHandler = (event: DragEvent) => {
  event.preventDefault()
  const dragId = event.dataTransfer?.getData('text/plain')
  // Здесь определяется, куда именно был помещён элемент:
  // — до, после или внутрь данного элемента, в зависимости от положения курсора
  const dropPosition: 'before' | 'after' | 'inside' = 'inside' // пример, далее рассчитать динамически
  if (dragId) {
    onDrop(dragId, data.id, dropPosition)
  }
}
const isCollapseOpen = ref(false)
</script>

<template>
  <div class="">
    <div class="wrapper"
         :class="{ 'wrapper-sub': isSubCategories }"
         ref="inquiryRef"
         draggable="true"
         @dragstart="onDragStart"
         @dragover="onDragOver"
         @drop="onDropHandler"
    >
      <div class="item"
      >
        <div class="flex flex-col gap-y-2">
          <span class=item-index>
            №
          </span>
          <span class="">
            {{indexNumber}}
          </span>
        </div>

        <div class="flex flex-col gap-y-2">
          <span class=item-index>
            Name
          </span>
          <span class="flex">
            <Icon name="tabler:folder-filled" />
            <span class="">
            {{data.folderName}}
            </span>
          </span>
        </div>
        <div class="flex flex-col gap-y-2">
          <span class=item-index>
            Name
          </span>
          <div class="flex">
            <Icon name="tabler:folder-filled" />
            <div class="flex">
              <span class="sub-category">
                <template v-for="(item, idx) in data.subCategories" :key="item.folderName" class="">
                  {{ `${item.folderName} ${ idx + 1 !== data.subCategories?.length ? " / " : ""}` }}
                </template>
              </span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-y-2">
          <UIButton @click="isCollapseOpen = !isCollapseOpen" class="collapse-btn" :class="{'collapse-btn__open': isCollapseOpen}">
            <Icon name="tabler:chevron-down" />
          </UIButton>
        </div>
      </div>
    <CollapseExpand dimension="height" :duration="400" easing="ease-in-out" name="drag-drop-collapse">
      <div v-show="isCollapseOpen" class="">
        <DragDropItem v-for="(item, subIdx) in data.subCategories" :data="item" :index-number="`${indexNumber}.${subIdx}`" is-sub-categories :on-drop="onDropHandler" />
      </div>
    </CollapseExpand>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 18px 22px;
  background-color: var(--secondary-dark);
  border-radius: 12px;
}

.item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  .item-index {
    color: var(--primary-gray);
  }
}

.wrapper-sub {
  border-top: 1px solid var(--light-gray-dark);
  border-radius: 0;
  padding: 0;
  margin-top: 18px;
  padding-top: 12px;
}

.sub-category {
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collapse-btn {
  text-align: center;
  width: fit-content;
  padding: 8px;
  font-size: 16px;
  transition: 400ms all linear;
}
.collapse-btn__open {
  transform: rotate(180deg);
}
</style>