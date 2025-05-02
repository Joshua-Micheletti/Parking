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
import { CommonModule, DatePipe } from '@angular/common';
import { RainbowChipComponent } from '../rainbow-chip/rainbow-chip.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { roleOrder, User } from '../../types/user';
import { TableService } from '../../services/table.service';
import { Subscription } from 'rxjs';
import { MatFormField } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-table',
    imports: [
        MatIconModule,
        MatTableModule,
        MatButtonModule,
        CommonModule,
        RainbowChipComponent,
        TranslateModule,
        MatSortModule,
        MatFormField,
        MatInputModule
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
    @Input() public data: T[] = [];
    @Input() public columns: Column[] = [];
    @Input() public actions: Action[] = [];

    @Output('selectedRow') public selectedRowEvent: EventEmitter<T | null> = new EventEmitter();

    @ViewChild(MatSort) sort!: MatSort;

    public selectedRow: T | null = null;

    public dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);

    private _subscriptions: Subscription[] = [];

    constructor(
        private _tableService: TableService,
        private _applicationRef: ApplicationRef,
        private _translateService: TranslateService
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

    public applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    public clearFilter(element: HTMLInputElement): void {
        this.dataSource.filter = '';
        element.value = '';
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
        this.dataSource.filterPredicate = (data: any, filter: string) => {
            const parsedFields: string[] = [];

            for (const column of this.columns) {
                if (data[column.id] === null) {
                    continue;
                } else if (column.date) {
                    const datePipe = new DatePipe('en-US');
                    parsedFields.push(datePipe.transform(data[column.id], 'd/M/yy') ?? '');
                } else if (column.translation) {
                    parsedFields.push(this._translateService.instant(column.translation + data[column.id]));
                } else {
                    if (typeof data[column.id] === 'number') {
                        parsedFields.push(data[column.id].toString());
                    } else {
                        parsedFields.push(data[column.id]);
                    }
                }
            }

            return parsedFields.some((field) => field.toLowerCase().includes(filter.trim().toLowerCase()));
        };
    }
}
