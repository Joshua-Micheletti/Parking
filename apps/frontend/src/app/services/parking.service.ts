import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ParkedCar } from '../types/parkedCar';
import { Endpoint, environment } from '../../environments/environment';
import { HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class ParkingService {
    private _parkedCars: ParkedCar[] = [];
    public parkedCars$: BehaviorSubject<ParkedCar[]> = new BehaviorSubject<ParkedCar[]>(this._parkedCars);

    constructor(private _httpService: HttpService, private _dialog: Dialog, private _utilsService: UtilsService) {}

    public getCars(): void {
        const requestConfig: Endpoint = environment.endpoints['getCars'];
        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
            next: (response: ParkedCar[]) => {
                this._parkedCars = this._utilsService.convertKeysToCamelCase(response);
                this.parkedCars$.next(this._parkedCars);
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error getting cars' } });
                return;
            }
        });
    }

    public addCar(car: ParkedCar): void {
        const requestConfig: Endpoint = environment.endpoints['postCar'];
        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, car)).subscribe({
            next: (response: any) => {
                this.getCars();
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error adding car' } });
                return;
            }
        });
    }

    public updateCar(): void {}

    public removeCar(): void {}
}
