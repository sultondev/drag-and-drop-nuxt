<script setup lang="ts">
import type { IDragProps } from "@/types/components/drag-drop-item.types";
const { data, indexNumber } = defineProps<IDragProps>()


</script>

<template>
  <div class="item">
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
            <template v-for="(item, idx) in data.subCategories" :key="item.name" class="">
              {{ `${item.name} ${ idx + 1 !== data.subCategories?.length ? " / " : ""}` }}
            </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  background-color: var(--secondary-dark);
  padding: 18px 22px;
  border-radius: 12px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  .item-index {
    color: var(--primary-gray);
  }
}

.sub-category {
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>