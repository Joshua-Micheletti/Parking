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

@Component({
    selector: 'app-user-list',
    imports: [MatTableModule, MatIconModule, MatButtonModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {
    public users: User[] = [];
    public columns: string[] = ['username', 'role', 'base', 'action'];

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

    public deleteUser(username: string): void {
        this._userService.deleteUser(username);
    }

    public updateUser(user: User): void {
        this._dialog.open(ModifyUserDialogComponent, { data: user });
    }
}
