export function camelToSnake(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

export function objectFieldsToSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(objectFieldsToSnakeCase);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                camelToSnake(key),
                objectFieldsToSnakeCase(value)
            ])
        );
    }
    return obj;
}
