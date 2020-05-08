import { Component, ViewChild, AfterViewInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Paging } from '../../Entity/Paging';
import { ComponentType } from '@angular/cdk/portal';
import { TooltipPosition } from '@angular/material/tooltip';
import { KeyValue } from '@angular/common';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogResult } from '../../Entity/DialogResult';
import { ProviderResponse } from '../../service/appService';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class TableComponent implements AfterViewInit {

    @Input()
    set inputColumns(columns: KeyValue<string, string>[]) {
        this.displayedColumns = [...columns, { key: "action", value: "Action" }]
            .map(d => d.key);
        this.coulmns = columns;
    }

    @Input() filter: any;
    @Input() getAll: (Paging: Paging) => Observable<any>;

    @Input() changeActivation: (row: any) => Observable<any>;

    @Input() AddOrEditComponent: ComponentType<any>;

    @Input() detailsLink: string;

    @Input() hasDetails: boolean = false;

    @Input() backLink: string;

    @Input() hasBackLink: boolean = false;


    color: ThemePalette = 'warn';
    resultsLength = 0;
    isLoadingResults = true;
    dataSource: Array<any> = new Array<any>();
    displayedColumns: string[];
    coulmns: KeyValue<string, string>[];
    position: TooltipPosition = 'above'
    hasResults: boolean = true;
    parentId: number;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<any>;


    constructor(private dialog: MatDialog, private _snackBar: MatSnackBar,
        private route: ActivatedRoute, private ref: ChangeDetectorRef) {

    }

    ngAfterViewInit() {
        this.hasResults = true;
        this.ref.detectChanges();
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    let sortProperty: string;
                    if (this.sort.active) {
                        sortProperty = this.capitalizeFirstLetter(this.sort.active);
                    }
                    return this.getAll({
                        pageNum: this.paginator.pageIndex, pageSize: this.paginator.pageSize,
                        sortDirection: this.sort.direction,
                        sortProperty: sortProperty,
                        filter: this.filter
                    });
                }),
                map(data => {
                    this.isLoadingResults = false;
                    this.resultsLength = data.totalCount;
                    if (this.resultsLength > 0) {
                        this.hasResults = true;
                    }
                    else {
                        this.hasResults = false;
                    }
                    return data.data;
                }),
                catchError(() => {
                    return observableOf([]);
                })
            ).subscribe(data => this.dataSource = data);

    }





    openAddDialog = () => {

        this.route.paramMap.subscribe(params => {
            this.parentId = parseInt(params.get('id'));
            if (this.parentId) {
                let dialogRef = this.dialog.open(this.AddOrEditComponent, {
                    height: '400px',
                    width: '600px',
                    data: {
                        id: this.parentId
                    }
                });

                dialogRef.afterClosed().subscribe((result: DialogResult) => {
                    if (result.isSuccess) {
                        this.hasResults = true;
                        this.dataSource.push(result.data);
                        this.resultsLength++;
                        this.ref.detectChanges();
                        this.table.renderRows();
                    }
                    this.notify(result.message, "Adding");
                });
            }
            else {
                let dialogRef = this.dialog.open(this.AddOrEditComponent, {
                    height: '400px',
                    width: '600px',
                    data: {}
                });

                dialogRef.afterClosed().subscribe((result: DialogResult) => {
                    if (result.isSuccess) {
                        this.dataSource.push(result.data);
                        this.resultsLength++;
                        this.table.renderRows();
                    }
                    this.notify(result.message, "Adding");
                });
            }
        });



    }




    openEditDialog = (row: any) => {

        let dialogRef = this.dialog.open(this.AddOrEditComponent, {
            height: '400px',
            width: '600px',
            data: row,
        });

        dialogRef.afterClosed().subscribe((result: DialogResult) => {
            if (result.isSuccess) {
                this.dataSource = this.dataSource.filter((value, key) => {
                    if (value.id == result.data.id) {
                        for (var prop in result.data) {
                            value[prop] = result.data[prop];
                        }
                    }
                    return true;
                });
            }
            this.notify(result.message, "Editing");
        });
    }





    changeActivationStatus = (row: any) => {
        this.changeActivation(row).subscribe((result: ProviderResponse) => {
            if (result.success) {
                this.notify("Activation changed successfully", "Change activation");
            }
            else {
                this.notify(result.message, "Change activation");
            }
        });
    }

    notify = (message: string, label: string) => {
        this._snackBar.open(message, label, {
            horizontalPosition: "center",
            verticalPosition: "bottom",
            duration: 2000,
        });
    }

    capitalizeFirstLetter = (propertyName: string) => {
        return propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
    }

}


