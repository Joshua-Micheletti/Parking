import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { UserComponent } from '../../../user/user.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FuelType, GearboxType } from '../../../../types/parkedCar';
import { Base } from '../../../../types/user';
import { RainbowChipComponent } from '../../../rainbow-chip/rainbow-chip.component';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import { UtilsService } from '../../../../services/utils.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-task-description',
    imports: [
        MatIconModule,
        UserComponent,
        MatMenuModule,
        MatButtonModule,
        RainbowChipComponent,
        RainbowChipComponent,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        TranslateModule
    ],
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
    public color: string = 'Red';
    public startDate: string = '';
    public endDate: string = '';

    constructor(private route: ActivatedRoute, private _router: Router, private _utilsService: UtilsService) {}

    ngOnInit() {
        this.taskId = this.route.snapshot.paramMap.get('id')!;
        console.log('Task ID:', this.taskId);
    }

    public togglePlaying() {
        if (this.startDate === '') {
          this.startDate = this._utilsService.getDate();
        }
        this.playing = !this.playing;
    }

    public onFinish() {
      this.endDate = this._utilsService.getDate();
    }

    public onGoBack() {
        this._router.navigate(['/home']);
    }


}
