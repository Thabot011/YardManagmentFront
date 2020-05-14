import { FormGroup } from "@angular/forms";
import { MatFormFieldAppearance } from "@angular/material/form-field";

export abstract class BaseManagementClass {
    form: FormGroup;
    abstract errorHandling: (control: string, error: string) => boolean;
    abstract submitForm: () => void;
    abstract reactiveForm: () => void;

    constructor() { }
}
