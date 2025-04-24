import { readFileSync } from "node:fs"
import { join } from "path"

export default defineEventHandler((event) => {
    const query = getQuery(event)
    const page = Number(query.page || 1)
    const perPage = Number(query.perPage || 10)

    const filePath = join(process.cwd(), 'src', 'server', 'data', 'inquiries.json')
    const content = readFileSync(filePath, 'utf-8')
    const allData = JSON.parse(content)

    const total = allData.length
    const start = (page - 1) * perPage
    const end = start + perPage
    const paginated = allData.slice(start, end)

    const hasNext = end < total
    const hasPrevious = start > 0

    return {
        data: paginated,
        pagination: {
            total,
            currentPage: page,
            perPage,
            hasNext,
            hasPrevious
        }
    }
})
