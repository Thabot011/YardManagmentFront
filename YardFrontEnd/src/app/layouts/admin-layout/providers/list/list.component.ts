import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { ComponentType } from '@angular/cdk/portal';
import { ManageProvidersComponent } from '../manage-providers/manage-providers.component';
import { Client, ProviderRequest, ProviderRecord, ProviderContactRequest, ProviderContactRecord, ProviderTypeRecord, CountryRecord, EmirateRecord, EmirateRequest, IProviderRecord, CountryRequest, ProviderTypeRequest } from '../../../../shared/service/appService';
import { KeyValue } from '@angular/common';
import { ManageProviderContractsComponent } from '../manage-provider-contracts/manage-provider-contracts.component';
import { FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { TableComponent } from '../../../../shared/component/table/table.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
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
    providerTypes: ProviderTypeRecord[];

    countries: CountryRecord[];
    emirates: EmirateRecord[];

    filter: IProviderRecord;

    AddOrEditComponent: ComponentType<ManageProvidersComponent> = ManageProvidersComponent;
    detailsLink: string = "provider/contactsList";

    constructor(private appService: Client, private fb: FormBuilder,
        private _snackBar: MatSnackBar, private ref: ChangeDetectorRef) { }

    getAll = (pageing: Paging) => {
        return this.appService.listProvider(new ProviderRequest({
            pageIndex: pageing.pageNum,
            pageSize: pageing.pageSize,
            orderByColumn: pageing.sortProperty,
            isDesc: pageing.sortDirection == "desc" ? true : false,
            providerRecord: pageing.filter
        }))
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
            mobile: [''],
            website: [''],
            trn: [''],
        }, { validator: atLeastOne(Validators.required) })
    }


    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listCountry(new CountryRequest()).subscribe(data => {
            this.countries = data.data;
        });

        this.appService.listProviderType(new ProviderTypeRequest()).subscribe(data => {
            this.providerTypes = data.data;
        })


    }

    submitForm() {
        if (this.form.valid) {
            let provider: IProviderRecord = this.form.value;

            provider.id = 0;
            this.filter = provider;
            this.ref.detectChanges();
            this.appTable.ngAfterViewInit();
        }

    }
    changeActivation = (row: ProviderRecord) => {
        if (row.isActive) {
            return this.appService.deActivateProvider(new ProviderRequest({
                providerRecord: row
            }));
        }
        else {
            return this.appService.activateProvider(new ProviderRequest({
                providerRecord: row
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
        this.filter = new ProviderRecord();
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
