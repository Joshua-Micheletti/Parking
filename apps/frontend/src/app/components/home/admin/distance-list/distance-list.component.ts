import { Component, OnDestroy, OnInit } from '@angular/core';
import { Distance } from '../../../../types/distance';
import { MatTableModule } from '@angular/material/table';
import { DistanceService } from '../../../../services/distance.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dialog } from '@angular/cdk/dialog';
import { AddDistanceDialogComponent } from './add-distance-dialog/add-distance-dialog.component';
import { Action, Column } from '../../../../types/table';
import { TableComponent } from '../../../table/table.component';
import { Event } from '@angular/router';

@Component({
    selector: 'app-distance-list',
    imports: [MatTableModule, MatIconModule, MatButtonModule, TableComponent],
    templateUrl: './distance-list.component.html',
    styleUrl: './distance-list.component.scss'
})
export class DistanceListComponent implements OnInit, OnDestroy {
    /* ------------------------------- Table Data ------------------------------- */
    public distances: Distance[] = [];

    public columns: Column[] = [
        { id: 'origin', name: 'Origin', icon: 'arrow_upward' },
        { id: 'destination', name: 'Destination', icon: 'arrow_downward' },
        { id: 'distance', name: 'Distance', unit: 'Km' },
        { id: 'fuel_price', name: 'Price', unit: '€' }
    ];

    public actions: Action[] = [
        {
            callback: this.addDistance.bind(this),
            name: 'Add Distance'
        },
        {
            callback: this.updateDistance.bind(this),
            name: 'Update Distance',
            condition: 'selectedRow'
        },
        {
            callback: this.deleteDistance.bind(this),
            name: 'Delete Distance',
            condition: 'selectedRow',
            type: 'warn'
        }
    ]

    private _selectedDistance: Distance | null = null;

    private _subscriptions: Subscription[] = [];

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

    public onSelectDistance(distance: Distance | null): void {
        this._selectedDistance = distance;
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
