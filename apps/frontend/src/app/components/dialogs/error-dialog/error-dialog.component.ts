import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Dialog for showing an error. Expects data in the form: {title: string; message: string}
 */
@Component({
    selector: 'app-error-dialog',
    imports: [MatButtonModule, TranslateModule, MatIconModule, MatDialogModule],
    templateUrl: './error-dialog.component.html',
    styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
    public title: string = 'Error';
    public message: string = 'Message';

    constructor(private _dialogRef: MatDialogRef<ErrorDialogComponent>) {
        const dialogData = inject(MAT_DIALOG_DATA);

        this.title = dialogData?.title ?? 'Error';
        this.message = dialogData?.message ?? 'Message';
    }

    public onClick(): void {
        this._dialogRef.close();
    }
}
