import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private _httpClient: HttpClient) { }

  public request(requestParams: HttpRequest<any>): Observable<any> {
    const token: string = sessionStorage.getItem('token') ?? '';

    console.log(token);

    if (token.length !== 0) {
      requestParams = requestParams.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    return this._httpClient
      .request(requestParams)
      .pipe(filter((res: any) => res.body), map((res: any) => res.body));
  }
}
