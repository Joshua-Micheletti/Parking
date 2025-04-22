import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { UserComponent } from '../../../user/user.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FuelType, GearboxType } from '../../../../types/parkedCar';
import { Base } from '../../../../types/user';
import { RainbowChipComponent } from "../../../rainbow-chip/rainbow-chip.component";

@Component({
    selector: 'app-task-description',
    imports: [MatIconModule, UserComponent, MatMenuModule, MatButtonModule, RainbowChipComponent, RainbowChipComponent],
    templateUrl: './task-description.component.html',
    styleUrl: './task-description.component.scss'
})
export class TaskDescriptionComponent implements OnInit {
    public taskId!: string;
    public playing: boolean = false;
    public licensePlate: string = '0614LMW';
    public model: string = 'Tuareg';
    public brand: string = 'VolksWagen';
    public fuelType: FuelType = 'DIESEL';
    public gearboxType: GearboxType = 'MANUAL';
    public origin: Base = 'SEV';
    public destination: Base = 'MLG';

    constructor(private route: ActivatedRoute, private _router: Router) {}

    ngOnInit() {
        this.taskId = this.route.snapshot.paramMap.get('id')!;
        console.log('Task ID:', this.taskId);
    }

    public togglePlaying() {
      this.playing = !this.playing;
    }

    public onGoBack() {
      this._router.navigate(['/home']);
    }
}
