import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../../types/user';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-modify-user-dialog',
    imports: [MatButtonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
    templateUrl: './modify-user-dialog.component.html',
    styleUrl: './modify-user-dialog.component.scss'
})
export class ModifyUserDialogComponent implements OnInit {
    public user: User = { username: '', role: '', base: '' };
    public userForm: FormGroup = new FormGroup({});
    public availableRoles: string[] = ['Admin', 'DBAdmin', 'Driver'];
    public availableBases: string[] = ['SEV', 'BCN', 'MAD', 'MLG', 'VLC'];

    constructor(private _dialogRef: DialogRef, private _userService: UserService) {
        const dialogData = inject(DIALOG_DATA);
        this.user = dialogData ?? { username: '', role: '', base: '' };
    }

    ngOnInit(): void {
        this.userForm.addControl(
            'role',
            new FormControl(this.availableRoles.find((role) => role.toLowerCase() === this.user.role))
        );
        this.userForm.addControl('base', new FormControl(this.user.base));
    }

    public save() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        const formData = this.userForm.getRawValue();

        this._userService.updateUser(this.user.username, formData.role.toLowerCase(), formData.base);
    }

    public close() {
        this._dialogRef.close();
    }
}
