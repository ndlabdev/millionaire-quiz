export function shuffleArray<T>(array: T[]): T[] {
    return array
        .map(item => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item)
}

export function getPrizeAmount(level: number) {
    const milestones = [
        { level: 5, amount: 1000 },
        { level: 10, amount: 32000 },
        { level: 15, amount: 1000000 }
    ]

    let prize = 0
    for (const m of milestones) {
        if (level >= m.level) {
            prize = m.amount
        }
    }
    return prize
}
