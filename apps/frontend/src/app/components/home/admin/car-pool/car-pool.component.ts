import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableComponent } from '../../../table/table.component';
import { Car, fuelTypes, fuelTypeTranslation, gearboxTypes, gearboxTypeTranslation } from '../../../../types/parkedCar';
import { Action, Column } from '../../../../types/table';
import { filter, Subscription } from 'rxjs';
import { CarService } from '../../../../services/car.service';
import { AuthService } from '../../../../services/auth.service';
import { Auth } from '../../../../types/auth';
import { Role } from '../../../../types/user';
import { TableService } from '../../../../services/table.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ControlData, FormDialogData } from '../../../../types/formDialog';
import { FormDialogComponent } from '../../../dialogs/form-dialog/form-dialog.component';
import { Validators } from '@angular/forms';

@Component({
    selector: 'app-car-pool',
    imports: [TableComponent],
    templateUrl: './car-pool.component.html',
    styleUrl: './car-pool.component.scss'
})
export class CarPoolComponent implements OnInit, OnDestroy {
    public role: Role = 'driver';

    public cars: Car[] = [];

    public columns: Column[] = [
        { id: 'licensePlate', name: 'features.parking.fields.licensePlate', icon: 'directions_car', sortable: true },
        { id: 'brand', name: 'features.parking.fields.brand', sortable: true },
        { id: 'model', name: 'features.parking.fields.model', sortable: true },
        { id: 'color', name: 'features.parking.fields.color', icon: 'color_lens', sortable: true },
        { id: 'provider', name: 'features.parking.fields.provider', sortable: true },
        {
            id: 'gearboxType',
            name: 'features.parking.fields.gearboxType',
            translation: 'data.gearboxType.',
            sortable: true
        },
        {
            id: 'fuelType',
            name: 'features.parking.fields.fuelType',
            icon: 'local_fire_department',
            translation: 'data.fuelType.',
            sortable: true
        }
    ];

    public actions: Action[] = [
        {
            callback: this.openAddDialog.bind(this),
            name: 'features.carPool.actions.add',
            icon: 'add_circle'
        },
        {
            callback: this.updateCar.bind(this),
            name: 'features.carPool.actions.update',
            condition: 'selectedRow',
            icon: 'edit'
        },
        {
            callback: this.deleteCar.bind(this),
            name: 'features.carPool.actions.delete',
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
        { label: 'features.parking.fields.provider', name: 'provider', validators: [Validators.required] },
        { label: 'features.parking.fields.brand', name: 'brand', validators: [Validators.required] },
        { label: 'features.parking.fields.model', name: 'model', validators: [Validators.required] },
        {
            label: 'features.parking.fields.fuelType',
            name: 'fuelType',
            validators: [Validators.required],
            enum: fuelTypes,
            translation: fuelTypeTranslation
        },
        {
            label: 'features.parking.fields.gearboxType',
            name: 'gearboxType',
            validators: [Validators.required],
            enum: gearboxTypes,
            translation: gearboxTypeTranslation
        },
        { label: 'features.parking.fields.color', name: 'color' }
    ];

    private _selectedCar: Car | null = null;
    private _subscriptions: Subscription[] = [];

    constructor(
        private _tableService: TableService,
        private _carService: CarService,
        private _authService: AuthService,
        private _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._carService.getCars();

        const authSubscription: Subscription = this._authService.authenticated$
            .pipe(
                filter((authenticated: Auth) => {
                    return authenticated.token !== '';
                })
            )
            .subscribe((authenticated: Auth) => {
                this.role = authenticated.role;
            });
        this._subscriptions.push(authSubscription);

        const subscription: Subscription = this._carService.cars$.subscribe((cars: Car[]) => {
            this.cars = cars;
            this._tableService.update$.next();
            this._matDialog.closeAll();
        });

        this._subscriptions.push(subscription);
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
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
            groupSize: 2
        };

        const dialogRef: MatDialogRef<FormDialogComponent> = this._matDialog.open<FormDialogComponent>(
            FormDialogComponent,
            {
                data,
                panelClass: 'custom-panel'
            }
        );
    }

    public addCar(car?: Car): void {
        if (car === undefined) {
            console.error('CALLED ADD CAR WITHOUT PARAMETERS');
            return;
        }

        this._carService.addCar(car);
    }

    public updateCar(): void {}

    public deleteCar(): void {}

    public onSelectedCar(car: Car | null) {
        this._selectedCar = car;
    }
}
