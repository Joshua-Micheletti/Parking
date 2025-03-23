import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ParkedCar } from '../../../../types/parkedCar';
import { Subscription } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { Action, Column } from '../../../../types/table';
import { TableComponent } from '../../../table/table.component';
import { Base } from '../../../../types/user';
import { BaseTabComponent } from '../../../base-tab/base-tab.component';

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

    public actions: Action[] = [
        {
            callback: this.addCar.bind(this),
            name: 'features.parking.actions.add'
        },
        {
            callback: this.updateCar.bind(this),
            name: 'features.parking.actions.update',
            condition: 'selectedRow'
        },
        {
            callback: this.deleteCar.bind(this),
            name: 'features.parking.table.delete',
            condition: 'selectedRow'
        }
    ];

    private _selectedCar: ParkedCar | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(private _dialog: Dialog) {}

    public addCar(): void {}

    public updateCar(): void {}

    public deleteCar(): void {}

    public getCarsByBase(base: Base): ParkedCar[] {
        return this.cars.filter((car: ParkedCar) => car.base === base);
    }

    public onSelectedCar(car: ParkedCar | null) {
        this._selectedCar = car;
    }
}
