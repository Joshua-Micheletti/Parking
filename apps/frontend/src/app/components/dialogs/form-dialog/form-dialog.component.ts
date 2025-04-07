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
import { ControlData, FormDialogData } from '../../../types/formDialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UtilsService } from '../../../services/utils.service';
import { Action } from '../../../types/table';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
        MatDatepickerModule
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
}
