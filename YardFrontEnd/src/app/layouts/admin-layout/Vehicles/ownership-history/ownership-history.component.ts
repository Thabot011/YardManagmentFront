import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Client, VehicleOwnershipHistoryRequest, VehicleOwnershipHistoryRecord, IVehicleOwnershipHistoryRecord, ProviderRecord, BeneficiaryRecord, ProviderRequest, BeneficiaryRequest } from '../../../../shared/service/appService';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';
import { DisplayColumns } from '../../../../shared/Entity/displayColumns';
import { FormBuilder, Validators } from '@angular/forms';
import { Paging } from '../../../../shared/Entity/Paging';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-ownership-history',
    templateUrl: './ownership-history.component.html',
    styleUrls: ['./ownership-history.component.css'],
    providers: [DatePipe]
})
export class OwnershipHistoryComponent extends BaseListClass implements OnInit {
    providers: ProviderRecord[];
    Beneficiaries: BeneficiaryRecord[];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private appService: Client,
        private fb: FormBuilder, private datepipe: DatePipe,
        private ref: ChangeDetectorRef) {
        super();
    }


    displayColumns: DisplayColumns[] = [
        { key: "providerName", value: "Provider name" },
        { key: "beneficiaryName", value: "Beneficiary name" },
        { key: "startDate", value: "Start date" },
        { key: "endDate", value: "End date" },
        { key: "currentQrCode", value: "Current QR code" },
    ];


    getAll = (pageing: Paging) => {

        if (pageing.filter) {
            pageing.filter.vehicleId = this.data.id;
        }
        else {
            pageing.filter = {};
            pageing.filter.vehicleId = this.data.id;
        }

        return this.appService.listVehicleOwnershipHistory(new VehicleOwnershipHistoryRequest({
            pageIndex: pageing.pageNum,
            pageSize: pageing.pageSize,
            orderByColumn: pageing.sortProperty,
            isDesc: pageing.sortDirection == "desc" ? true : false,
            vehicleOwnershipHistoryRecord: pageing.filter
        }))
    }

    reactiveForm = () => {
        this.form = this.fb.group({
            providerId: [null],
            beneficiaryId: [null],
            currentQrCode: [''],
        }, { validator: this.atLeastOne(Validators.required) })
    }

    submitForm = () => {
        if (this.form.valid) {
            let ownershipHistory: IVehicleOwnershipHistoryRecord = this.form.value;
            ownershipHistory.id = 0;

            this.filter = ownershipHistory;

            this.ref.detectChanges();
            if (this.appTable.paginator) {
                this.appTable.paginator.firstPage();
            }
            this.appTable.ngAfterViewInit();
        }

    }

    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listProvider(new ProviderRequest()).subscribe(data => {
            this.providers = data.data;
        })

        this.appService.listBeneficiary(new BeneficiaryRequest()).subscribe(data => {
            this.Beneficiaries = data.data;
        })
    }

    cancelSearch = () => {
        this.filter = new VehicleOwnershipHistoryRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }

}
