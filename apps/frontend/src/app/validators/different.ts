import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function different(controlAName: string, controlBName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const controlA = formGroup.get(controlAName);
        const controlB = formGroup.get(controlBName);

        if (!controlA || !controlB) return null;

        const valueA = controlA.value;
        const valueB = controlB.value;

        if (valueA === valueB) {
            controlA.setErrors({ different: true });
            controlB.setErrors({ different: true });

            return { invalidSame: true };
        } else {
            // clear any old errors if valid
            if (controlA.errors?.['different']) {
                delete controlA.errors['different'];
                if (Object.keys(controlA.errors).length === 0) {
                    controlA.setErrors(null);
                }
            }
            // clear any old errors if valid
            if (controlB.errors?.['different']) {
                delete controlB.errors['different'];
                if (Object.keys(controlB.errors).length === 0) {
                    controlB.setErrors(null);
                }
            }

            return null;
        }
    };
}
