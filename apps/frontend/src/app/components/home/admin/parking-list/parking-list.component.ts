import { Component } from '@angular/core';
import { ParkedCar } from '../../../../types/parkedCar';
import { Subscription } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { Action, Column } from '../../../../types/table';
import { TableComponent } from '../../../table/table.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-parking-list',
    imports: [TableComponent, MatTabsModule],
    templateUrl: './parking-list.component.html',
    styleUrl: './parking-list.component.scss'
})
export class ParkingListComponent {
    public cars: ParkedCar[] = [];

    public columns: Column[] = [
        { id: 'licensePlate', name: 'License Plate' },
        { id: 'brand', name: 'Brand' },
        { id: 'model', name: 'Model' },
        { id: 'color', name: 'Color' },
        { id: 'provider', name: 'Provider' },
        { id: 'gearboxType', name: 'Gearbox Type' },
        { id: 'fuelType', name: 'Fuel Type' },
        { id: 'status', name: 'Status' },
        { id: 'notes', name: 'Notes' },
        { id: 'enterDate', name: 'Enter Date' },
        { id: 'billingStartDate', name: 'Billing Start Date' },
        { id: 'billingEndDate', name: 'Billing End Date' }
    ];

    public actions: Action[] = [
        {
            callback: this.addCar.bind(this),
            name: 'Add Car'
        },
        {
            callback: this.updateCar.bind(this),
            name: 'Update Car',
            condition: 'selectedRow'
        },
        {
            callback: this.deleteCar.bind(this),
            name: 'Delete Car',
            condition: 'selectedRow'
        }
    ];

    private _selectedCar: ParkedCar | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(private _dialog: Dialog) {}

    public addCar(): void {}

    public updateCar(): void {}

    public deleteCar(): void {}

    public onSelectedCar(car: ParkedCar | null) {
        this._selectedCar = car;
    }
}
