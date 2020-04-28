import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Paging } from '../../Entity/Paging';
import { ComponentType } from '@angular/cdk/portal';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit {


    @Input()
    set inputColumns(columns: string[]) {
        this.displayedColumns = [...columns, "action"];
        this.coulmns = columns;
    }

    @Input() getAll: (Paging: Paging) => Observable<any>;
    @Input() AddOrEditComponent: ComponentType<any>;


    color: ThemePalette = 'warn';
    resultsLength = 0;
    isLoadingResults = true;
    checked = false;
    data: any[] = [];
    displayedColumns: string[];
    coulmns: string[];
    position: TooltipPosition = 'above'

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private dialog: MatDialog) {

    }

    ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.getData({
            pageNum: 1, pageSize: 20,
            sortDirection: this.sort.direction, sortProperty: this.sort.active
        })
    }


    getData = (pageing: Paging) => {
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.getAll(pageing);
                }),
                map(data => {
                    this.isLoadingResults = false;
                    this.resultsLength = 24;

                    return data.data;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    return observableOf([]);
                })
            ).subscribe(data => this.data = data);
    }


    openAddDialog = () => {
        let dialogRef = this.dialog.open(this.AddOrEditComponent, {
            height: '400px',
            width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
            this.data.push(result);
        });
    }

    openEditDialog = (row: any) => {
        let dialogRef = this.dialog.open(this.AddOrEditComponent, {
            height: '400px',
            width: '600px',
            data: row,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.data.push(result);
        });
    }

    

    changeActivation = () => {

    }
}


