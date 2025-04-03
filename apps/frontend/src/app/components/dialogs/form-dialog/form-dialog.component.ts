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
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

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
        MatSelectModule
    ],
    templateUrl: './form-dialog.component.html',
    styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent<T> {
    public title: string = 'Title';
    public controls: ControlData[] = [];
    public groupedControls: ControlData[][] = [];
    public actions: Action<T>[] = [];
    public sampleData!: T;
    public form: FormGroup = new FormGroup({});

    constructor(
        public matDialogRef: MatDialogRef<FormDialogComponent<T>>,
        @Inject(MAT_DIALOG_DATA) public data: FormDialogData<T>,
        private _utilsService: UtilsService
    ) {
        this.title = data.title;
        this.controls = data.controls;
        this.groupedControls = this._utilsService.groupArray(this.controls, this.data.groupSize);
        this.actions = data.actions;
        this.sampleData = data.sampleData;

        for (const control of this.controls) {
            this.form.addControl(control.name, new FormControl(control.defaultValue ?? '', control.validators));
        }

        this.form.valueChanges.subscribe((formData: T) => {
            console.log(
                '🐛 | form-dialog.component.ts:58 | FormDialogComponent<T> | this.form.valueChanges.subscribe | formData:',
                formData
            );
        });
    }
}
