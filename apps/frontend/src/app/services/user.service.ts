import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { HttpService } from './http.service';
import { HttpParams, HttpRequest } from '@angular/common/http';
import { Endpoint, environment } from '../../environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
    private _users: User[] = [];

    constructor(private _httpService: HttpService, private _dialog: Dialog) {}

    public getUsers(): void {
        const requestConfig: Endpoint = environment.endpoints['getUsers'];
        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
            next: (response: any) => {
                this._users = response;
                this.users$.next(this._users);
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error getting users' } });
                return;
            }
        });
    }

    public deleteUser(id: number): void {
        const requestConfig: Endpoint = environment.endpoints['deleteUser'];
        this._httpService
            .request(
                new HttpRequest(
                    requestConfig.method,
                    requestConfig.path,
                    {},
                    { params: new HttpParams().set('id', id) }
                )
            )
            .subscribe({
                next: (response: any) => {
                    this.getUsers();
                },
                error: (error: any) => {
                    console.log(error);
                    this._dialog.open(ErrorDialogComponent, { data: { message: 'Error deleting user' } });
                    this.getUsers();
                }
            });
    }

    public addUser(username: string, password: string, role?: string, base?: string): Subject<boolean> {
        const requestConfig: Endpoint = environment.endpoints['postUsers'];

        const body = { username, password, role, base };

        const subject: Subject<boolean> = new Subject();

        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, body)).subscribe({
            next: (response: any) => {
                this.getUsers();
                subject.next(true);
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error adding user' } });
                this.getUsers();
                subject.next(false);
            }
        });

        return subject;
    }

    public updateUser(id: number, role: string, base: string): void {
        const requestConfig: Endpoint = environment.endpoints['updateUser'];

        console.log(requestConfig);

        const body = { id, role, base };

        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, body)).subscribe({
            next: (response: any) => {
                this.getUsers();
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error updating user' } });
                this.getUsers();
            }
        });
    }

    public get users(): User[] {
        return this._users;
    }
}
