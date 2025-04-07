import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import moment from "moment";

export function notFutureValidator(controlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const control = formGroup.get(controlName);

        if (!control) return null;

        const value = control.value;

        if (moment.isMoment(value)) {
            if (value.isAfter(moment())) {
                control.setErrors({ future: true });
                return { future: true };
            } else {
                if (control.errors?.['future']) {
                    delete control.errors['future'];
                    if (Object.keys(control.errors).length === 0) {
                        control.setErrors(null);
                    }
                }
                return null;
            }
        }


        return null;
    }
}