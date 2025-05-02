import { ApplicationRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Distance } from '../../../../types/distance';
import { MatTableModule } from '@angular/material/table';
import { DistanceService } from '../../../../services/distance.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dialog } from '@angular/cdk/dialog';
import { Action, Column } from '../../../../types/table';
import { TableComponent } from '../../../table/table.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormDialogComponent } from '../../../dialogs/form-dialog/form-dialog.component';
import { ControlData, FormDialogData } from '../../../../types/formDialog';
import { bases, baseTranslation } from '../../../../types/user';
import { Validators } from '@angular/forms';
import { different } from '../../../../validators/different';
import { TableService } from '../../../../services/table.service';

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
        {
            id: 'origin',
            name: 'features.distances.fields.origin',
            icon: 'arrow_upward',
            chip: true,
            translation: 'data.base.',
            sortable: true
        },
        {
            id: 'destination',
            name: 'features.distances.fields.destination',
            icon: 'arrow_downward',
            chip: true,
            translation: 'data.base.',
            sortable: true
        },
        { id: 'distance', name: 'features.distances.fields.distance', unit: 'Km', sortable: true },
        { id: 'fuel_price', name: 'features.distances.fields.price', unit: '€', sortable: true }
    ];

    public actions: Action[] = [
        {
            callback: this.openAddDialog.bind(this),
            name: 'features.distances.actions.add',
            icon: 'add_circle'
        },
        {
            callback: this.updateDistance.bind(this),
            name: 'features.distances.actions.update',
            condition: 'selectedRow',
            icon: 'rebase_edit'
        },
        {
            callback: this.deleteDistance.bind(this),
            name: 'features.distances.actions.delete',
            condition: 'selectedRow',
            type: 'warn',
            icon: 'delete'
        }
    ];

    public addDistanceControls: ControlData[] = [
        {
            label: 'features.distances.fields.origin',
            name: 'origin',
            enum: bases,
            translation: baseTranslation,
            validators: [Validators.required]
        },
        {
            label: 'features.distances.fields.destination',
            name: 'destination',
            enum: bases,
            translation: baseTranslation,
            validators: [Validators.required]
        },
        {
            label: 'features.distances.fields.distance',
            name: 'distance',
            validators: [Validators.required]
        },
        {
            label: 'features.distances.fields.price',
            name: 'fuel_price',
            validators: [Validators.required]
        }
    ];

    private _selectedDistance: Distance | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(
        private _distanceService: DistanceService,
        private _matDialog: MatDialog,
        private _tableService: TableService
    ) {}

    ngOnInit(): void {
        this._distanceService.getDistances();

        this._subscriptions.push(
            this._distanceService.distances$.subscribe((distances: Distance[]) => {
                this.distances = distances;
                this._tableService.update$.next();
                this._matDialog.closeAll();
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

    public openAddDialog(): void {
        const data: FormDialogData = {
            title: 'features.distances.actions.update',
            actions: [
                {
                    name: 'features.distances.actions.add',
                    callback: this.addDistance.bind(this)
                }
            ],
            controls: this.addDistanceControls,
            formValidators: [different('origin', 'destination')]
        };

        this._matDialog.open(FormDialogComponent, {
            data: data
        });
    }

    public addDistance(distance?: Distance, dialogRef?: MatDialogRef<FormDialogComponent>): void {
        if (distance === undefined || dialogRef === undefined) {
            console.error('MISSING PARAMETERS IN FUNCTION addDistance');
            return;
        }

        const subscription = this._distanceService.addDistance(distance).subscribe((success: boolean) => {
            if (success) {
                dialogRef.close();
            }
            subscription.unsubscribe();
        });
    }

    public updateDistance(): void {}

    public deleteDistance(): void {}
}
