import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment, Endpoint } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user: string | null = null;
  public token: string | null = null;
  public role: string | null = null;

  public authenticated$: BehaviorSubject<{
    token: string;
    user: string;
    role: string;
  }> = new BehaviorSubject({ token: '', user: '', role: '' });

  constructor(private _httpService: HttpService, private _router: Router) {
    this.token = sessionStorage.getItem('token');

    if (!this.token) {
      return;
    }

    const requestConfig: Endpoint = environment.endpoints?.['getRoles'];

    if (!requestConfig) {
      return;
    }

    this._httpService
      .request(
        new HttpRequest(requestConfig.method, requestConfig.path, {})
      )
      .subscribe({
        next: (response: { user: string; role: string }) => {
          this.user = response.user;
          this.role = response.role;

          this.authenticated$.next({
            token: this.token ?? '',
            user: this.user,
            role: this.role,
          });
        },
        error: (err: unknown) => {
          console.log(err);
        },
      });
  }

  public login(credentials: { username: string; password: string }): void {
    const requestConfig: Endpoint = environment.endpoints?.['login'];
    this._httpService
      .request(new HttpRequest(requestConfig.method, requestConfig.path, credentials))
      .subscribe({
        next: (res: { message: string; token: string; role: string }) => {
          this.user = credentials.username;
          this.token = res.token;
          this.role = res.role;

          this.authenticated$.next({
            token: this.token ?? '',
            user: this.user,
            role: this.role,
          });

          sessionStorage.setItem('token', this.token);

          this._router.navigate(['/home']);
        },
        error: (err: unknown) => {
          console.log(err);
        },
      });
  }
}
