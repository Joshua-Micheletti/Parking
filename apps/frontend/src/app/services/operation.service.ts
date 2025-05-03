import { Injectable } from '@angular/core';

import { Operation } from '../types/operation';
import { HttpService } from './http.service';
import { HttpParams, HttpRequest } from '@angular/common/http';
import { Endpoint, environment } from '../../environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class OperationService {
    public operations$: BehaviorSubject<Operation[]> = new BehaviorSubject<Operation[]>([]);
    private _operations: Operation[] = [];

    constructor(private _httpService: HttpService, private _dialog: Dialog) {}

    public getOperations(): void {
        const requestConfig: Endpoint = environment.endpoints['getOperations'];
        this._httpService.request(new HttpRequest(requestConfig.method, requestConfig.path, {})).subscribe({
            next: (response: any) => {
                this._operations = response;
                this.operations$.next(this._operations);
            },
            error: (error: any) => {
                console.log(error);
                this._dialog.open(ErrorDialogComponent, { data: { message: 'Error getting operations' } });
                return;
            }
        });
    }

    public acceptOperation(id: string): void {
      const requestConfig: Endpoint = environment.endpoints['acceptOperation'];
        this._httpService
            .request(
                new HttpRequest(
                    requestConfig.method,
                    requestConfig.path,
                    {id},
                    {}
                )
            )
            .subscribe({
                next: (response: any) => {
                    this.getOperations();
                },
                error: (error: any) => {
                    console.log(error);
                    this._dialog.open(ErrorDialogComponent, { data: { message: 'Error accepting operation' } });
                    this.getOperations();
                }
            });
    }

    public get operations(): Operation[] {
        return this._operations;
    }
}
