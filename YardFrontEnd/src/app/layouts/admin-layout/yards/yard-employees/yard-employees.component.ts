import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';
import { KeyValue } from '@angular/common';
import { ManageYardEmployeesComponent } from '../manage-yard-employees/manage-yard-employees.component';
import { ComponentType } from '@angular/cdk/portal';
import { Paging } from '../../../../shared/Entity/Paging';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Client, YardEmployeeRequest, YardEmployeeRecord, IYardEmployeeRecord } from '../../../../shared/service/appService';

@Component({
    selector: 'app-yard-employees',
    templateUrl: './yard-employees.component.html',
    styleUrls: ['./yard-employees.component.css']
})
export class YardEmployeesComponent extends BaseListClass implements OnInit {

    parentId: number;
    parentName: string;
    constructor(private route: ActivatedRoute, private appService: Client,
        private fb: FormBuilder,
        private ref: ChangeDetectorRef) {
        super();
        this.route.paramMap.subscribe(params => {
            this.parentId = parseInt(params.get('id'));
            this.parentName = params.get('name');
        });
    }

    displayColumns: KeyValue<string, string>[] = [
        { key: "name", value: "Name" },
        { key: "email", value: "Email" },
        { key: "mobile", value: "Mobile" },
        { key: "landline", value: "Landline" },
        { key: "position", value: "Position" }
    ];
    AddOrEditComponent: ComponentType<ManageYardEmployeesComponent>
        = ManageYardEmployeesComponent;

    reactiveForm = () => {
        this.form = this.fb.group({
            name: [''],
            email: [''],
            mobile: [''],
            landline: [undefined],
            isActive: [undefined],
            position: ['']
        }, { validator: this.atLeastOne(Validators.required) })
    }


    ngOnInit(): void {
        this.reactiveForm();
    }

    submitForm = () => {
        if (this.form.valid) {
            let yardEmployee: IYardEmployeeRecord = this.form.value;
            yardEmployee.id = 0;
            yardEmployee.yardId = this.parentId;
            this.filter = yardEmployee;
            this.ref.detectChanges();
            if (this.appTable.paginator) {
                this.appTable.paginator.firstPage();
            }
            this.appTable.ngAfterViewInit();
        }

    }

    cancelSearch = () => {
        this.filter = new YardEmployeeRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }

    getAll = (paging: Paging) => {
        if (paging.filter) {
            paging.filter.yardId = this.parentId;
        }
        else {
            paging.filter = {};
            paging.filter.yardId = this.parentId;
        }
        return this.appService.listYardEmployee(new YardEmployeeRequest({
            pageIndex: paging.pageNum,
            pageSize: paging.pageSize,
            orderByColumn: paging.sortProperty,
            isDesc: paging.sortDirection == "desc" ? true : false,
            yardEmployeeRecord: paging.filter
        }));
    }

    changeActivation = (row: YardEmployeeRecord) => {
        if (row.isActive) {
            return this.appService.deActivateYardEmployee(new YardEmployeeRequest({
                yardEmployeeRecord: row
            }));
        }
        else {
            return this.appService.activateYardEmployee(new YardEmployeeRequest({
                yardEmployeeRecord: row
            }));
        }
    }

}
