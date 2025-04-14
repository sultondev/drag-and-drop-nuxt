// /stores/inquiriesStore.ts
import type { Inquiry } from "~/types";
import { ref, computed } from "vue";

export const useInquiriesStore = defineStore("inquiries", () => {
  // Основной список обращений
  const inquiries = ref<Inquiry[]>([]);

  // История изменений (храним копии состояния)
  const history = ref<Inquiry[][]>([]);
  let historyIndex = ref<number>(-1);
  const maxHistory = 20;

  // Функция для фиксации нового состояния
  function pushHistory(newState: Inquiry[]) {
    // Обрезаем историю, если текущий индекс не равен последнему
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }
    history.value.push(JSON.parse(JSON.stringify(newState)));
    if (history.value.length > maxHistory) {
      history.value.shift();
    }
    historyIndex.value = history.value.length - 1;
    // Сохраняем историю в localStorage для постоянства
    localStorage.setItem("inquiriesHistory", JSON.stringify(history.value));
  }

  // Функции Undo и Redo
  function undo() {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      inquiries.value = JSON.parse(
        JSON.stringify(history.value[historyIndex.value]),
      );
      // сохраняем обновлённое состояние
      localStorage.setItem("inquiriesState", JSON.stringify(inquiries.value));
    }
  }

  function redo() {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++;
      inquiries.value = JSON.parse(
        JSON.stringify(history.value[historyIndex.value]),
      );
      localStorage.setItem("inquiriesState", JSON.stringify(inquiries.value));
    }
  }

  // Функция обновления состояния (например, после Drag & Drop)
  function updateInquiries(newList: Inquiry[]) {
    inquiries.value = newList;
    pushHistory(newList);
    localStorage.setItem("inquiriesState", JSON.stringify(newList));
  }

  // Инициализация состояния из localStorage (если данные сохранены)
  function initializeFromStorage() {
    const storedState = localStorage.getItem("inquiriesState");
    const storedHistory = localStorage.getItem("inquiriesHistory");
    if (storedState) {
      inquiries.value = JSON.parse(storedState);
    }
    if (storedHistory) {
      history.value = JSON.parse(storedHistory);
      historyIndex.value = history.value.length - 1;
    }
  }

  return {
    inquiries,
    updateInquiries,
    undo,
    redo,
    pushHistory,
    initializeFromStorage,
  };
});
