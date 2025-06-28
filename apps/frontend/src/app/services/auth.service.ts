import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment, Endpoint } from '../../environments/environment';
import { Base, Role } from '../types/user';
import { BaseService } from './base.service';
import { Auth, Credentials } from '../types/auth';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user: string | null = null;
    public token: string | null = null;
    public role: Role | null = null;
    public base: Base | null = null;
    public id: string | null = null;

    public authenticated$: BehaviorSubject<Auth> = new BehaviorSubject<Auth>({
        token: '',
        user: '',
        role: 'driver',
        base: 'SEV',
        id: ''
    });

    constructor(
        private _httpService: HttpService,
        private _router: Router,
        private _baseService: BaseService,
        private _matDialog: MatDialog
    ) {
        this.token = sessionStorage.getItem('token');

        if (!this.token) {
            return;
        }

        const requestConfig: Endpoint = environment.endpoints?.['getRoles'];

        if (!requestConfig) {
            return;
        }

        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
            next: (response: Auth) => {
                this.user = response.user;
                this.role = response.role;
                this.base = response.base;
                this.id = response.id;

                this.authenticated$.next({
                    token: this.token ?? '',
                    user: this.user,
                    role: this.role,
                    base: this.base,
                    id: this.id
                });
            },
            error: (err: unknown) => {
                console.log(err);
            }
        });
    }

    public login(credentials: Credentials): void {
        const requestConfig: Endpoint = environment.endpoints?.['login'];

        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, credentials)).subscribe({
            next: (res: { message: string; token: string; role: Role; base: Base; id: string }) => {
                this.user = credentials.username;
                this.token = res.token;
                this.role = res.role;
                this.base = res.base;
                this.id = res.id;

                this.authenticated$.next({
                    token: this.token ?? '',
                    user: this.user,
                    role: this.role,
                    base: this.base,
                    id: this.id
                });

                sessionStorage.setItem('token', this.token);

                this._router.navigate(['/home']);

                this._baseService.currentBase = this.base;
            },
            error: (err: unknown) => {
                this._matDialog.open(ErrorDialogComponent, {
                    data: {
                        title: 'common.error.generic',
                        message: 'features.login.error'
                    }
                });

                console.log(err);
            }
        });
    }

    public logout(): void {
        sessionStorage.clear();
        this.authenticated$.next({ token: '', user: '', role: 'driver', base: 'SEV', id: '' });
        this.token = null;
        this.user = null;
        this.role = null;
        this.base = null;
        this._router.navigate(['/login']);
    }
}
