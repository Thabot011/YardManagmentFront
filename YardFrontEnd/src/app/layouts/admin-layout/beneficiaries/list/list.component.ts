import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { ManageBeneficiarieComponent } from '../manage-beneficiarie/manage-beneficiarie.component';
import { ComponentType } from '@angular/cdk/portal';
import { Client, BeneficiaryRequest, BeneficiaryRecord, ProviderTypeRecord, CountryRecord, EmirateRecord, IProviderRecord, CountryRequest, ProviderTypeRequest, IBeneficiaryRecord, EmirateRequest, BeneficiaryTypeRecord, BeneficiaryTypeRequest } from '../../../../shared/service/appService';
import { KeyValue } from '@angular/common';
import { TableComponent } from '../../../../shared/component/table/table.component';
import { FormGroup, FormBuilder, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    @ViewChild(TableComponent) appTable: TableComponent;

    displayColumns: KeyValue<string, string>[] = [
        { key: "name", value: "Name" },
        { key: "typeName", value: "Type name" },
        { key: "countryName", value: "Country name" },
        { key: "emirateName", value: "Emirate name" },
        { key: "trn", value: "TRN" },

    ];

    form: FormGroup;
    beneficiaryTypes: BeneficiaryTypeRecord[];

    countries: CountryRecord[];
    emirates: EmirateRecord[];

    filter: IBeneficiaryRecord;

    AddOrEditComponent: ComponentType<ManageBeneficiarieComponent> = ManageBeneficiarieComponent;
    detailsLink: string = "beneficiarie/contactsList";

    constructor(private appService: Client, private fb: FormBuilder,
        private _snackBar: MatSnackBar, private ref: ChangeDetectorRef) { }

    getAll = (pageing: Paging) => {
        return this.appService.listBeneficiary(new BeneficiaryRequest({
            pageIndex: pageing.pageNum,
            pageSize: pageing.pageSize,
            orderByColumn: pageing.sortProperty,
            isDesc: pageing.sortDirection == "desc" ? true : false,
            beneficiaryRecord: pageing.filter
        }));
    }

    reactiveForm() {
        this.form = this.fb.group({
            name: [''],
            typeId: [''],
            countryId: [''],
            emirateId: [''],
            address: [''],
            email: [''],
            landline: [''],
            website: [''],
            trn: [''],
        }, { validator: atLeastOne(Validators.required) })
    }


    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listCountry(new CountryRequest()).subscribe(data => {
            this.countries = data.data;
        });

        this.appService.listBeneficiaryType(new BeneficiaryTypeRequest()).subscribe(data => {
            this.beneficiaryTypes = data.data;
        })
    }

    submitForm() {
        if (this.form.valid) {
            let beneficiary: IBeneficiaryRecord = this.form.value;
            beneficiary.id = 0;
            this.filter = beneficiary;
            this.ref.detectChanges();
            this.appTable.ngAfterViewInit();


        }

    }

    changeActivation = (row: BeneficiaryRecord) => {
        if (row.isActive) {
            return this.appService.deActivateBeneficiary(new BeneficiaryRequest({
                beneficiaryRecord: row
            }));
        }
        else {
            return this.appService.activateBeneficiary(new BeneficiaryRequest({
                beneficiaryRecord: row
            }));
        }
    }
    onChangeCountry(e: MatSelectChange) {
        if (e.value) {
            this.appService.listEmirate(new EmirateRequest({
                emirateRecord: {
                    countryId: e.value
                }
            })).subscribe(
                data => {
                    this.emirates = data.data;
                }
            );
        } else {
            this.emirates = null;
        }
    }

    cancelSearch = () => {
        this.filter = new BeneficiaryRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }


    notify = (message: string, label: string) => {
        this._snackBar.open(message, label, {
            horizontalPosition: "center",
            verticalPosition: "bottom",
            duration: 2000
        });
    }

}

export const atLeastOne = (validator: ValidatorFn) => (
    group: FormGroup,
): ValidationErrors | null => {
    const hasAtLeastOne =
        group &&
        group.controls &&
        Object.keys(group.controls).some(k => !validator(group.controls[k]));

    return hasAtLeastOne ? null : { atLeastOne: true };
};
