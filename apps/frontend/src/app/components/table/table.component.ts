import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    DoCheck,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Action, Column } from '../../types/table';
import { CommonModule } from '@angular/common';
import { RainbowChipComponent } from '../rainbow-chip/rainbow-chip.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { Role, roleOrder, User } from '../../types/user';
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
export class TableComponent<T> implements OnInit, AfterViewInit, OnDestroy, DoCheck {
    @Input() public data: T[] = [];
    @Input() public columns: Column[] = [];
    @Input() public actions: Action[] = [];

    @Output('selectedRow') public selectedRowEvent: EventEmitter<T | null> = new EventEmitter();

    @ViewChild(MatSort) sort!: MatSort;

    public selectedRow: T | null = null;

    public dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);

    private _subscriptions: Subscription[] = [];

    constructor(private _tableService: TableService, private _changeDetectionRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this._tableService.update$.subscribe(() => {
            this.data;
            console.log("🐛 | table.component.ts:61 | TableComponent<T> | this._tableService.update$.subscribe | this.data:", this.data)
            this._changeDetectionRef.detectChanges();
        });
    }
    ngAfterViewInit() {
        this.dataSource = new MatTableDataSource<T>(this.data);
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

    ngDoCheck(): void {
        this._changeDetectionRef.markForCheck();
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
}
