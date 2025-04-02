import { ApplicationRef, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { filter, Subscription } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import { Base, Role, User } from '../../../../types/user';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dialog } from '@angular/cdk/dialog';
import { ModifyUserDialogComponent } from './modify-user-dialog/modify-user-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { TableComponent } from '../../../table/table.component';
import { Action, Column } from '../../../../types/table';
import { CommonModule } from '@angular/common';
import { BaseTabComponent } from '../../../base-tab/base-tab.component';
import { AuthService } from '../../../../services/auth.service';
import { Auth } from '../../../../types/auth';
import { TableService } from '../../../../services/table.service';

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
        { id: 'username', name: 'features.users.table.username', icon: 'person', sortable: true },
        { id: 'role', name: 'features.users.table.role', icon: 'person_pin', sortable: true }
    ];

    public actions: Action<User>[] = [
        {
            callback: this.addUser.bind(this),
            name: 'features.users.actions.add',
            icon: 'person_add'
        },
        {
            callback: this.updateUser.bind(this),
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

    public role: Role = 'driver';
    public base: Base = 'SEV';

    private _selectedUser: User | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(
        private _userService: UserService,
        private _dialog: Dialog,
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
                    this.columns.push({ id: 'base', name: 'features.users.table.base', icon: 'warehouse' });
                }

                this._userService.getUsers();

                this._subscriptions.push(
                    this._userService.users$.subscribe((users: User[]) => {
                        this.users = users;
                        console.log("🐛 | user-list.component.ts:101 | UserListComponent | this._userService.users$.subscribe | this.users:", this.users)
                        this._tableService.update$.next();
                        setTimeout(() => {
                            this._changeDetectorRef.detectChanges();
                            this._applicationRef.tick();
                        }, 0);
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

    public addUser(): void {
        this._dialog.open(AddUserDialogComponent);
    }

    public deleteUser(): void {
        if (this._selectedUser === null) {
            console.error('Called delete user without a user selected');
            return;
        }

        this._userService.deleteUser(this._selectedUser.username);
    }

    public updateUser(): void {
        if (this._selectedUser === null) {
            console.error('Called update user without a user selected');
            return;
        }

        this._dialog.open(ModifyUserDialogComponent, { data: this._selectedUser });
    }

    public getUsersByBase(base: Base): User[] {
        return this.users.filter((user: User) => user.base === base);
    }

    public onSelectedUser(user: User | null): void {
        this._selectedUser = user;
    }
}
