// plugins/iconify.client.ts
import { addCollection } from '@iconify/vue'
import tablerIcons from '@iconify-json/tabler/icons.json'

export default defineNuxtPlugin(() => {
    addCollection(tablerIcons)
})
