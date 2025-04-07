import { ValidatorFn } from '@angular/forms';
import { Action } from './table';

export type ControlData = {
    label: string;
    defaultValue?: string;
    validators?: ValidatorFn[];
    name: string;
    enum?: string[];
    translation?: string;
    date?: boolean;
};

export type FormDialogData = {
    title: string;
    actions: Action[];
    controls: ControlData[];
    groupSize?: number,
    formValidators?: ValidatorFn[]
};
