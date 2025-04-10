<script lang="ts" setup>
import { defineProps, computed, ref } from 'vue'
import type { Inquiry } from '~/types'

// Принимаем данные элемента и функцию для обработки перемещения
const props = defineProps<{
  inquiry: Inquiry
  onDrop: (dragId: string, dropId: string, dropPosition: 'before' | 'after' | 'inside') => void
}>()

// Локальные ссылки для работы с DOM, если требуется
const inquiryRef = ref<HTMLElement | null>(null)

// Обработчик начала перетаскивания
const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData('text/plain', props.inquiry.id)
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
    props.onDrop(dragId, props.inquiry.id, dropPosition)
  }
}
</script>

<template>
  <div
      ref="inquiryRef"
      draggable="true"
      @dragstart="onDragStart"
      @dragover="onDragOver"
      @drop="onDropHandler"
      class="inquiry-item"
  >
    <!-- Содержимое обращения -->
    <div>{{ inquiry.folderName }}</div>

    <!-- Если есть дочерние обращения, рекурсивно рендерим -->
    <div v-if="inquiry.subCategories && inquiry.subCategories.length" class="children-list">
      <DraggableInquiry
          v-for="child in inquiry.subCategories"
          :key="child.id"
          :inquiry="child"
          :onDrop="onDrop"
      />
    </div>
  </div>
</template>

<style scoped>
.inquiry-item {
  border: 1px solid #ddd;
  padding: 8px;
  margin-bottom: 4px;
  background-color: #cdcdcd;
  /* Пример адаптивной верстки */
}
.children-list {
  margin-left: 20px;
}
</style>
