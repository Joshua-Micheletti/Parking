import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { Base, isBase, isRole, Role } from '../../types/user';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-rainbow-chip',
  imports: [MatChipsModule, CommonModule, TranslateModule],
  templateUrl: './rainbow-chip.component.html',
  styleUrl: './rainbow-chip.component.scss'
})
export class RainbowChipComponent {
  @Input() value!: Role | Base;
  @Input() text?: string;

  public isBase = isBase;
  public isRole = isRole;
}
