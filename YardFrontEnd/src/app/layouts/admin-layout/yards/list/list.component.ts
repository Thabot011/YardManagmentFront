import { Component, OnInit } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { HttpClient } from '@angular/common/http';
import { ManageYardDataComponent } from '../manage-yard-data/manage-yard-data.component';
import { ComponentType } from '@angular/cdk/portal';
import { Client } from '../../../../shared/service/appService';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    displayColumns: string[] = ["id", "employee_name", "employee_salary", "employee_age"];
    AddOrEditComponent: ComponentType<ManageYardDataComponent> = ManageYardDataComponent;

    constructor(private appService: Client) { }

    getAll = (pageing: Paging) => {
        return this.appService.listProvider()
    }

    ngOnInit(): void {

    }



}
