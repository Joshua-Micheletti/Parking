import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { HttpService } from './http.service';
import { HttpParams, HttpRequest } from '@angular/common/http';
import { Endpoint, environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
    private _users: User[] = [];

    constructor(private _httpService: HttpService) {}

    public getUsers(): void {
        const requestConfig: Endpoint = environment.endpoints['getUsers'];
        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
            next: (response: any) => {
                this._users = response;
                this.users$.next(this._users);
            },
            error: (error: any) => {
                console.log(error);
                return;
            }
        });
    }

    public deleteUser(username: string): void {
        const requestConfig: Endpoint = environment.endpoints['deleteUser'];
        this._httpService
            .request(
                new HttpRequest(
                    requestConfig.method,
                    requestConfig.path,
                    {},
                    { params: new HttpParams().set('username', username) }
                )
            )
            .subscribe({
                next: (response: any) => {
                    this.getUsers();
                },
                error: (error: any) => {
                    console.log(error);
                    this.getUsers();
                }
            });
    }

    public addUser(username: string, password: string, role?: string, base?: string): void {
        const requestConfig: Endpoint = environment.endpoints['postUsers'];

        const body = { username, password, role, base };

        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, body)).subscribe({
            next: (response: any) => {
                this.getUsers();
            },
            error: (error: any) => {
                console.log(error);
                this.getUsers();
            }
        });
    }

    public get users(): User[] {
        return this._users;
    }
}
