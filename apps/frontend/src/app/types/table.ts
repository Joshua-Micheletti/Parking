import { TemplateRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export type StickyDirection = 'none' | 'beginning' | 'end';

export type Column = {
    id: string;
    name: string;
    icon?: string;
    unit?: string;
    customTemplate?: TemplateRef<any>;
    sortable?: boolean;
    date?: boolean;
    translation?: string;
    chip?: boolean;
    sticky?: StickyDirection;
};

export type Condition = undefined | 'selectedRow';

export type ActionType = 'normal' | 'warn';

export type Action = {
    callback: {
        (): void;
        (input: any): void;
        (input: any, dialogRef: MatDialogRef<any, any>): void;
    };
    name: string;
    condition?: Condition;
    type?: ActionType;
    icon?: string;
};
