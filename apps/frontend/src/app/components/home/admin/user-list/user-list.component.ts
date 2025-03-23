import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import { Base, User } from '../../../../types/user';
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
import { RainbowChipComponent } from '../../../rainbow-chip/rainbow-chip.component';
import { BaseTabComponent } from '../../../base-tab/base-tab.component';

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
        { id: 'username', name: 'features.users.table.username', icon: 'person' },
        { id: 'role', name: 'features.users.table.role', icon: 'person_pin' },
        { id: 'base', name: 'features.users.table.base', icon: 'warehouse' }
    ];

    public actions: Action[] = [
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

    private _selectedUser: User | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(private _userService: UserService, private _dialog: Dialog, private _change: ChangeDetectorRef) {}

    ngOnInit(): void {
        this._userService.getUsers();

        this._subscriptions.push(
            this._userService.users$.subscribe((users: User[]) => {
                this.users = users;
            })
        );
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
