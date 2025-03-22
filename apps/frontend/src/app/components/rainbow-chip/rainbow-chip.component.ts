import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { Base, isBase, isRole, Role } from '../../types/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rainbow-chip',
  imports: [MatChipsModule, CommonModule],
  templateUrl: './rainbow-chip.component.html',
  styleUrl: './rainbow-chip.component.scss'
})
export class RainbowChipComponent {
  @Input() value!: Role | Base;

  public isBase = isBase;
  public isRole = isRole;
}
