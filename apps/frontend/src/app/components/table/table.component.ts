import {
    AfterViewInit,
    ApplicationRef,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Action, Column } from '../../types/table';
import { CommonModule } from '@angular/common';
import { RainbowChipComponent } from '../rainbow-chip/rainbow-chip.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { roleOrder, User } from '../../types/user';
import { TableService } from '../../services/table.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-table',
    imports: [
        MatIconModule,
        MatTableModule,
        MatButtonModule,
        CommonModule,
        RainbowChipComponent,
        TranslateModule,
        MatSortModule
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
    @Input() public data: T[] = [];
    @Input() public columns: Column[] = [];
    @Input() public actions: Action<T>[] = [];

    @Output('selectedRow') public selectedRowEvent: EventEmitter<T | null> = new EventEmitter();

    @ViewChild(MatSort) sort!: MatSort;

    public selectedRow: T | null = null;

    public dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);

    private _subscriptions: Subscription[] = [];

    constructor(
        private _tableService: TableService,
        private _applicationRef: ApplicationRef
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this._setupData(this.data);

        this._tableService.update$.subscribe(() => {
            this._applicationRef.tick();
            this._setupData(this.data);
        });
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    public getColumnIDs(): string[] {
        return this.columns.map((column: Column) => column.id);
    }

    public selectRow(row: T): void {
        this.selectedRow === row ? (this.selectedRow = null) : (this.selectedRow = row);
        this.selectedRowEvent.emit(this.selectedRow);
    }

    public check(): void {
        console.log(this.columns);
    }

    private _setupData(data: T[]): void {
        this.dataSource = new MatTableDataSource<T>(data);
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item: T, sortHeaderId: string) => {
            if (sortHeaderId === 'role') {
                return roleOrder[(<User>item).role] || 999;
            }

            const value = item[sortHeaderId as keyof T];

            if (typeof value === 'string' || typeof value === 'number') {
                return value;
            }

            return '';
        };
    }
}
