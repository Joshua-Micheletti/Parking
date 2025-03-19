import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ParkedCar } from '../../../../types/parkedCar';
import { Subscription } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';

@Component({
    selector: 'app-parking-list',
    imports: [MatTableModule, MatIconModule, MatButtonModule],
    templateUrl: './parking-list.component.html',
    styleUrl: './parking-list.component.scss'
})
export class ParkingListComponent {
    public distances: ParkedCar[] = [];
    public selectedRow: ParkedCar | null = null;

    private _subscriptions: Subscription[] = [];

    public columns: { id: string; name: string; icon?: string; unit?: string }[] = [
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

    constructor(private _dialog: Dialog) {}

    public getColumnIDs(): string[] {
        return this.columns.map((column: { id: string; name: string }) => column.id);
    }

    public selectRow(row: ParkedCar): void {
        if (this.selectedRow === row) {
            this.selectedRow = null;
            return;
        }

        this.selectedRow = row;
    }
}
