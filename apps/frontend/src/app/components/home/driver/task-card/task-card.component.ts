import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Base } from '../../../../types/user';
import { RainbowChipComponent } from "../../../rainbow-chip/rainbow-chip.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule, RainbowChipComponent, MatIconModule, MatButtonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() origin!: Base;
  @Input() destination!: Base;
  @Input() car!: string;

  constructor() {}


}
