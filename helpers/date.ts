function pad(n: number) {
    return n < 10 ? '0' + n : n
}

export function formatDate(dateString: string | Date): string {
    const date = new Date(dateString)

    const d = pad(date.getDate())
    const m = date.toLocaleString('en-US', { month: 'long' })
    const y = date.getFullYear()
    return `${d} ${m} ${y}`
}