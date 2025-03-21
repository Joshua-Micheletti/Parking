import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Action, Column } from '../../types/table';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-table',
    imports: [MatIconModule, MatTableModule, MatButtonModule, CommonModule],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent<T> {
    @Input() public data: T[] = [];
    @Input() public columns: Column[] = [];
    @Input() public actions: Action[] = [];

    @Output('selectedRow') public selectedRowEvent: EventEmitter<T | null> = new EventEmitter();

    public selectedRow: T | null = null;

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
