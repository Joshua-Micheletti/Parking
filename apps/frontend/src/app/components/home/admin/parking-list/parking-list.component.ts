import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
    fuelTypes,
    fuelTypeTranslation,
    gearboxTypes,
    gearboxTypeTranslation,
    ParkedCar,
    statuses,
    statusTranslation
} from '../../../../types/parkedCar';
import { Subscription } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { Action, Column } from '../../../../types/table';
import { TableComponent } from '../../../table/table.component';
import { Base, bases, baseTranslation } from '../../../../types/user';
import { BaseTabComponent } from '../../../base-tab/base-tab.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormDialogComponent } from '../../../dialogs/form-dialog/form-dialog.component';
import { ControlData, FormDialogData } from '../../../../types/formDialog';
import { Validators } from '@angular/forms';

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

    public addCarControls: ControlData[] = [
        {
            label: 'features.parking.table.licensePlate',
            name: 'licensePlate',
            validators: [Validators.required]
        },
        {
            label: 'features.parking.table.base',
            name: 'base',
            validators: [Validators.required],
            enum: bases,
            translation: baseTranslation
        },
        {
            label: 'features.parking.table.status',
            name: 'status',
            validators: [Validators.required],
            enum: statuses,
            translation: statusTranslation
        },
        {
            label: 'features.parking.table.gearboxType',
            name: 'gearboxType',
            enum: gearboxTypes,
            translation: gearboxTypeTranslation
        },
        {
            label: 'features.parking.table.fuelType',
            name: 'fuelType',
            enum: fuelTypes,
            translation: fuelTypeTranslation
        },
        { label: 'features.parking.table.color', name: 'color' },
        { label: 'features.parking.table.provider', name: 'provider' },
        { label: 'features.parking.table.notes', name: 'notes' },
        { label: 'features.parking.table.enterDate', name: 'enterDate' },
        { label: 'features.parking.table.billingStartDate', name: 'billingStartDate' },
        { label: 'features.parking.table.billingEndDate', name: 'billingEndDate' }
    ];

    private _selectedCar: ParkedCar | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(private _matDialog: MatDialog) {}

    public addCar(): void {
        const sampleData: ParkedCar = { licensePlate: 'something', base: 'SEV', status: 'AVAILABLE' };
        const data: FormDialogData<ParkedCar> = {
            title: 'Something',
            controls: this.addCarControls,
            actions: [
                {
                    callback: this.test.bind(this),
                    name: 'sberembe'
                }
            ],
            sampleData: sampleData,
            groupSize: 3
        };

        const dialogRef: MatDialogRef<FormDialogComponent<ParkedCar>> = this._matDialog.open<
            FormDialogComponent<ParkedCar>
        >(FormDialogComponent, {
            data,
            panelClass: 'custom-panel'
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
