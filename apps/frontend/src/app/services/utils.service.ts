import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor() {}

    public groupArray<T>(data: T[], size: number = 2): T[][] {
        const result: T[][] = [];

        for (let i = 0; i < data.length; i += size) {
            result.push(data.slice(i, i + size));
        }

        return result;
    }

    public toCamelCase(str: string): string {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    public convertKeysToCamelCase(object: any): any {
        if (Array.isArray(object)) {
            return object.map(this.convertKeysToCamelCase.bind(this));
        } else if (object !== null && typeof object === 'object') {
            return Object.entries(object).reduce((acc: any, [key, value]) => {
                const camelKey: string = this.toCamelCase(key);
                acc[camelKey] = this.convertKeysToCamelCase(value);
                return acc;
            }, {});
        }
        return object;
    }
}
