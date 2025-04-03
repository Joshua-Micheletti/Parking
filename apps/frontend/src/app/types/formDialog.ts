import { Validator, ValidatorFn } from '@angular/forms';
import { Action } from './table';

export type ControlData = {
    label: string;
    defaultValue?: string;
    validators?: ValidatorFn[];
    name: string;
    enum?: string[];
    translation?: string;
};

export type FormDialogData<T> = {
    title: string;
    actions: Action<T>[];
    controls: ControlData[];
    sampleData: T;
    groupSize?: number
};
