<script setup lang="ts">
import type { IDragProps } from "@/types/components/drag-drop-item.types";
import type { Inquiry } from "~/types";
import CollapseExpand from "~/components/UI/CollapseExpand.vue";
import Actions from "~/components/UI/Actions.vue";
import { GAME_LIST_ACTIONS } from "~/constants/actions-list.constant";
import Indicator from "~/components/UI/Indicator.vue";

const { data, indexNumber, onDrop, isSubCategories, order } =
  defineProps<IDragProps>();

// Локальные ссылки для работы с DOM, если требуется
const elementRef = ref<HTMLElement | null>(null);
// Обработчик начала перетаскивания
const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData("text/plain", data.id);
  event.target?.classList?.add('dragging')
  // Можно задать эффект, например: event.dataTransfer.effectAllowed = 'move'
};

const onDragEnd = (event: DragEvent) => {
  event.target?.classList?.remove('dragging');
  // Можно задать эффект, например: event.dataTransfer.effectAllowed = 'move'
};


// Обработчик перетаскивания над элементом
const onDragOver = (event: DragEvent) => {
  event.preventDefault(); // разрешаем drop
  // Можно определить позицию курсора и визуальные подсказки
};

// Обработчик отпускания
const onDropHandler = (event: DragEvent) => {
  console.log(event)
  const dragId = event.dataTransfer?.getData("text/plain");

  // Здесь определяется, куда именно был помещён элемент:
  // — до, после или внутрь данного элемента, в зависимости от положения курсора
  const dropPosition: "before" | "after" | "inside" = "inside"; // пример, далее рассчитать динамически
  if (dragId) {
    onDrop(dragId, data.id, dropPosition);
  }
};
const isCollapseOpen = ref(false);
</script>

<template>
    <div
      class="wrapper "
      :class="{ 'wrapper-sub': isSubCategories }"
      ref="elementRef"
      draggable="true"
      :id="data.id"
      @dragstart="onDragStart"
      @dragover="onDragOver"
      @drop="onDropHandler"
      @dragend="onDragEnd"
    >
      <div class="item" :class="{'has-sub': data?.subCategories?.length > 0}">
        <div class="flex flex-col gap-2">
          <span class="item-index labels"> № </span>
          <span class="">
            {{ indexNumber }}
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <span class="item-index labels"> Name </span>
          <span class="flex items-center gap-2">
            <Icon name="tabler:folder-filled" class="folder-icon" />
            <span class="">
              {{ data.folderName }}
            </span>
          </span>
        </div>
        <div class="flex flex-col gap-2">
          <span class="item-index labels">
            order
          </span>
          <span class="">
            {{order + 1}}
          </span>
        </div>
        <div v-if="data?.subCategories?.length > 0" class="flex flex-col gap-2">
          <span class="item-index labels"> sub categories </span>
          <div class="flex">
              <span class="sub-category">
                <template
                  v-for="(item, idx) in data.subCategories"
                  :key="item.folderName"
                  class=""
                >
                  {{
                    `${item.folderName} ${idx + 1 !== data.subCategories?.length ? " / " : ""}`
                  }}
                </template>
              </span>
          </div>
        </div>
        <div class="flex items-center flex-end gap-2">
          <Indicator v-if="data?.subCategories?.length > 0" variant="success" class="counter">
            {{data?.subCategories?.length}}
          </Indicator>
          <UIButton
            @click="isCollapseOpen = !isCollapseOpen"
            class="collapse-btn flex-center"
            :class="{ 'collapse-btn__open': isCollapseOpen }"
          >
            <Icon name="tabler:chevron-down" />
          </UIButton>
          <Actions :actions="GAME_LIST_ACTIONS" />
        </div>
      </div>
      <CollapseExpand
        dimension="height"
        :duration="400"
        easing="ease-in-out"
        name="drag-drop-collapse"
      >
        <div v-show="isCollapseOpen" class="">
          <DragDropItem
            v-for="(item, subIdx) in data.subCategories"
            :data="item"
            :index-number="`${indexNumber}.${subIdx + 1}`"
            is-sub-categories
            :on-drop="onDropHandler"
            :order="subIdx"
          />
        </div>
      </CollapseExpand>
    </div>
</template>

<style scoped>
.wrapper {
  background-color: var(--secondary-dark);
  border-radius: 12px;
}

.item {
  display: grid;
  grid-template-columns: 66px 0.5fr 0.5fr 130px;
  .item-index {
    color: var(--primary-gray);
  }
}

.item.has-sub {
  grid-template-columns: 66px 0.6fr 0.4fr 1fr 130px;
}

.labels {
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  vertical-align: middle;
  text-transform: capitalize;
  display: block;
  margin-bottom: 9px;
}

.wrapper .item {
  padding: 14px 0;
  margin: 0 22px;
}

.wrapper .item.has-sub {
  padding: 14px 22px;
  margin: 0;
}

.dragging {
  border: none;
  background-color: var(--secondary-light-purple);
}

.dragging .wrapper {
  background-color: var(--secondary-light-purple);
}

.folder-icon {
  color: var(--primary-gray);
}

.wrapper-sub {
  border-top: 1px solid var(--light-gray-dark);
  border-radius: 0;
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
  height: fit-content;
  font-size: 16px;
  transition: 400ms all linear;
}
.collapse-btn__open {
  transform: rotate(180deg);
}

.counter {
  margin-right: 8px;
}
</style>
