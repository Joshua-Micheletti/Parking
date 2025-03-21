import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../types/user';
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

@Component({
    selector: 'app-user-list',
    imports: [MatTableModule, MatIconModule, MatButtonModule, MatRippleModule, MatChipsModule, TableComponent, CommonModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('customTemplate') customTemplateRef!: TemplateRef<any>;

    public users: User[] = [];
    public columns: Column[] = [];

    public actions: Action[] = [
        {
            callback: this.addUser.bind(this),
            name: 'Add User',
            icon: 'person_add'
        },
        {
            callback: this.updateUser.bind(this),
            name: 'Update User',
            condition: 'selectedRow',
            icon: 'manage_accounts'
        },
        {
            callback: this.deleteUser.bind(this),
            name: 'Delete User',
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

    ngAfterViewInit() {
        setTimeout(() => {
            this.columns = [
                { id: 'username', name: 'Username', icon: 'person' },
                { id: 'role', name: 'Role', icon: 'person_pin', customTemplate: this.customTemplateRef },
                { id: 'base', name: 'Base', icon: 'warehouse' }
            ];
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

    public onSelectedUser(user: User | null): void {
        this._selectedUser = user;
    }
}
