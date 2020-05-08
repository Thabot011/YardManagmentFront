import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client, ProviderContactRequest, ProviderContactRecord, ProviderRecord, IProviderContactRecord } from '../../../../shared/service/appService';
import { ComponentType } from '@angular/cdk/portal';
import { ManageProviderContractsComponent } from '../manage-provider-contracts/manage-provider-contracts.component';
import { KeyValue } from '@angular/common';
import { Paging } from '../../../../shared/Entity/Paging';
import { TooltipPosition } from '@angular/material/tooltip';
import { TableComponent } from '../../../../shared/component/table/table.component';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-contacts-list',
    templateUrl: './contacts-list.component.html',
    styleUrls: ['./contacts-list.component.css']
})
export class ContactsListComponent implements OnInit {
    @ViewChild(TableComponent) appTable: TableComponent;

    parentId: number;
    parentName: string;
    form: FormGroup;

    filter: IProviderContactRecord;


    constructor(private route: ActivatedRoute, private appService: Client,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar, private ref: ChangeDetectorRef) {
        this.route.paramMap.subscribe(params => {
            this.parentId = parseInt(params.get('id'));
            this.parentName = params.get('name');
        });
    }
    position: TooltipPosition = 'above'

    displayColumns: KeyValue<string, string>[] = [
        { key: "name", value: "Name" },
        { key: "email", value: "Email" },
        { key: "mobile", value: "Mobile" },
        { key: "landline", value: "Landline" },
    ];
    AddOrEditComponent: ComponentType<ManageProviderContractsComponent>
        = ManageProviderContractsComponent;

    reactiveForm() {
        this.form = this.fb.group({
            name: [''],
            email: [''],
            mobile: [''],
            landline: [''],
        }, { validator: atLeastOne(Validators.required) })
    }


    ngOnInit(): void {
        this.reactiveForm();
    }

    submitForm() {
        if (this.form.valid) {
            let providerContact: IProviderContactRecord = this.form.value;
            providerContact.id = 0;
            providerContact.providerId = this.parentId;
            this.filter = providerContact;
            this.ref.detectChanges();
            this.appTable.ngAfterViewInit();
        }

    }

    cancelSearch = () => {
        this.filter = new ProviderContactRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }

    getAll = (paging: Paging) => {
        if (paging.filter) {
            paging.filter.providerId = this.parentId;
        }
        else {
            paging.filter = {};
            paging.filter.providerId = this.parentId;
        }
        return this.appService.listProviderContact(new ProviderContactRequest({
            pageIndex: paging.pageNum,
            pageSize: paging.pageSize,
            orderByColumn: paging.sortProperty,
            isDesc: paging.sortDirection == "desc" ? true : false,
            providerContactRecord: paging.filter
        }));
    }

    changeActivation = (row: ProviderContactRecord) => {
        if (row.isActive) {
            return this.appService.deActivateProviderContact(new ProviderContactRequest({
                providerContactRecord: row
            }));
        }
        else {
            return this.appService.activateProviderContact(new ProviderContactRequest({
                providerContactRecord: row
            }));
        }
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
