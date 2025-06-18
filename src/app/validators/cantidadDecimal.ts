import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const cantidadDecimalSiPesableValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const pesable = formGroup.get('pesable')?.value;
    const cant = formGroup.get('cant')?.value;

    if (!pesable) return null; // si no es pesable, no aplica validación

    const esDecimal = Number(cant) === parseFloat(cant) && !Number.isInteger(Number(cant));

    return esDecimal ? null : { cantidadDebeSerDecimal: true };
};
