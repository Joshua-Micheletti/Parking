import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment, Endpoint } from '../../environments/environment';
import { Base, Role } from '../types/user';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user: string | null = null;
    public token: string | null = null;
    public role: Role | null = null;
    public base: Base | null = null;

    public authenticated$: BehaviorSubject<{
        token: string;
        user: string;
        role: Role;
        base: Base;
    }> = new BehaviorSubject<{
        token: string;
        user: string;
        role: Role;
        base: Base;
    }>({ token: '', user: '', role: 'driver', base: 'SEV' });

    constructor(private _httpService: HttpService, private _router: Router, private _baseService: BaseService) {
        this.token = sessionStorage.getItem('token');

        if (!this.token) {
            return;
        }

        const requestConfig: Endpoint = environment.endpoints?.['getRoles'];

        if (!requestConfig) {
            return;
        }

        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
            next: (response: { user: string; role: Role; base: Base }) => {
                this.user = response.user;
                this.role = response.role;
                this.base = response.base;

                this.authenticated$.next({
                    token: this.token ?? '',
                    user: this.user,
                    role: this.role,
                    base: this.base
                });
            },
            error: (err: unknown) => {
                console.log(err);
            }
        });
    }

    public login(credentials: { username: string; password: string }): void {
        const requestConfig: Endpoint = environment.endpoints?.['login'];

        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, credentials)).subscribe({
            next: (res: { message: string; token: string; role: Role; base: Base }) => {
                this.user = credentials.username;
                this.token = res.token;
                this.role = res.role;
                this.base = res.base;

                this.authenticated$.next({
                    token: this.token ?? '',
                    user: this.user,
                    role: this.role,
                    base: this.base
                });

                sessionStorage.setItem('token', this.token);

                this._router.navigate(['/home']);

                this._baseService.currentBase = this.base;
            },
            error: (err: unknown) => {
                console.log(err);
            }
        });
    }

    public logout(): void {
        sessionStorage.clear();
        this.authenticated$.next({ token: '', user: '', role: 'driver', base: 'SEV' });
        this.token = null;
        this.user = null;
        this.role = null;
        this.base = null;
        this._router.navigate(['/login']);
    }
}
