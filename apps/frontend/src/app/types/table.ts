import { TemplateRef } from '@angular/core';

export type Column = {
    id: string;
    name: string;
    icon?: string;
    unit?: string;
    customTemplate?: TemplateRef<any>;
    sortable?: boolean;
};

export type Condition = undefined | 'selectedRow';

export type ActionType = 'normal' | 'warn';

export type Action = {
    callback: () => void;
    name: string;
    condition?: Condition;
    type?: ActionType;
    icon?: string;
};
