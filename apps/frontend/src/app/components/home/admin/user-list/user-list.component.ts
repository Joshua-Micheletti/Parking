import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../types/user';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dialog } from '@angular/cdk/dialog';
import { ModifyUserDialogComponent } from './modify-user-dialog/modify-user-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { MatRipple, MatRippleModule } from '@angular/material/core';

@Component({
    selector: 'app-user-list',
    imports: [MatTableModule, MatIconModule, MatButtonModule, MatRippleModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {
    public users: User[] = [];
    public columns: string[] = ['username', 'role', 'base'];
    public selectedRow: User = { username: '', role: '', base: '' };

    private _subscriptions: Subscription[] = [];

    constructor(private _userService: UserService, private _dialog: Dialog) {}

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

    public deleteUser(username?: string): void {
        if (username === undefined) {
            if (this.selectedRow.username === '') {
                console.log('called without selecting any user');
                return;
            }

            this._userService.deleteUser(this.selectedRow.username);
            this.selectedRow = {username: '', role: '', base: ''};
            return;
        }

        this._userService.deleteUser(username);

        console.log('resetting selected row');
        this.selectedRow = {username: '', role: '', base: ''};
        console.log('selected row', this.selectedRow);
    }

    public updateUser(user?: User): void {
        if (user === undefined) {
            if (this.selectedRow.username === '') {
                console.log('called without selecting any user');
                return;
            }

            this._dialog.open(ModifyUserDialogComponent, { data: this.selectedRow });
            return;
        }

        this._dialog.open(ModifyUserDialogComponent, { data: user });
    }

    public selectRow(row: User): void {
        if (this.selectedRow === row) {
            this.selectedRow = { username: '', role: '', base: '' };
            return;
        }
        this.selectedRow = row;
    }
}
