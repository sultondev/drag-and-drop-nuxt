import type { GameListItem } from "~/types/components/drag-drop-item.types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page || 1);
  const perPage = Number(query.perPage || 10);

  const allData = (await useStorage("assets:server").getItem(
    `inquiries.json`,
  )) as GameListItem[];

  if (allData == null) {
    return {
      success: false,
      data: [],
      pagination: {
        total: 0,
        perPage,
        currentPage: 1,
        hasNext: true,
        hasPrevious: true,
      },
    };
  }

  const total = allData?.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = allData.slice(start, end);

  const hasNext = end < total;
  const hasPrevious = start > 0;

  return {
    data: paginated,
    pagination: {
      total,
      currentPage: page,
      perPage,
      hasNext,
      hasPrevious,
    },
  };
});
