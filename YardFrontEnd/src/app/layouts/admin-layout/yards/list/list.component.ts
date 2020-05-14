import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { ManageYardDataComponent } from '../manage-yard-data/manage-yard-data.component';
import { ComponentType } from '@angular/cdk/portal';
import { Client, IYardRecord, YardRequest, YardRecord, CountryRecord, EmirateRecord, CountryRequest, EmirateRequest } from '../../../../shared/service/appService';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { KeyValue } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent extends BaseListClass implements OnInit {

    displayColumns: KeyValue<string, string>[] = [
        { key: "name", value: "Name" },
        { key: "capacity", value: "Capacity" },
        { key: "countryName", value: "Country name" },
        { key: "emirateName", value: "Emirate name" },
        { key: "distance", value: "Distance" },
        { key: "statusName", value: "Status name" }
    ];

    countries: CountryRecord[];
    emirates: EmirateRecord[];

    AddOrEditComponent: ComponentType<ManageYardDataComponent> = ManageYardDataComponent;

    constructor(private appService: Client, private fb: FormBuilder,
        private ref: ChangeDetectorRef) {
        super();
    }



    getAll = (pageing: Paging) => {
        return this.appService.listYard(new YardRequest({
            pageIndex: pageing.pageNum,
            pageSize: pageing.pageSize,
            orderByColumn: pageing.sortProperty,
            isDesc: pageing.sortDirection == "desc" ? true : false,
            yardRecord: pageing.filter
        }))
    }

    reactiveForm = () => {
        this.form = this.fb.group({
            name: [''],
            countryId: [''],
            emirateId: [''],
            boundaries: [''],
            capacity: [''],
            distance: [''],
            thresholdCapacity: [''],
            workingFrom: [''],
            workingTo: [''],
        }, { validator: this.atLeastOne(Validators.required) })
    }

    ngOnInit(): void {
        this.reactiveForm();

        this.appService.listCountry(new CountryRequest()).subscribe(data => {
            this.countries = data.data;
        });


    }

    submitForm = () => {
        if (this.form.valid) {
            let provider: IYardRecord = this.form.value;

            provider.id = 0;
            this.filter = provider;
            this.ref.detectChanges();
            this.appTable.ngAfterViewInit();
        }

    }

    changeActivation = (row: YardRecord) => {
        if (row.isActive) {
            return this.appService.deActivateYard(new YardRequest({
                yardRecord: row
            }));
        }
        else {
            return this.appService.activateYard(new YardRequest({
                yardRecord: row
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
        this.filter = new YardRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }
}
