import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';
import { KeyValue } from '@angular/common';
import { YardRecord, YardRequest, EmirateRequest, CountryRecord, EmirateRecord, CountryRequest, IYardRecord, Client } from '../../../../shared/service/appService';
import { MatSelectChange } from '@angular/material/select';
import { Validators, FormBuilder } from '@angular/forms';
import { Paging } from '../../../../shared/Entity/Paging';
import { DisplayColumns } from '../../../../shared/Entity/displayColumns';

@Component({
    selector: 'app-pending-updated-yards',
    templateUrl: './pending-updated-yards.component.html',
    styleUrls: ['./pending-updated-yards.component.css']
})
export class PendingUpdatedYardsComponent extends BaseListClass implements OnInit {

    displayColumns: DisplayColumns[] = [
        { key: "name", value: "Name" },
        { key: "capacity", value: "Capacity" },
        { key: "countryName", value: "Country name" },
        { key: "emirateName", value: "Emirate name" },
        { key: "statusName", value: "Status name" }
    ];

    countries: CountryRecord[];
    emirates: EmirateRecord[];

    constructor(private appService: Client, private fb: FormBuilder,
        private ref: ChangeDetectorRef) {
        super();

    }



    getAll = (pageing: Paging) => {

        if (pageing.filter) {
            pageing.filter.statusId = 1;
        }
        else {
            pageing.filter = {};
            pageing.filter.statusId = 1;
        }
        return this.appService.listYardToUpdate(new YardRequest({
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
            countryId: [undefined],
            emirateId: [undefined],
            capacity: [undefined],
            thresholdCapacity: [undefined],
            area: [undefined],
            workingFrom: [undefined],
            workingTo: [undefined],
            isActive: [undefined],
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
            let yard: IYardRecord = this.form.value;
            for (var key in yard) {
                if (!yard[key]) {
                    yard[key] = undefined;
                }
            }
            yard.id = 0;
            yard.isActive = this.form.controls.isActive.value;
            this.filter = yard;
            this.ref.detectChanges();
            if (this.appTable.paginator) {
                this.appTable.paginator.firstPage();
            }
            this.appTable.ngAfterViewInit();
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
        this.filter = new YardRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }

    approve = (row: YardRecord) => {

        return this.appService.approveYardToUpdate(new YardRequest({
            yardRecord: row
        }))

    }

    reject = (row: YardRecord) => {
        if (row.statusId == 1) {
            return this.appService.rejectYardToUpdate(new YardRequest({
                yardRecord: row
            }))
        }
    }

}
