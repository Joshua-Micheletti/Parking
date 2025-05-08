import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Action, Column } from '../../../../types/table';
import { TableComponent } from '../../../table/table.component';
import { MatDialog } from '@angular/material/dialog';
import { TableService } from '../../../../services/table.service';
import { Operation } from '../../../../types/operation';
import { OperationService } from '../../../../services/operation.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-operations',
    imports: [TableComponent, MatButtonModule, MatIconModule],
    templateUrl: './operations.component.html',
    styleUrl: './operations.component.scss'
})
export class OperationsComponent implements OnInit, OnDestroy, AfterViewInit {
    /* ------------------------------- Table Data ------------------------------- */
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;

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
            icon: 'thumb_down'
        }
    ];

    private _selectedOperation: Operation | null = null;

    private _subscriptions: Subscription[] = [];

    constructor(
        private _operationService: OperationService,
        private _matDialog: MatDialog,
        private _tableService: TableService
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
        this.columns.push({ id: 'actions', name: '', customTemplate: this.actionTemplate, sticky: 'end'});
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

    public acceptOperation(): void {
        if (!this._selectedOperation) {
            console.error('CALLED ACCEPT OPERATION WITHOUT SELECTING AN OPERATION');
            return;
        }

        this._operationService.acceptOperation(this._selectedOperation.id);
    }

    public rejectOperation(): void {
        
    }

    public check(element: any): void {
        console.log("🐛 | operations.component.ts:110 | OperationsComponent | check | element:", element)
    }
}
