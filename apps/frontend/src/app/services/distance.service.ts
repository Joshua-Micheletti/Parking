import { Injectable } from '@angular/core';

import { Distance } from '../types/distance';
import { HttpService } from './http.service';
import { HttpParams, HttpRequest } from '@angular/common/http';
import { Endpoint, environment } from '../../environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class DistanceService {
    public distances$: BehaviorSubject<Distance[]> = new BehaviorSubject<Distance[]>([]);
    private _distances: Distance[] = [];

    constructor(private _httpService: HttpService, private _dialog: Dialog) {}

    public getDistances(): void {
        const requestConfig: Endpoint = environment.endpoints['getDistances'];
        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
            next: (response: any) => {
                this._distances = response;
                this.distances$.next(this._distances);
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error getting distances' } });
                return;
            }
        });
    }

    public deleteDistance(origin: string, destination: string): void {
        const requestConfig: Endpoint = environment.endpoints['deleteDistance'];
        this._httpService
            .request(
                new HttpRequest(
                    requestConfig.method,
                    requestConfig.path,
                    {},
                    { params: new HttpParams().set('origin', origin).set('destination', destination) }
                )
            )
            .subscribe({
                next: (response: any) => {
                    this.getDistances();
                },
                error: (error: any) => {
                    console.log(error);
                    this._dialog.open(ErrorDialogComponent, { data: { message: 'Error deleting distance' } });
                    this.getDistances();
                }
            });
    }

    public addDistance(distance: Distance): Subject<boolean> {
        const requestConfig: Endpoint = environment.endpoints['postDistance'];

        const body = distance;

        const subject: Subject<boolean> = new Subject();

        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, body)).subscribe({
            next: (response: any) => {
                this.getDistances();
                subject.next(true);
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error adding distance' } });
                this.getDistances();
                subject.next(false);
            }
        });

        return subject;
    }

    public updateDistance(username: string, role: string, base: string): void {
        const requestConfig: Endpoint = environment.endpoints['updateDistance'];

        const body = { username, role, base };

        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, body)).subscribe({
            next: (response: any) => {
                this.getDistances();
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error updating user' } });
                this.getDistances();
            }
        });
    }

    public get distances(): Distance[] {
        return this._distances;
    }
}
