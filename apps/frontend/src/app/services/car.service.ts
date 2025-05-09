import { Injectable } from '@angular/core';
import { Car } from '../types/parkedCar';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
import { Dialog } from '@angular/cdk/dialog';
import { UtilsService } from './utils.service';
import { Endpoint, environment } from '../../environments/environment';
import { HttpRequest } from '@angular/common/http';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class CarService {
    private _cars: Car[] = [];
    public cars$: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>(this._cars);

    private _availableCars: Car[] = [];
    public availableCars$: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>(this._availableCars);

    constructor(private _httpService: HttpService, private _dialog: Dialog, private _utilsService: UtilsService) {}

    public getCars(): void {
        const requestConfig: Endpoint = environment.endpoints['getCarPool'];
        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
            next: (response: Car[]) => {
                this._cars = this._utilsService.convertKeysToCamelCase(response);
                this.cars$.next(this._cars);
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error getting cars' } });
                return;
            }
        });
    }

    public getAvailableCars(): void {
        const requestConfig: Endpoint = environment.endpoints['getAvailableCarPool'];
        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
            next: (response: Car[]) => {
                this._availableCars = this._utilsService.convertKeysToCamelCase(response);
                this.availableCars$.next(this._availableCars);
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error getting cars' } });
                return;
            }
        });
    }

    public addCar(car: Car): void {
        const requestConfig: Endpoint = environment.endpoints['postCarPool'];
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
