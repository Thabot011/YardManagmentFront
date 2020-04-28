import { Component, OnInit } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { ManageBeneficiarieComponent } from '../manage-beneficiarie/manage-beneficiarie.component';
import { ComponentType } from '@angular/cdk/portal';
import { Client } from '../../../../shared/service/appService';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    displayColumns: string[] = ["id", "employee_name", "employee_salary", "employee_age"];
    AddOrEditComponent: ComponentType<ManageBeneficiarieComponent> = ManageBeneficiarieComponent;

    constructor(private appService: Client) { }

    getAll = (pageing: Paging) => {
        return this.appService.listUser();
    }

    ngOnInit(): void {

    }

}
