import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../../types/user';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-add-user-dialog',
    imports: [MatButtonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule],
    templateUrl: './add-user-dialog.component.html',
    styleUrl: './add-user-dialog.component.scss'
})
export class AddUserDialogComponent implements OnInit, OnDestroy {
    public userForm: FormGroup = new FormGroup({});
    public availableRoles: string[] = ['Admin', 'DBAdmin', 'Driver'];
    public availableBases: string[] = ['SEV', 'BCN', 'MAD', 'MLG', 'VLC'];
    
    private _subscriptions: Subscription[] = [];

    constructor(private _dialogRef: DialogRef, private _userService: UserService) {}

    ngOnInit(): void {
        this.userForm.addControl('username', new FormControl());
        this.userForm.addControl('password', new FormControl());
        this.userForm.addControl('role', new FormControl());
        this.userForm.addControl('base', new FormControl());
    }

    ngOnDestroy(): void {
      this._subscriptions.forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      });
    }

    public save() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        const formData = this.userForm.getRawValue();

        const subscription = this._userService.addUser(formData.username, formData.password, formData.role.toLowerCase(), formData.base).subscribe((success: boolean) => {
          if (success) {
            this._dialogRef.close();
          }
        });

        this._subscriptions.push(subscription);
    }

    public close() {
        this._dialogRef.close();
    }
}
