<script setup lang="ts">
import DragDropItem from "~/components/UI/DragDropItem.vue";
import DraggableInquiry from "~/components/UI/DraggableInquiry.vue";
import type { GameListItem } from "~/types/components/drag-drop-item.types";

const beingDragover = ref(false);
const dataList: GameListItem[] = [
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
];

const inquiriesStore = useInquiriesStore();

// При маунте страницы, если список обращений пустой, загружаем данные из API
onMounted(async () => {
  inquiriesStore.initializeFromStorage();
  if (!inquiriesStore.inquiries.length) {
    const { data } = await useFetch("/api/inquiries?page=1&perPage=10");
    if (data.value) {
      inquiriesStore.updateInquiries(data.value.data);
    }
  }
});

// Обработчик перемещения элементов (бизнес-логика перемещения)
function handleDrop(
  dragId: string,
  dropId: string,
  dropPosition: "before" | "after" | "inside",
) {
  // Получаем текущий список обращений
  let currentList = inquiriesStore.inquiries;

  // Функция для поиска и удаления элемента по id во вложенной структуре
  function removeItem(list: any[]): any | null {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === dragId) {
        return list.splice(i, 1)[0];
      }
      if (list[i].children && list[i].children.length) {
        const removed = removeItem(list[i].children);
        if (removed) return removed;
      }
    }
    return null;
  }

  const draggedItem = removeItem(currentList);
  if (!draggedItem) return;

  // Функция для поиска элемента по id (возвращает ссылку на элемент)
  function findItem(list: any[]): any | null {
    for (const item of list) {
      if (item.id === dropId) return item;
      if (item.children && item.children.length) {
        const found = findItem(item.children);
        if (found) return found;
      }
    }
    return null;
  }

  const targetItem = findItem(currentList);

  if (!targetItem) {
    // Если целевого элемента не найдено, можно вернуть элемент в исходное положение
    inquiriesStore.updateInquiries(currentList);
    return;
  }

  // Обработка позиции перетаскивания
  if (dropPosition === "inside") {
    // Вложить элемент внутрь найденного
    if (!targetItem.children) {
      targetItem.children = [];
    }
    targetItem.children.push(draggedItem);
  } else {
    // Предположим, что dropPosition 'before' или 'after' применяется к элементу верхнего уровня текущего списка.
    // Здесь может потребоваться реализовать логику определения родительского списка.
    const parentList = currentList; // упрощённо: рассматривать список корневых элементов
    const index = parentList.findIndex((el) => el.id === dropId);
    if (index !== -1) {
      const insertIndex = dropPosition === "before" ? index : index + 1;
      parentList.splice(insertIndex, 0, draggedItem);
    }
  }

  // Обновляем состояние с сохранением истории
  inquiriesStore.updateInquiries([...currentList]);
}

function dragEnd(event: DragEvent) {
  event.preventDefault();

  // Retrieve the element's id
  const id = event.dataTransfer?.getData("text/plain");
  if (id) {
    const draggedElement = document.getElementById(id);
    event.target?.appendChild(draggedElement);
  }

  // Move the original element to the drop zone
}
</script>

<template>
  <div class="">
    <span class=""> playground </span>
    <div class="container flex flex-col gap-y-1">
      <DragDropItem
        v-for="(item, index) in dataList"
        :data="item"
        :order="index"
        :on-drop="handleDrop"
        :index-number="String(index + 1)"
      />
    </div>

    <div
      @dragover="
        (e) => {
          e.preventDefault();
          beingDragover = true;
        }
      "
      @dragleave="
        (e) => {
          e.preventDefault();
          beingDragover = false;
        }
      "
      @drop="dragEnd"
      class="zone"
      :class="{ zone__over: beingDragover }"
    ></div>
  </div>
</template>

<style scoped>
.zone {
  width: 100%;
  height: 100px;
  background: #fff;
}

.zone__over {
  background: red;
}
</style>
