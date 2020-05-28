import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { ManageBeneficiarieComponent } from '../manage-beneficiarie/manage-beneficiarie.component';
import { ComponentType } from '@angular/cdk/portal';
import { Client, BeneficiaryRequest, BeneficiaryRecord, CountryRecord, EmirateRecord, CountryRequest, IBeneficiaryRecord, EmirateRequest, BeneficiaryTypeRecord, BeneficiaryTypeRequest } from '../../../../shared/service/appService';
import { KeyValue } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent extends BaseListClass implements OnInit {

    displayColumns: KeyValue<string, string>[] = [
        { key: "name", value: "Name" },
        { key: "typeName", value: "Type name" },
        { key: "countryName", value: "Country name" },
        { key: "emirateName", value: "Emirate name" },
        { key: "trn", value: "TRN" },

    ];

    beneficiaryTypes: BeneficiaryTypeRecord[];

    countries: CountryRecord[];
    emirates: EmirateRecord[];


    AddOrEditComponent: ComponentType<ManageBeneficiarieComponent> = ManageBeneficiarieComponent;
    detailsLink: string = "beneficiarie/contactsList";
    detailsLinkName: string = "View Contacts";


    constructor(private appService: Client, private fb: FormBuilder,
        private ref: ChangeDetectorRef) {
        super();
    }

    getAll = (pageing: Paging) => {
        return this.appService.listBeneficiary(new BeneficiaryRequest({
            pageIndex: pageing.pageNum,
            pageSize: pageing.pageSize,
            orderByColumn: pageing.sortProperty,
            isDesc: pageing.sortDirection == "desc" ? true : false,
            beneficiaryRecord: pageing.filter
        }));
    }

    reactiveForm = () => {
        this.form = this.fb.group({
            name: [''],
            typeId: [undefined],
            countryId: [undefined],
            emirateId: [undefined],
            address: [''],
            email: [''],
            landline: [undefined],
            website: [''],
            trn: [''],
            isActive: [undefined],
        }, { validator: this.atLeastOne(Validators.required) })
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

    submitForm = () => {
        if (this.form.valid) {
            let beneficiary: IBeneficiaryRecord = this.form.value;
            beneficiary.id = 0;
            this.filter = beneficiary;
            this.ref.detectChanges();
            if (this.appTable.paginator) {
                this.appTable.paginator.firstPage();
            }
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
            this.form.patchValue({ emirateId: null })
        }
    }

    cancelSearch = () => {
        this.filter = new BeneficiaryRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }



}

