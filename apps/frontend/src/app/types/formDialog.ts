import { ValidatorFn } from '@angular/forms';
import { Action } from './table';
import { Observable } from 'rxjs';

export type ControlType = 'date' | 'password';

export type ControlData = {
    label: string;
    defaultValue?: string;
    validators?: ValidatorFn[];
    name: string;
    enum?: string[];
    translation?: string;
    type?: ControlType;
    autoComplete?: AutoCompleteOption[];
    filteredOptions?: Observable<AutoCompleteOption[]>;
};

export type FormDialogData = {
    title: string;
    actions: Action[];
    controls: ControlData[];
    groupSize?: number,
    formValidators?: ValidatorFn[],
    view?: boolean
};

export type AutoCompleteOption = {
    value: any;
    display?: string;
    tooltip?: string;
}
