import { Component, OnDestroy, OnInit } from '@angular/core';
import { Distance } from '../../../../types/distance';
import { MatTableModule } from '@angular/material/table';
import { DistanceService } from '../../../../services/distance.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dialog } from '@angular/cdk/dialog';
import { AddDistanceDialogComponent } from './add-distance-dialog/add-distance-dialog.component';

@Component({
    selector: 'app-distance-list',
    imports: [MatTableModule, MatIconModule, MatButtonModule],
    templateUrl: './distance-list.component.html',
    styleUrl: './distance-list.component.scss'
})
export class DistanceListComponent implements OnInit, OnDestroy {
    public distances: Distance[] = [];
    public selectedRow: Distance | null = null;

    private _subscriptions: Subscription[] = [];

    public columns: { id: string; name: string; icon?: string, unit?: string }[] = [
        { id: 'origin', name: 'Origin', icon: 'arrow_upward' },
        { id: 'destination', name: 'Destination', icon: 'arrow_downward' },
        { id: 'distance', name: 'Distance', unit: 'Km' },
        { id: 'fuel_price', name: 'Price', unit: '€' }
    ];

    constructor(private _distanceService: DistanceService, private _dialog: Dialog) {}

    ngOnInit(): void {
        this._distanceService.getDistances();

        this._subscriptions.push(
            this._distanceService.distances$.subscribe((distances: Distance[]) => {
                this.distances = distances;
            })
        );
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    public selectRow(row: Distance): void {
        if (this.selectedRow === row) {
            this.selectedRow = null;
            return;
        }

        this.selectedRow = row;
    }

    public getColumnIDs(): string[] {
        return this.columns.map((column: { id: string; name: string }) => column.id);
    }

    public addDistance(): void {
        this._dialog.open(AddDistanceDialogComponent);
    }

    public updateDistance(): void {}

    public deleteDistance(): void {}
}
