import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private _httpClient: HttpClient) { }

  public request(requestObject: HttpRequest<any>): Observable<any> {
    const token: string = sessionStorage.getItem('token') ?? '';

    if (token.length !== 0) {
      requestObject = requestObject.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    return this._httpClient
      .request(requestObject)
      .pipe(filter((res: any) => res.body), map((res: any) => res.body));
  }
}
