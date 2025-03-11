import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

const requests: HttpRequest<any>[] = [];

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    const loadingService = inject(LoadingService);

    if (req.headers.has('x-skip-loading')) {
        return next(req);
    }

    requests.push(req);
    loadingService.loading.next(true);

    return next(req).pipe(
        finalize(() => {
            const i = requests.indexOf(req);
            if (i >= 0) {
                requests.splice(i, 1);
            }
            loadingService.loading.next(requests.length >= 1);
        })
    );
};
