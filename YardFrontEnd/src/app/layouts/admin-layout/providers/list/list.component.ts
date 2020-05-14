import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { ComponentType } from '@angular/cdk/portal';
import { ManageProvidersComponent } from '../manage-providers/manage-providers.component';
import { Client, ProviderRequest, ProviderRecord, ProviderTypeRecord, CountryRecord, EmirateRecord, EmirateRequest, IProviderRecord, CountryRequest, ProviderTypeRequest } from '../../../../shared/service/appService';
import { KeyValue } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent extends BaseListClass implements OnInit {


    displayColumns: KeyValue<string, string>[] = [
        { key: "name", value: "Name" },
        { key: "typeName", value: "Type name" },
        { key: "countryName", value: "Country name" },
        { key: "emirateName", value: "Emirate name" },
        { key: "trn", value: "TRN" },

    ];

    providerTypes: ProviderTypeRecord[];

    countries: CountryRecord[];
    emirates: EmirateRecord[];


    AddOrEditComponent: ComponentType<ManageProvidersComponent> = ManageProvidersComponent;
    detailsLink: string = "provider/contactsList";

    constructor(private appService: Client, private fb: FormBuilder,
        private ref: ChangeDetectorRef) {
        super();
    }

    getAll = (pageing: Paging) => {
        return this.appService.listProvider(new ProviderRequest({
            pageIndex: pageing.pageNum,
            pageSize: pageing.pageSize,
            orderByColumn: pageing.sortProperty,
            isDesc: pageing.sortDirection == "desc" ? true : false,
            providerRecord: pageing.filter
        }))
    }

    reactiveForm = () => {
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
            isActive:[''],
        }, { validator: this.atLeastOne(Validators.required) })
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

    submitForm = () => {
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




}


