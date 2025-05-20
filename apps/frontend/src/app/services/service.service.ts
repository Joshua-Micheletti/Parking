import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, switchMap, throwError } from 'rxjs';
import { ExtendedService, Service, ServiceType } from '../types/service';
import { Endpoint, environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { HttpRequest } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';
import { Dialog } from '@angular/cdk/dialog';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    constructor(private _httpService: HttpService, private _utilsService: UtilsService, private _dialog: Dialog) {}

    public getServices(carId: string): Observable<ExtendedService[] | undefined> {
        const requestConfig: Endpoint = JSON.parse(JSON.stringify(environment.endpoints['getServicesByCar']));

        requestConfig.path = requestConfig.path.replace('{{carId}}', carId);

        return this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).pipe(
            map((response: ExtendedService[]) => {
                return this._utilsService.convertKeysToCamelCase(response);
            }),
            catchError((error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error getting services' } });
                return throwError(() => error);
            })
        );
    }

    public postService(body: {carId: string, assigner: string, assignee: string, type: ServiceType}): Observable<any> {
      const requestConfig: Endpoint = environment.endpoints['postService'];

      return this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, body)).pipe(
        switchMap((response: any) => {
          return this.getServices(body.carId);
        }),
        catchError((error: any) => {
            console.log(error);
            this._dialog.open(ErrorDialogComponent, { data: { message: 'Error posting services' } });
            return throwError(() => error);
        })
    );
    }
}
