import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { Action, Column } from '../../../../types/table';
import { TableComponent } from '../../../table/table.component';
import { Base, bases, baseTranslation } from '../../../../types/user';
import { BaseTabComponent } from '../../../base-tab/base-tab.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormDialogComponent } from '../../../dialogs/form-dialog/form-dialog.component';
import { ControlData, FormDialogData } from '../../../../types/formDialog';
import { Validators } from '@angular/forms';
import { ParkingService } from '../../../../services/parking.service';
import { TableService } from '../../../../services/table.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'app-parking-list',
    imports: [TableComponent, BaseTabComponent, MatFormFieldModule, MatInputModule, MatDatepickerModule],
    templateUrl: './parking-list.component.html',
    styleUrl: './parking-list.component.scss'
})
export class ParkingListComponent implements OnInit, OnDestroy {
    @ViewChild('baseTemplate') baseTemplate!: TemplateRef<any>;

    public cars: ParkedCar[] = [];

    public columns: Column[] = [
        { id: 'licensePlate', name: 'features.parking.fields.licensePlate', icon: 'directions_car'},
        { id: 'brand', name: 'features.parking.fields.brand' },
        { id: 'model', name: 'features.parking.fields.model' },
        { id: 'color', name: 'features.parking.fields.color', icon: 'color_lens' },
        { id: 'provider', name: 'features.parking.fields.provider' },
        { id: 'gearboxType', name: 'features.parking.fields.gearboxType' },
        { id: 'fuelType', name: 'features.parking.fields.fuelType', icon: 'local_fire_department' },
        { id: 'status', name: 'features.parking.fields.status' },
        { id: 'notes', name: 'features.parking.fields.notes', icon: 'notes' },
        { id: 'enterDate', name: 'features.parking.fields.enterDate', icon: 'calendar_month'},
        { id: 'billingStartDate', name: 'features.parking.fields.billingStartDate', icon: 'calendar_month' },
        { id: 'billingEndDate', name: 'features.parking.fields.billingEndDate', icon: 'calendar_month' },
        { id: 'base', name: 'features.parking.fields.base', icon: 'warehouse' }
    ];

    public actions: Action[] = [
        {
            callback: this.openAddDialog.bind(this),
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
            name: 'features.parking.actions.delete',
            condition: 'selectedRow',
            icon: 'delete'
        }
    ];

    public addCarControls: ControlData[] = [
        {
            label: 'features.parking.fields.licensePlate',
            name: 'licensePlate',
            validators: [Validators.required]
        },
        {
            label: 'features.parking.fields.base',
            name: 'base',
            validators: [Validators.required],
            enum: bases,
            translation: baseTranslation
        },
        {
            label: 'features.parking.fields.status',
            name: 'status',
            validators: [Validators.required],
            enum: statuses,
            translation: statusTranslation
        },
        {
            label: 'features.parking.fields.fuelType',
            name: 'fuelType',
            validators: [Validators.required],
            enum: fuelTypes,
            translation: fuelTypeTranslation
        },
        { label: 'features.parking.fields.provider', name: 'provider', validators: [Validators.required] },
        {
            label: 'features.parking.fields.gearboxType',
            name: 'gearboxType',
            enum: gearboxTypes,
            translation: gearboxTypeTranslation
        },
        { label: 'features.parking.fields.color', name: 'color' },
        { label: 'features.parking.fields.notes', name: 'notes' },
        { label: 'features.parking.fields.enterDate', name: 'enterDate'},
        { label: 'features.parking.fields.billingStartDate', name: 'billingStartDate', date: true },
        // { label: 'features.parking.fields.billingEndDate', name: 'billingEndDate' }
    ];

    private _selectedCar: ParkedCar | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(private _matDialog: MatDialog, private _parkingService: ParkingService, private _tableService: TableService) {}

    ngOnInit(): void {
        this._parkingService.getCars();

        const subscription: Subscription = this._parkingService.parkedCars$.subscribe((cars: ParkedCar[]) => {
            this.cars = cars;
            this._tableService.update$.next();
            this._matDialog.closeAll();
        });

        this._subscriptions.push(subscription);
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    public openAddDialog(): void {
        const data: FormDialogData = {
            title: 'features.parking.actions.add',
            controls: this.addCarControls,
            actions: [
                {
                    callback: this.addCar.bind(this),
                    name: 'features.parking.actions.add',
                    icon: 'add'
                }
            ],
            groupSize: 3
        };

        const dialogRef: MatDialogRef<FormDialogComponent> = this._matDialog.open<FormDialogComponent>(
            FormDialogComponent,
            {
                data,
                panelClass: 'custom-panel'
            }
        );
    }

    public addCar(car?: ParkedCar): void {
        if (car === undefined) {
            console.error('CALLED ADD CAR WITHOUT PARAMETERS');
            return;
        }

        this._parkingService.addCar(car);
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
