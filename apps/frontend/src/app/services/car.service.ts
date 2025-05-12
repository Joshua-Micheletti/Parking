import { Injectable } from '@angular/core';
import { Car } from '../types/parkedCar';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
import { Dialog } from '@angular/cdk/dialog';
import { UtilsService } from './utils.service';
import { Endpoint, environment } from '../../environments/environment';
import { HttpRequest } from '@angular/common/http';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class CarService {
    private _cars: Car[] = [];
    public cars$: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>(this._cars);

    private _availableCars: Car[] = [];
    public availableCars$: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>(this._availableCars);

    private _car: Car | undefined = undefined;
    public car$: BehaviorSubject<Car | undefined> = new BehaviorSubject<Car | undefined>(this._car);

    constructor(
        private _httpService: HttpService,
        private _dialog: Dialog,
        private _utilsService: UtilsService,
        private _translateService: TranslateService
    ) {}

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

    public getCar(id: string): void {
        const requestConfig: Endpoint = environment.endpoints['getCar'];

        requestConfig.path = requestConfig.path.replace('{{id}}', id);

        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
            next: (response: Car[]) => {
                if (response.length === 0) {
                    this._car = this._utilsService.convertKeysToCamelCase(response)[0];
                }

                this.car$.next(this._car);
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error getting car' } });
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

    public carTooltip(car: Car): string {
        let tooltipText: string = '';

        if (car.brand) {
            tooltipText += this._translateService.instant('features.parking.fields.brand') + ': ' + car.brand + '\n';
        }
        if (car.model) {
            tooltipText += this._translateService.instant('features.parking.fields.model') + ': ' + car.model + '\n';
        }
        if (car.color) {
            tooltipText += this._translateService.instant('features.parking.fields.color') + ': ' + car.color + '\n';
        }
        // if (car.brand) {
        //     tooltipText += this._translateService.instant('features.parking.fields.brand') + ': ' + car.brand + '\n';
        // }
        // if (car.brand) {
        //     tooltipText += this._translateService.instant('features.parking.fields.brand') + ': ' + car.brand + '\n';
        // }
        return tooltipText;
    }
}
