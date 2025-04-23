import { ApplicationRef, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { filter, Subscription } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import { Base, bases, baseTranslation, Role, roles, roleTranslation, User } from '../../../../types/user';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { TableComponent } from '../../../table/table.component';
import { Action, Column } from '../../../../types/table';
import { CommonModule } from '@angular/common';
import { BaseTabComponent } from '../../../base-tab/base-tab.component';
import { AuthService } from '../../../../services/auth.service';
import { Auth } from '../../../../types/auth';
import { TableService } from '../../../../services/table.service';
import { FormDialogComponent } from '../../../dialogs/form-dialog/form-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ControlData, FormDialogData } from '../../../../types/formDialog';
import { Validators } from '@angular/forms';

@Component({
    selector: 'app-user-list',
    imports: [
        MatTableModule,
        BaseTabComponent,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatChipsModule,
        TableComponent,
        CommonModule,
        BaseTabComponent
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {
    public users: User[] = [];
    public columns: Column[] = [
        { id: 'username', name: 'features.users.fields.username', icon: 'person', sortable: true },
        { id: 'role', name: 'features.users.fields.role', icon: 'person_pin', sortable: true, chip: true }
    ];

    public actions: Action[] = [
        {
            callback: this.openAddDialog.bind(this),
            name: 'features.users.actions.add',
            icon: 'person_add'
        },
        {
            callback: this.openUpdateDialog.bind(this),
            name: 'features.users.actions.update',
            condition: 'selectedRow',
            icon: 'manage_accounts'
        },
        {
            callback: this.deleteUser.bind(this),
            name: 'features.users.actions.delete',
            type: 'warn',
            condition: 'selectedRow',
            icon: 'person_remove'
        }
    ];

    public addUserControls: ControlData[] = [
        { label: 'features.users.fields.username', name: 'username', validators: [Validators.required] },
        {
            label: 'features.users.fields.password',
            name: 'password',
            validators: [Validators.required],
            type: 'password'
        },
        {
            label: 'features.users.fields.role',
            name: 'role',
            enum: roles.filter((value) => value != 'admin'),
            translation: roleTranslation,
            validators: [Validators.required]
        }
    ];

    public updateUserControls: ControlData[] = [
        {
            label: 'features.users.fields.role',
            name: 'role',
            enum: roles.filter((value) => value != 'admin'),
            translation: roleTranslation,
            validators: [Validators.required]
        }
    ];

    public role: Role = 'driver';
    public base: Base = 'SEV';

    private _selectedUser: User | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(
        private _userService: UserService,
        private _matDialog: MatDialog,
        private _authService: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _tableService: TableService,
        private _applicationRef: ApplicationRef
    ) {}

    ngOnInit(): void {
        const subscription: Subscription = this._authService.authenticated$
            .pipe(
                filter((authenticated: Auth) => {
                    return authenticated.token !== '';
                })
            )
            .subscribe((authenticated: Auth) => {
                this.role = authenticated.role;
                this.base = authenticated.base;

                if (this.role === 'admin') {
                    this.columns.push({
                        id: 'base',
                        name: 'features.users.fields.base',
                        icon: 'warehouse',
                        chip: true
                    });

                    this.addUserControls.push({
                        label: 'features.users.fields.base',
                        name: 'base',
                        enum: bases,
                        translation: baseTranslation,
                        validators: [Validators.required]
                    });
                    this.addUserControls[2].enum?.push('admin');

                    this.updateUserControls.push({
                        label: 'features.users.fields.base',
                        name: 'base',
                        enum: bases,
                        translation: baseTranslation,
                        validators: [Validators.required]
                    });
                    this.updateUserControls[0].enum?.push('admin');
                }

                this._userService.getUsers();

                this._subscriptions.push(
                    this._userService.users$.subscribe((users: User[]) => {
                        this.users = users;
                        this._tableService.update$.next();
                        this._matDialog.closeAll();
                    })
                );
            });

        this._subscriptions.push(subscription);
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    public openAddDialog(): void {
        const data: FormDialogData = {
            title: 'features.users.actions.add',
            controls: this.addUserControls,
            actions: [
                {
                    callback: this.addUser.bind(this),
                    name: 'features.users.actions.add',
                    icon: 'add'
                }
            ],
            groupSize: 2
        };

        const dialogRef: MatDialogRef<FormDialogComponent> = this._matDialog.open<FormDialogComponent>(
            FormDialogComponent,
            {
                data,
                panelClass: 'custom-panel'
            }
        );
    }

    public addUser(
        user?: { username: string; password: string; role: Role; base: Base },
        dialogRef?: MatDialogRef<FormDialogComponent>
    ): void {
        if (user === undefined || dialogRef === undefined) {
            console.error('MISSING PARAMETERS IN FUNCTION addUser');
            return;
        }

        const subscription = this._userService
            .addUser(user.username, user.password, user.role.toLowerCase(), user.base)
            .subscribe((success: boolean) => {
                if (success) {
                    dialogRef.close();
                }
                subscription.unsubscribe();
            });
    }

    public deleteUser(): void {
        if (this._selectedUser === null) {
            console.error('Called delete user without a user selected');
            return;
        }

        this._userService.deleteUser(this._selectedUser.id!);
    }

    public openUpdateDialog(): void {
        if (this._selectedUser === null) {
            console.error('Called update user without a user selected');
            return;
        }

        const data: FormDialogData = {
            title: 'features.users.actions.update',
            controls: this.updateUserControls.map((control: ControlData) => {
                if (control.name === 'role') {
                    control.defaultValue = this._selectedUser?.role;
                } else if (control.name === 'base') {
                    control.defaultValue = this._selectedUser?.base;
                }
                return control;
            }),
            actions: [
                {
                    callback: this.updateUser.bind(this),
                    name: 'features.users.actions.update',
                    icon: 'manage_accounts'
                }
            ],
            groupSize: 2
        };

        const dialogRef: MatDialogRef<FormDialogComponent> = this._matDialog.open<FormDialogComponent>(
            FormDialogComponent,
            {
                data,
                panelClass: 'custom-panel'
            }
        );
    }

    public updateUser(user?: { role: Role; base: Base }, dialogRef?: MatDialogRef<FormDialogComponent>): void {
        if (user === undefined || dialogRef === undefined) {
            console.error('MISSING PARAMETERS IN updateUser');
            return;
        }

        this._userService.updateUser(this._selectedUser!.id!, user.role.toLowerCase(), user.base);
    }

    public getUsersByBase(base: Base): User[] {
        return this.users.filter((user: User) => user.base === base);
    }

    public onSelectedUser(user: User | null): void {
        this._selectedUser = user;
    }
}
