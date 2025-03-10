import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';

const requests: HttpRequest<any>[] = [];
const loadingService: LoadingService = inject(LoadingService);

function removeRequest(req: HttpRequest<any>) {
  const i = requests.indexOf(req);
  if (i >= 0) {
    requests.splice(i, 1);
  }
  loadingService.loading.next(requests.length >= 1);
}

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  return next(req);
  // private _requests: HttpRequest<any>[] = [];

  // constructor(private _loadingService: LoadingService) { }

  // removeRequest(req: HttpRequest<any>) {
  //   const i = this._requests.indexOf(req);
  //   if (i >= 0) {
  //     this._requests.splice(i, 1);
  //   }
  //   this._loadingService.loading.next(this._requests.length >= 1);
  // }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   console.log('INTERCEPTING');
  //   this._requests.push(req);
  //   this._loadingService.loading.next(true);

  //   return next.handle(req);
  // }
}
