import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Distance } from '../../../../../types/distance';
import { DistanceService } from '../../../../../services/distance.service';
import { DialogRef } from '@angular/cdk/dialog';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-add-distance-dialog',
    imports: [MatButtonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule],
    templateUrl: './add-distance-dialog.component.html',
    styleUrl: './add-distance-dialog.component.scss'
})
export class AddDistanceDialogComponent implements OnInit, OnDestroy {
    public distanceForm: FormGroup = new FormGroup({});
    private _subscriptions: Subscription[] = [];

    constructor(private _dialogRef: DialogRef, private _distanceService: DistanceService) {}

    ngOnInit(): void {
        this.distanceForm.addControl('origin', new FormControl());
        this.distanceForm.addControl('destination', new FormControl());
        this.distanceForm.addControl('distance', new FormControl());
        this.distanceForm.addControl('fuel_price', new FormControl());
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    public save(): void {
        if (this.distanceForm.invalid) {
            this.distanceForm.markAllAsTouched();
            return;
        }

        const formData: Distance = this.distanceForm.getRawValue();

        const subscription: Subscription = this._distanceService.addDistance(formData).subscribe((success: boolean) => {
            if (success) {
                this._dialogRef.close();
            }
        });

        this._subscriptions.push(subscription);
    }

    public close(): void {
        this._dialogRef.close();
    }
}
