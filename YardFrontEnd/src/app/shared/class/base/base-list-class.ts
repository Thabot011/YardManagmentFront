import { KeyValue } from "@angular/common";
import { ComponentType } from "@angular/cdk/portal";
import { Paging } from "../../Entity/Paging";
import { Observable } from "rxjs";
import { ViewChild } from "@angular/core";
import { TableComponent } from "../../component/table/table.component";
import { FormGroup, ValidatorFn, ValidationErrors } from "@angular/forms";

export abstract class BaseListClass {
    abstract displayColumns: KeyValue<string, string>[];
    abstract AddOrEditComponent: ComponentType<any>;
    abstract getAll: (paging: Paging) => Observable<any>
    abstract reactiveForm: () => void;
    abstract submitForm: () => void;
    abstract changeActivation: (row: any) => Observable<any>;
    abstract cancelSearch: () => void;

    @ViewChild(TableComponent) appTable: TableComponent;
    form: FormGroup;
    filter: any;

    constructor() { }




    atLeastOne = (validator: ValidatorFn) => (
        group: FormGroup,
    ): ValidationErrors | null => {
        const hasAtLeastOne =
            group &&
            group.controls &&
            Object.keys(group.controls).some(k => !validator(group.controls[k]));

        return hasAtLeastOne ? null : { atLeastOne: true };
    };
}
