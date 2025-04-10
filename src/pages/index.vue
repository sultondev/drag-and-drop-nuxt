<script setup lang="ts">

import DragDropItem from "~/components/UI/DragDropItem.vue";
import DraggableInquiry from "~/components/UI/DraggableInquiry.vue";
import type {GameListItem} from "~/types/components/drag-drop-item.types";

const dataList: GameListItem[] = [{
  folderName: "Dota 2",
  order: 1,
  id:"dsadsa-dsadsa-dsadsa-dsads",
  subCategories: [
    { folderName: "Gloves", order: 1, id: "dsadas-dsad-dsdas", subCategories:[] },
    { folderName: "Heavy", order: 2, id: "23312-23123-213-21", subCategories:[] },
  ],
}]

const inquiriesStore = useInquiriesStore()

// При маунте страницы, если список обращений пустой, загружаем данные из API
onMounted(async () => {
  inquiriesStore.initializeFromStorage()
  if (!inquiriesStore.inquiries.length) {
    const { data } = await useFetch('/api/inquiries?page=1&perPage=10')
    if (data.value) {
      inquiriesStore.updateInquiries(data.value.data)
    }
  }
})

// Обработчик перемещения элементов (бизнес-логика перемещения)
function handleDrop(dragId: string, dropId: string, dropPosition: 'before' | 'after' | 'inside') {
  // Получаем текущий список обращений
  let currentList = inquiriesStore.inquiries

  // Функция для поиска и удаления элемента по id во вложенной структуре
  function removeItem(list: any[]): any | null {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === dragId) {
        return list.splice(i, 1)[0]
      }
      if (list[i].children && list[i].children.length) {
        const removed = removeItem(list[i].children)
        if (removed) return removed
      }
    }
    return null
  }

  const draggedItem = removeItem(currentList)
  if (!draggedItem) return

  // Функция для поиска элемента по id (возвращает ссылку на элемент)
  function findItem(list: any[]): any | null {
    for (const item of list) {
      if (item.id === dropId) return item
      if (item.children && item.children.length) {
        const found = findItem(item.children)
        if (found) return found
      }
    }
    return null
  }

  const targetItem = findItem(currentList)

  if (!targetItem) {
    // Если целевого элемента не найдено, можно вернуть элемент в исходное положение
    inquiriesStore.updateInquiries(currentList)
    return
  }

  // Обработка позиции перетаскивания
  if (dropPosition === 'inside') {
    // Вложить элемент внутрь найденного
    if (!targetItem.children) {
      targetItem.children = []
    }
    targetItem.children.push(draggedItem)
  } else {
    // Предположим, что dropPosition 'before' или 'after' применяется к элементу верхнего уровня текущего списка.
    // Здесь может потребоваться реализовать логику определения родительского списка.
    const parentList = currentList // упрощённо: рассматривать список корневых элементов
    const index = parentList.findIndex(el => el.id === dropId)
    if (index !== -1) {
      const insertIndex = dropPosition === 'before' ? index : index + 1
      parentList.splice(insertIndex, 0, draggedItem)
    }
  }

  // Обновляем состояние с сохранением истории
  inquiriesStore.updateInquiries([...currentList])
}
</script>

<template>
  <div>
    <header>
      <button @click="inquiriesStore.undo">Undo</button>
      <button @click="inquiriesStore.redo">Redo</button>
    </header>
    <div class="container">
      <DragDropItem v-for="item in dataList" :data="item" :on-drop="handleDrop"  index-number="1" />
<!--      <DraggableInquiry :inquiry="item" :on-drop="handleDrop" />-->
<!--      <DraggableInquiry :inquiry="item" :on-drop="handleDrop" />-->
    </div>
  </div>
</template>

<style scoped>

</style>