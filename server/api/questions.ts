export default defineEventHandler(async () => {
    const data = await import('../data/questions.json')
    return data.default
})
