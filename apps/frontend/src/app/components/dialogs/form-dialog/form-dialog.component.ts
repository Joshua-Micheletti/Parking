import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteOption, ControlData, FormDialogData } from '../../../types/formDialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UtilsService } from '../../../services/utils.service';
import { Action } from '../../../types/table';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map, Observable, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-form-dialog',
    imports: [
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatButtonModule,
        MatIconModule,
        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatTooltipModule,
        CommonModule
    ],
    templateUrl: './form-dialog.component.html',
    styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent {
    public title: string = 'Title';
    public controls: ControlData[] = [];
    public groupedControls: ControlData[][] = [];
    public actions: Action[] = [];
    public form: FormGroup = new FormGroup({});
    public formValue: unknown | undefined = undefined;
    public filteredOptions: Observable<string[]>[] = [];

    constructor(
        public matDialogRef: MatDialogRef<FormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FormDialogData,
        private _utilsService: UtilsService
    ) {
        this.title = data.title;
        this.controls = data.controls;
        this.groupedControls = this._utilsService.groupArray(this.controls, this.data.groupSize);
        this.actions = data.actions;

        for (const control of this.controls) {
            this.form.addControl(control.name, new FormControl(control.defaultValue ?? '', control.validators));

            if (control.autoComplete) {
                console.log(
                    '🐛 | form-dialog.component.ts:69 | FormDialogComponent | control.autoComplete:',
                    control.autoComplete
                );
                const filtered: Observable<AutoCompleteOption[]> = this.form.get(control.name)!.valueChanges.pipe(
                    startWith(''),
                    map((value) => {
                        console.log('🐛 | form-dialog.component.ts:72 | FormDialogComponent | map | value:', value);
                        console.log('🐛 | form-dialog.component.ts:72 | FormDialogComponent | map | value:', !value);

                        if (!value) {
                            console.log('RETURNING AUTOCOMPLETE');
                            console.log(
                                '🐛 | form-dialog.component.ts:77 | FormDialogComponent | map | control.autoComplete:',
                                control.autoComplete
                            );
                            return control.autoComplete!;
                        }

                        return this._filter(control.autoComplete!, value || '');
                    })
                );

                filtered.subscribe((value) => {
                    console.log(
                        '🐛 | form-dialog.component.ts:85 | FormDialogComponent | filtered.subscribe | observable:',
                        value
                    );
                });

                control.filteredOptions = filtered;
                // this.form.get(control.name)?.setValue(' ');
                // this.form.get(control.name)?.setValue('');
            }
        }

        if (data.formValidators) {
            this.form.addValidators(data.formValidators);
        }
    }

    public wrapper(callback: any) {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        const cleanFormData = Object.fromEntries(
            Object.entries(this.form.getRawValue()).filter(([_, value]) => value !== '')
        );

        callback(cleanFormData, this.matDialogRef);
    }

    public getDisplayFunction(control: ControlData): (value: any) => string {
        return (value: any): string => {
            const option = control.autoComplete?.find((option: AutoCompleteOption) => {
                return option.value === value;
            });

            return option?.display ?? option?.value;
        };
    }

    private _filter(options: AutoCompleteOption[], value: string): AutoCompleteOption[] {
        const filterValue = value.toLowerCase();

        if (!filterValue) {
            // If no filter value, return all options
            return options;
        }

        return options.filter((option) => {
            return Object.values(option).some((fieldValue) =>
                fieldValue?.toString()?.toLowerCase().includes(filterValue)
            );
        });
    }
}
