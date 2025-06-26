import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    Car,
    ParkedCar,
    statuses,
    statusTranslation
} from '../../../../types/parkedCar';
import { filter, skip, Subscription, take } from 'rxjs';
import { Action, Column } from '../../../../types/table';
import { TableComponent } from '../../../table/table.component';
import { Base, bases, baseTranslation, Role } from '../../../../types/user';
import { BaseTabComponent } from '../../../base-tab/base-tab.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormDialogComponent } from '../../../dialogs/form-dialog/form-dialog.component';
import { AutoCompleteOption, ControlData, FormDialogData } from '../../../../types/formDialog';
import { Validators } from '@angular/forms';
import { ParkingService } from '../../../../services/parking.service';
import { TableService } from '../../../../services/table.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { greaterThanOrEqualValidator } from '../../../../validators/greaterThan';
import { notFutureValidator } from '../../../../validators/notFuture';
import { AuthService } from '../../../../services/auth.service';
import { Auth } from '../../../../types/auth';
import { CarService } from '../../../../services/car.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorDialogComponent } from '../../../dialogs/error-dialog/error-dialog.component';
import { ServiceComponent } from './service/service.component';

@Component({
    selector: 'app-parking-list',
    imports: [TableComponent, BaseTabComponent, MatFormFieldModule, MatInputModule, MatDatepickerModule, ServiceComponent],
    templateUrl: './parking-list.component.html',
    styleUrl: './parking-list.component.scss'
})
export class ParkingListComponent implements OnInit, OnDestroy {
    @ViewChild('baseTemplate') baseTemplate!: TemplateRef<any>;

    public cars: ParkedCar[] = [];

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
        },
        { id: 'status', name: 'features.parking.fields.status', translation: 'data.status.', sortable: true },
        { id: 'notes', name: 'features.parking.fields.notes', icon: 'notes', sortable: true },
        {
            id: 'enterDate',
            name: 'features.parking.fields.enterDate',
            icon: 'calendar_month',
            date: true,
            sortable: true
        },
        {
            id: 'billingStartDate',
            name: 'features.parking.fields.billingStartDate',
            icon: 'calendar_month',
            date: true,
            sortable: true
        },
        {
            id: 'billingEndDate',
            name: 'features.parking.fields.billingEndDate',
            icon: 'calendar_month',
            date: true,
            sortable: true
        }
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
            icon: 'delete',
            type: 'warn'
        }
    ];

    public addCarControls: ControlData[] = [
        {
            label: 'features.parking.fields.car',
            name: 'carId',
            validators: [Validators.required],
            autoComplete: []
        },
        {
            label: 'features.parking.fields.status',
            name: 'status',
            validators: [Validators.required],
            enum: ['AVAILABLE', 'NOT AVAILABLE'],
            translation: statusTranslation
        },
        { label: 'features.parking.fields.notes', name: 'notes' }
    ];

    public role: Role = 'driver';
    public base: Base = 'SEV';

    private _selectedCar: ParkedCar | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(
        private _matDialog: MatDialog,
        private _parkingService: ParkingService,
        private _tableService: TableService,
        private _authService: AuthService,
        private _carService: CarService,
        private _translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this._parkingService.getCars();

        const authSubscription: Subscription = this._authService.authenticated$
            .pipe(
                filter((authenticated: Auth) => {
                    return authenticated.token !== '';
                })
            )
            .subscribe((authenticated: Auth) => {
                this.role = authenticated.role;
                this.base = authenticated.base;

                if (this.role === 'admin') {
                    this.addCarControls.splice(1, 0, {
                        label: 'features.parking.fields.base',
                        name: 'base',
                        validators: [Validators.required],
                        enum: bases,
                        translation: baseTranslation
                    });
                }
            });
        this._subscriptions.push(authSubscription);

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
        this._carService.getAvailableCars();

        const subscription: Subscription = this._carService.availableCars$.pipe(skip(1), take(1)).subscribe((cars: Car[]) => {
            if (cars.length === 0) {
                this._matDialog.open(ErrorDialogComponent, { data: { message: 'No available cars' } });
                subscription.unsubscribe();
                return;
            }

            this.addCarControls[0].autoComplete = cars.map((car: Car) => {
                let autocompleteOption: AutoCompleteOption;

                autocompleteOption = {
                    value: car.id,
                    display: car.licensePlate,
                    tooltip: this._carService.carTooltip(car)
                };

                return autocompleteOption;
            });

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
                groupSize: 2,
                formValidators: [
                    greaterThanOrEqualValidator('billingEndDate', 'billingStartDate'),
                    greaterThanOrEqualValidator('billingStartDate', 'enterDate'),
                    greaterThanOrEqualValidator('billingEndDate', 'enterDate'),
                    notFutureValidator('enterDate')
                ]
            };

            const dialogRef: MatDialogRef<FormDialogComponent> = this._matDialog.open<FormDialogComponent>(
                FormDialogComponent,
                {
                    data
                    // panelClass: 'custom-panel'
                }
            );

            subscription.unsubscribe();
        });
    }

    public addCar(car?: ParkedCar): void {
        if (car === undefined) {
            console.error('CALLED ADD CAR WITHOUT PARAMETERS');
            return;
        }

        if (this.role !== 'admin') {
            car.base = this.base;
        }

        const currentDate = new Date();

        car.enterDate = currentDate.toISOString();
        car.billingStartDate = currentDate.toISOString();

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
