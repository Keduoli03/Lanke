// 统一放置时间相关的函数

export function formatDateToYYYYMMDD(date: Date | undefined): string {
    if (!date) {
        return new Date().toISOString().substring(0, 10);
    }
    return date.toISOString().substring(0, 10);
}

// 格式化为完整日期 YYYY-MM-DD
export function formatFullDate(date: Date): string {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');
}

// 格式化为月-日 MM-DD
export function formatMonthDay(date: Date): string {
    return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
    }).replace('/', '-');
}
