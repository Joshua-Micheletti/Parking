import { Component, Input, OnInit } from '@angular/core';
import { ServiceService } from '../../../../../services/service.service';
import { Service } from '../../../../../types/service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-service',
    imports: [],
    templateUrl: './service.component.html',
    styleUrl: './service.component.scss'
})
export class ServiceComponent implements OnInit {
    @Input() carId!: string;

    public services: Service[] = [];

    constructor(private _serviceService: ServiceService) {}

    ngOnInit(): void {
        this._serviceService.getServices(this.carId).subscribe((services: Service[] | undefined) => {
            this.services = services ?? [];
        });
    }

    public addService(): void {
        this._serviceService
            .postService({ carId: this.carId, assigner: uuidv4(), assignee: uuidv4(), type: 'PREPARATION DELIVERY' })
            .subscribe((services: Service[] | undefined) => {
                this.services = services ?? [];
            });
    }
}
