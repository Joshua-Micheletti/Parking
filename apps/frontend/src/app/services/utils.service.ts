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
}
