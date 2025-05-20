import { Component, Input, OnInit } from '@angular/core';
import { ServiceService } from '../../../../../services/service.service';
import { ExtendedService, Service } from '../../../../../types/service';
import { v4 as uuidv4 } from 'uuid';
import { RainbowChipComponent } from "../../../../rainbow-chip/rainbow-chip.component";

@Component({
    selector: 'app-service',
    imports: [RainbowChipComponent],
    templateUrl: './service.component.html',
    styleUrl: './service.component.scss'
})
export class ServiceComponent implements OnInit {
    @Input() carId!: string;

    public services: ExtendedService[] = [];

    constructor(private _serviceService: ServiceService) {}

    ngOnInit(): void {
        this._serviceService.getServices(this.carId).subscribe((services: ExtendedService[] | undefined) => {
            this.services = services ?? [];
        });
    }

    public addService(): void {
        this._serviceService
            .postService({
                carId: this.carId,
                assigner: '00000000-0000-0000-0000-000000000000',
                assignee: '9d2dc167-85e5-481a-9e03-52f4b656dc6c',
                type: 'PREPARATION DELIVERY'
            })
            .subscribe((services: ExtendedService[] | undefined) => {
                this.services = services ?? [];
            });
    }
}
