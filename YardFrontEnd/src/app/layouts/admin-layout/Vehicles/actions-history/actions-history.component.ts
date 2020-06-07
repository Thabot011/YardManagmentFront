import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client, VehicleActionHistoryRequest, IVehicleActionHistoryRecord, IVehicleActionRecord, VehicleActionRequest, VehicleActionHistoryRecord } from '../../../../shared/service/appService';
import { FormBuilder, Validators } from '@angular/forms';
import { DisplayColumns } from '../../../../shared/Entity/displayColumns';
import { Paging } from '../../../../shared/Entity/Paging';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-actions-history',
    templateUrl: './actions-history.component.html',
    styleUrls: ['./actions-history.component.css'],
    providers: [DatePipe]
})
export class ActionsHistoryComponent extends BaseListClass implements OnInit {
    actions: IVehicleActionRecord[]
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private appService: Client,
        private fb: FormBuilder, private datepipe: DatePipe,
        private ref: ChangeDetectorRef) {
        super();
    }


    displayColumns: DisplayColumns[] = [
        { key: "actionName", value: "Action name" },
        { key: "actionDate", value: "Action date" },
    ];


    getAll = (pageing: Paging) => {

        if (pageing.filter) {
            pageing.filter.vehicleId = this.data.id;
        }
        else {
            pageing.filter = {};
            pageing.filter.vehicleId = this.data.id;
        }

        return this.appService.listVehicleActionHistory(new VehicleActionHistoryRequest({
            pageIndex: pageing.pageNum,
            pageSize: pageing.pageSize,
            orderByColumn: pageing.sortProperty,
            isDesc: pageing.sortDirection == "desc" ? true : false,
            vehicleActionHistoryRecord: pageing.filter
        }))
    }

    reactiveForm = () => {
        this.form = this.fb.group({
            actionId: [null],
            actionDate: [null],
        }, { validator: this.atLeastOne(Validators.required) })
    }

    submitForm = () => {
        if (this.form.valid) {
            let actionHistory: IVehicleActionHistoryRecord = this.form.value;
            actionHistory.id = 0;

            this.filter = actionHistory;
            this.ref.detectChanges();
            if (this.appTable.paginator) {
                this.appTable.paginator.firstPage();
            }
            this.appTable.ngAfterViewInit();
        }

    }

    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listVehicleAction(new VehicleActionRequest()).subscribe(data => {
            this.actions = data.data;
        })


    }

    cancelSearch = () => {
        this.filter = new VehicleActionHistoryRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }

}
