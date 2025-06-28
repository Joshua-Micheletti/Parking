import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Confirm Dialog Component. Takes input data in the form: {title: string; message: string}
 */
@Component({
    selector: 'app-confirm-dialog',
    imports: [TranslateModule, MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
    public title: string = '';
    public message: string = '';

    constructor(private _matDialogRef: MatDialogRef<ConfirmDialogComponent>) {
        const dialogData = inject(MAT_DIALOG_DATA);

        this.title = dialogData?.title || 'common.confirm';
        this.message = dialogData?.message || 'common.confirm';
    }

    close(): void {
        this._matDialogRef.close(false);
    }

    confirm(): void {
        this._matDialogRef.close(true);
    }
}
