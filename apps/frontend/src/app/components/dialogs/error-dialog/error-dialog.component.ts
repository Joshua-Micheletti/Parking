import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-error-dialog',
    imports: [MatButtonModule],
    templateUrl: './error-dialog.component.html',
    styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
    public title: string = 'Error';
    public message: string = 'Message';

    constructor(private _dialogRef: DialogRef) {
        const dialogData = inject(DIALOG_DATA);

        this.title = dialogData?.title ?? 'Error';
        this.message = dialogData?.message ?? 'Message';
    }

    public onClick(): void {
        this._dialogRef.close();
    }
}
