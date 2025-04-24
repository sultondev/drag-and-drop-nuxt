<script setup lang="ts">
import type { IDragProps } from "@/types/components/drag-drop-item.types";
import CollapseExpand from "~/components/UI/CollapseExpand.vue";
import Actions from "~/components/UI/Actions.vue";
import { GAME_LIST_ACTIONS } from "~/constants/actions-list.constant";
import Indicator from "~/components/UI/Indicator.vue";

const { data, parentIdx, itemIdx, onDrop, isSubCategories, order } =
  defineProps<IDragProps>();

const elementRef = ref<HTMLElement | null>(null);
const isDropZoneActive = ref(false)
const isActionsOpen = ref(false)

const onDragStart = (event: DragEvent) => {
  const target = event.target as HTMLElement;
  isActionsOpen.value = false
  event.dataTransfer?.setData("text/plain", event.target?.attributes['data-finder-id'].value);
  target?.classList?.add('dragging')
};

const onDragEnd = (event: DragEvent) => {
  const target = event.target as HTMLElement;
  target?.classList?.remove('dragging');
  isDropZoneActive.value = false

};


const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  nextTick(() => {
    isDropZoneActive.value = true
  })
};

const onDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDropZoneActive.value = false
}

const onDropHandler = (event: DragEvent) => {
  const dragId = event.dataTransfer?.getData("text/plain");

  const dropPosition: "before" | "after" | "inside" = "inside"; // пример, далее рассчитать динамически
  if (dragId) {
    onDrop(event)
    nextTick(() => {
      isDropZoneActive.value = false
    })
  }
};
const isCollapseOpen = ref(false);
const finderId = computed(() => {
  return `${parentIdx ? parentIdx + '.' : ''}${itemIdx}`
})

const indexNumber = computed(() => {
  const parents = parentIdx ? parentIdx.split('.').map(item => Number(item) + 1) : [];
  return `${parentIdx ? parents.join('.') + '.' : ''}${Number(itemIdx) + 1}`
})

</script>

<template>
  <div :class="{'parent-wrapper': !parentIdx}">
    <div
      class="wrapper"
      :class="{
        'wrapper-sub': isSubCategories,
        'zone': isDropZoneActive,
        'the-last-item':isLastItem && !isCollapseOpen
      }"
      ref="elementRef"
      draggable="true"
      :id="data.id"
      :data-finder-id="finderId"
      @dragstart="onDragStart"
      @dragover="onDragOver"
      @drop="onDrop"
      @dragleave="onDragLeave"
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
              v-if="data?.subCategories?.length > 0"
            @click="isCollapseOpen = !isCollapseOpen"
            class="collapse-btn flex-center"
            :class="{ 'collapse-btn__open': isCollapseOpen }"
          >
            <Icon name="tabler:chevron-down" />
          </UIButton>
          <Actions v-model="isActionsOpen" :actions="GAME_LIST_ACTIONS" />
        </div>
      </div>
    </div>

    <CollapseExpand
        dimension="height"
        :duration="400"
        easing="ease-in-out"
        name="drag-drop-collapse"
    >
      <div v-show="isCollapseOpen" class="sub-items">
        <DragDropItem
            v-for="(item, subIdx) in data.subCategories"
            :data="item"
            :parent-idx="finderId"
            :item-idx="String(subIdx)"
            is-sub-categories
            :on-drop="onDropHandler"
            :is-last-item="subIdx === data?.subCategories?.length - 1"
            :order="subIdx"
            :key="item.id+subIdx"
        />
      </div>
    </CollapseExpand>
  </div>
</template>

<style scoped>
.parent-wrapper > .wrapper {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.the-last-item {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.wrapper {
  background-color: var(--secondary-dark);
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

.zone {
  height: 73px;
  background-color: var(--secondary-light-purple);
  border: 1px dashed var(--primary-purple);
}
</style>
