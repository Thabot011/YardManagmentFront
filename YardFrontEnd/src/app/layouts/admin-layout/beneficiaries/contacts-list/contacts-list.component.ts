import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client, BeneficiaryContactRequest, BeneficiaryContactRecord, IBeneficiaryContactRecord } from '../../../../shared/service/appService';
import { TooltipPosition } from '@angular/material/tooltip';
import { KeyValue } from '@angular/common';
import { ManageBeneficiarieContactsComponent } from '../manage-beneficiarie-contacts/manage-beneficiarie-contacts.component';
import { ComponentType } from '@angular/cdk/portal';
import { Paging } from '../../../../shared/Entity/Paging';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableComponent } from '../../../../shared/component/table/table.component';

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

    filter: IBeneficiaryContactRecord;
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
    AddOrEditComponent: ComponentType<ManageBeneficiarieContactsComponent>
        = ManageBeneficiarieContactsComponent;

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
            let beneficiaryContact: IBeneficiaryContactRecord = this.form.value;
            beneficiaryContact.id = 0;
            beneficiaryContact.beneficiaryId = this.parentId;
            this.filter = beneficiaryContact;
            this.ref.detectChanges();
            this.appTable.ngAfterViewInit();


        }

    }

    cancelSearch = () => {
        this.filter = new BeneficiaryContactRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }


    getAll = (paging: Paging) => {
        if (paging.filter) {
            paging.filter.beneficiaryId = this.parentId;
        }
        else {
            paging.filter = {};
            paging.filter.beneficiaryId = this.parentId;
        }
        return this.appService.listBeneficiaryContact(new BeneficiaryContactRequest({
            pageIndex: paging.pageNum,
            pageSize: paging.pageSize,
            orderByColumn: paging.sortProperty,
            isDesc: paging.sortDirection == "desc" ? true : false,
            beneficiaryContactRecord: paging.filter
        }));
    }

    changeActivation = (row: BeneficiaryContactRecord) => {
        if (row.isActive) {
            return this.appService.deActivateBeneficiaryContact(new BeneficiaryContactRequest({
                beneficiaryContactRecord: row
            }));
        }
        else {
            return this.appService.activateBeneficiaryContact(new BeneficiaryContactRequest({
                beneficiaryContactRecord: row
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
