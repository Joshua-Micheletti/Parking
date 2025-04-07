import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

function parseDate(dateStr: string): Date | null {
    const [day, month, year] = dateStr.split('/').map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day); // JS months are 0-based
}

export function greaterThanOrEqualValidator(controlAName: string, controlBName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const controlA = formGroup.get(controlAName);
        const controlB = formGroup.get(controlBName);

        if (!controlA || !controlB) return null;

        const valueA = controlA.value;
        const valueB = controlB.value;
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            if (dateRegex.test(valueA) && dateRegex.test(valueB)) {
                const dateA = parseDate(valueA);
                const dateB = parseDate(valueB);

                if (dateA === null || dateB === null) {
                    return null;
                }

                if (dateA < dateB) {
                    controlA.setErrors({ notAfter: true });
                    return { dateOrderInvalid: true };
                } else {
                    // clear any old errors if valid
                    if (controlA.errors?.['notAfter']) {
                        delete controlA.errors['notAfter'];
                        if (Object.keys(controlA.errors).length === 0) {
                            controlA.setErrors(null);
                        }
                    }
                }
            }

            return null;
        } else if (valueA instanceof Date && valueB instanceof Date) {
            if (valueA < valueB) {
                controlA.setErrors({ notAfter: true });
                return { dateOrderInvalid: true };
            } else {
                // clear any old errors if valid
                if (controlA.errors?.['notAfter']) {
                    delete controlA.errors['notAfter'];
                    if (Object.keys(controlA.errors).length === 0) {
                        controlB.setErrors(null);
                    }
                }
                return null;
            }
        } else if (moment.isMoment(valueA) && moment.isMoment(valueB)) {
            if (valueA.isBefore(valueB)) {
                controlA.setErrors({ notAfter: true });
                return { dateOrderInvalid: true };
            } else {
                // clear any old errors if valid
                if (controlA.errors?.['notAfter']) {
                    delete controlA.errors['notAfter'];
                    if (Object.keys(controlA.errors).length === 0) {
                        controlA.setErrors(null);
                    }
                }
                return null;
            }
        }

        return null;
    };
}
