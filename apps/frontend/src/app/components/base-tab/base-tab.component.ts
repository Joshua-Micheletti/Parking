import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Base } from '../../types/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-tab',
  imports: [MatTabsModule, CommonModule],
  templateUrl: './base-tab.component.html',
  styleUrl: './base-tab.component.scss'
})
export class BaseTabComponent implements OnInit {
  @Input() template!: TemplateRef<any>;

  public availableBases: Base[] = [];

  public currentBase: Base = 'SEV';

  constructor (private _baseService: BaseService) {}

  ngOnInit(): void {
    this.availableBases = this._baseService.bases;
  }

  changeBase(event: MatTabChangeEvent): void {
    this.currentBase = this.availableBases[event.index];
  }
}
