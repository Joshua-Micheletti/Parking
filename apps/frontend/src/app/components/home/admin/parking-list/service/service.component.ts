import { Component, Input, OnInit } from '@angular/core';
import { ServiceService } from '../../../../../services/service.service';
import { ExtendedService, Service, serviceTypes } from '../../../../../types/service';
import { v4 as uuidv4 } from 'uuid';
import { RainbowChipComponent } from '../../../../rainbow-chip/rainbow-chip.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormDialogComponent } from '../../../../dialogs/form-dialog/form-dialog.component';
import { FormDialogData } from '../../../../../types/formDialog';
import { User } from '../../../../../types/user';
import { UserService } from '../../../../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../../services/auth.service';

@Component({
    selector: 'app-service',
    imports: [RainbowChipComponent, TranslateModule, DatePipe, MatButtonModule, MatIconModule, CommonModule],
    templateUrl: './service.component.html',
    styleUrl: './service.component.scss'
})
export class ServiceComponent implements OnInit {
    @Input() carId!: string;

    public services: ExtendedService[] = [];

    constructor(
        private _serviceService: ServiceService,
        private _matDialog: MatDialog,
        private _userService: UserService,
        private _translateService: TranslateService,
        private _authService: AuthService
    ) {}

    ngOnInit(): void {
        this._serviceService.getServices(this.carId).subscribe((services: ExtendedService[] | undefined) => {
            this.services = services ?? [];
        });
    }

    public async addServiceDialog(): Promise<void> {
        let usersResponse: User[] | undefined;

        try {
            usersResponse = await firstValueFrom(this._userService.getUsersObs());
        } catch (error) {
            console.error(error);
            return;
        }

        if (usersResponse === undefined || usersResponse.length === 0) {
            console.error('No eligible users found');
            return;
        }

        const data: FormDialogData = {
            title: 'Add Service',
            actions: [
                {
                    name: 'Add',
                    callback: this.addService.bind(this),
                    icon: 'add'
                }
            ],
            controls: [
                {
                    name: 'type',
                    label: 'Type',
                    enum: serviceTypes,
                    translation: 'data.serviceType.'
                },
                {
                    name: 'assignee',
                    label: 'Assignee',
                    autoComplete: usersResponse.map((user: User) => {
                        let tooltip = this._translateService.instant('features.users.fields.role') + ': ' + user.role;

                        if (this._authService.role === 'admin') {
                            tooltip =
                                this._translateService.instant('features.users.fields.base') +
                                ': ' +
                                user.base +
                                '\n' +
                                tooltip;
                        }

                        return {
                            value: user.id,
                            display: user.username,
                            tooltip: tooltip
                        };
                    })
                }
            ]
        };

        const dialog: MatDialogRef<FormDialogComponent> = this._matDialog.open(FormDialogComponent, {
            data: data,
            width: '80%'
        });
    }

    public addService(service?: Service, dialogRef?: MatDialogRef<any, any>): void {
        if (service === undefined || dialogRef === undefined) {
            console.error('CALLED ADD SERVICE WITHOUT PROPER ARGUMENTS');
            return;
        }

        this._serviceService
            .postService({
                carId: this.carId,
                assigner: this._authService.id!,
                assignee: service.assignee,
                type: service.type
            })
            .subscribe((services: ExtendedService[] | undefined) => {
                this.services = services ?? [];
                dialogRef.close();
            });
    }

    public deleteServiceDialog(service: ExtendedService): void {}

    public editServiceDialog(service: ExtendedService): void {}
}
