import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { firstValueFrom, lastValueFrom, skip, Subscription } from 'rxjs';
import { Action, Column } from '../../../../types/table';
import { TableComponent } from '../../../table/table.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TableService } from '../../../../services/table.service';
import { Operation } from '../../../../types/operation';
import { OperationService } from '../../../../services/operation.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormDialogComponent } from '../../../dialogs/form-dialog/form-dialog.component';
import { AutoCompleteOption, ControlData, FormDialogData } from '../../../../types/formDialog';
import { bases, baseTranslation } from '../../../../types/user';
import { Car, statusTranslation } from '../../../../types/parkedCar';
import { CarService } from '../../../../services/car.service';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-operations',
    imports: [TableComponent, MatButtonModule, MatIconModule],
    templateUrl: './operations.component.html',
    styleUrl: './operations.component.scss'
})
export class OperationsComponent implements OnInit, OnDestroy, AfterViewInit {
    /* ------------------------------- Table Data ------------------------------- */
    @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

    public operations: Operation[] = [];

    public columns: Column[] = [
        {
            id: 'username',
            name: 'features.operations.fields.username',
            icon: 'perm_identity',
            sortable: true
        },
        {
            id: 'base',
            name: 'features.operations.fields.base',
            icon: 'manage_accounts',
            chip: true,
            translation: 'data.base.',
            sortable: true
        },
        { id: 'type', name: 'features.operations.fields.type', sortable: true, translation: 'data.operationType.' },
        { id: 'date', name: 'features.operations.fields.date', sortable: true, date: true }
    ];

    public actions: Action[] = [
        {
            callback: this.acceptOperation.bind(this),
            name: 'features.operations.actions.accept',
            condition: 'selectedRow',
            icon: 'thumb_up'
        },
        {
            callback: this.rejectOperation.bind(this),
            name: 'features.operations.actions.reject',
            condition: 'selectedRow',
            icon: 'thumb_down',
            type: 'warn'
        }
    ];

    private _selectedOperation: Operation | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(
        private _operationService: OperationService,
        private _matDialog: MatDialog,
        private _tableService: TableService,
        private _carService: CarService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._operationService.getOperations();

        this._subscriptions.push(
            this._operationService.operations$.subscribe((operations: Operation[]) => {
                this.operations = operations;
                this._tableService.update$.next();
                this._matDialog.closeAll();
            })
        );
    }

    ngAfterViewInit(): void {
        this.columns.push({ id: 'actions', name: '', customTemplate: this.actionTemplate, sticky: 'end' });
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    public onSelectOperation(operation: Operation | null): void {
        this._selectedOperation = operation;
    }

    public getColumnIDs(): string[] {
        return this.columns.map((column: { id: string; name: string }) => column.id);
    }

    public acceptOperation(operation?: Operation): void {
        console.log('🐛 | operations.component.ts:109 | OperationsComponent | acceptOperation | operation:', operation);
        if (!this._selectedOperation) {
            console.error('CALLED ACCEPT OPERATION WITHOUT SELECTING AN OPERATION');
            return;
        }

        this._operationService.acceptOperation(this._selectedOperation.id);
    }

    public rejectOperation(): void {}

    public async openOperationInfo(operation: Operation): Promise<void> {
        this._selectedOperation = operation;

        let cars: Car[] = [];

        if (operation.data.car_id) {
            if (!operation.approved) {
                this._carService.getAvailableCars();
                try {
                    cars = await firstValueFrom(this._carService.availableCars$.pipe(skip(1)));
                } catch (error) {
                    console.error(error);
                    return;
                }
            }

            try {
                const currentCar: Car | undefined = await firstValueFrom(
                    this._carService.getCar(operation.data.car_id)
                );

                if (currentCar !== undefined && (operation.approved || !cars.includes(currentCar))) {
                    cars.push(currentCar);
                }
            } catch (error) {
                console.error(error);
                return;
            }
        }

        const formControls: ControlData[] = [
            {
                label: 'features.parking.fields.base',
                name: 'base',
                enum: bases,
                defaultValue: operation.data.base,
                translation: baseTranslation
            },
            {
                label: 'features.parking.fields.car',
                name: 'carId',
                defaultValue: cars.find((car: Car) => {
                    return car.id === operation.data.car_id;
                })?.licensePlate,
                validators: [Validators.required],
                autoComplete: cars.map((car: Car) => {
                    let autocompleteOption: AutoCompleteOption;

                    autocompleteOption = {
                        value: car.id,
                        display: car.licensePlate,
                        tooltip: this._carService.carTooltip(car)
                    };

                    return autocompleteOption;
                })
            },
            {
                label: 'features.parking.fields.notes',
                name: 'notes',
                defaultValue: operation.data.notes
            },
            {
                label: 'features.parking.fields.status',
                name: 'status',
                defaultValue: operation.data.status,
                enum: ['AVAILABLE', 'NOT AVAILABLE'],
                translation: statusTranslation
            }
        ];

        let actions: Action[] = [];

        if (!operation.approved) {
            actions = [
                {
                    callback: () => {},
                    name: 'features.operations.actions.modify',
                    condition: 'view',
                    icon: 'edit'
                },
                ...this.actions
            ];
        }

        const data: FormDialogData = {
            title: 'features.parking.actions.add',
            controls: formControls,
            actions: actions,
            groupSize: 2,
            view: true
        };

        this._matDialog.open(FormDialogComponent, {
            data
        });
    }

    public goTo(operation: Operation): void {
        if (operation.target === 'parking') {
            this._router.navigate(['/home/parking']);
        }
    }
}
