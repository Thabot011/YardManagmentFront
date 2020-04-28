import { Component, OnInit } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { ComponentType } from '@angular/cdk/portal';
import { ManageProvidersComponent } from '../manage-providers/manage-providers.component';
import { Client, ProviderRequest } from '../../../../shared/service/appService';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    displayColumns: string[] = ["id", "employee_name", "employee_salary", "employee_age"];
    AddOrEditComponent: ComponentType<ManageProvidersComponent> = ManageProvidersComponent;

    constructor(private appService: Client) { }

    getAll = (pageing: Paging) => {
        return this.appService.listProvider(new ProviderRequest({
            pageIndex: pageing.pageNum,
            pageSize: pageing.pageSize,
            orderByColumn: pageing.sortProperty,
            isDesc: pageing.sortDirection == "desc" ? true : false,
        }))
    }

    ngOnInit(): void {

    }

}
