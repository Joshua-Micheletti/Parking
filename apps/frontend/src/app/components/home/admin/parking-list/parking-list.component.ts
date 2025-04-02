import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ParkedCar } from '../../../../types/parkedCar';
import { Subscription } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { Action, Column } from '../../../../types/table';
import { TableComponent } from '../../../table/table.component';
import { Base } from '../../../../types/user';
import { BaseTabComponent } from '../../../base-tab/base-tab.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormDialogComponent } from '../../../dialogs/form-dialog/form-dialog.component';
import { FormDialogData } from '../../../../types/formDialog';

@Component({
    selector: 'app-parking-list',
    imports: [TableComponent, BaseTabComponent],
    templateUrl: './parking-list.component.html',
    styleUrl: './parking-list.component.scss'
})
export class ParkingListComponent {
    @ViewChild('baseTemplate') baseTemplate!: TemplateRef<any>;

    public cars: ParkedCar[] = [];

    public columns: Column[] = [
        { id: 'licensePlate', name: 'features.parking.table.licensePlate' },
        { id: 'brand', name: 'features.parking.table.brand' },
        { id: 'model', name: 'features.parking.table.model' },
        { id: 'color', name: 'features.parking.table.color' },
        { id: 'provider', name: 'features.parking.table.provider' },
        { id: 'gearboxType', name: 'features.parking.table.gearboxType' },
        { id: 'fuelType', name: 'features.parking.table.fuelType' },
        { id: 'status', name: 'features.parking.table.status' },
        { id: 'notes', name: 'features.parking.table.notes' },
        { id: 'enterDate', name: 'features.parking.table.enterDate' },
        { id: 'billingStartDate', name: 'features.parking.table.billingStartDate' },
        { id: 'billingEndDate', name: 'features.parking.table.billingEndDate' },
        { id: 'base', name: 'features.parking.table.base' }
    ];

    public actions: Action<ParkedCar>[] = [
        {
            callback: this.addCar.bind(this),
            name: 'features.parking.actions.add',
            icon: 'add_circle'
        },
        {
            callback: this.updateCar.bind(this),
            name: 'features.parking.actions.update',
            condition: 'selectedRow',
            icon: 'edit'
        },
        {
            callback: this.deleteCar.bind(this),
            name: 'features.parking.table.delete',
            condition: 'selectedRow',
            icon: 'delete'
        }
    ];

    private _selectedCar: ParkedCar | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(private _matDialog: MatDialog) {}

    public addCar(): void {
        const sampleData: ParkedCar = {licensePlate: 'something', base: 'SEV', status: 'AVAILABLE'};
        const data: FormDialogData<ParkedCar> = {
            title: 'Something',
            controls: [
                { label: 'features.parking.table.licensePlate', validators: [], name: 'licensePlate'},
                { label: 'features.parking.table.licensePlate', validators: [], name: 'base'},
                { label: 'features.parking.table.licensePlate', validators: [], name: 'status'},
            ],
            actions: [
                {
                    callback: this.test.bind(this),
                    name: 'sberembe'
                }
            ],
            sampleData: sampleData
        };

        const dialogRef: MatDialogRef<FormDialogComponent<ParkedCar>> = this._matDialog.open<FormDialogComponent<ParkedCar>>(FormDialogComponent, {
            data
        });
    }

    public test(input?: ParkedCar): void {
        console.log('🐛 | parking-list.component.ts:81 | ParkingListComponent | test | input:', input);
    }

    public updateCar(): void {}

    public deleteCar(): void {}

    public getCarsByBase(base: Base): ParkedCar[] {
        return this.cars.filter((car: ParkedCar) => car.base === base);
    }

    public onSelectedCar(car: ParkedCar | null) {
        this._selectedCar = car;
    }
}
