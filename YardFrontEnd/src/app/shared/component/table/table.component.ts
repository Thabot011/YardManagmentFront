import { Component, ViewChild, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';
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
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogResult } from '../../Entity/DialogResult';
import { ProviderResponse } from '../../service/appService';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { DisplayColumns } from 'app/shared/Entity/displayColumns';
import { ImagesDialog } from '../ImageDialog/image.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
   
})
export class TableComponent implements AfterViewInit {

    @Input()
    set inputColumns(columns: DisplayColumns[]) {
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
    @Input() VehicleDetails: boolean = false;
   // @Input() CompleteVehicle: boolean = false;
    //@Input() checkDataStatus: boolean = false;
    

    @Input() backLink: string;

    @Input() hasBackLink: boolean = false;
    @Input() hasAddLink: boolean = true;
    @Input() hasActiveStatus: boolean = true;
    @Input() viewResultsSize: number ;

    color: ThemePalette = 'warn';
    resultsLength = 0;
    isLoadingResults = true;
    dataSource: Array<any> = new Array<any>();
    displayedColumns: string[];
    coulmns: DisplayColumns[];
    position: TooltipPosition = 'above'
    hasResults: boolean = true;
    parentId: number;
    _mergedColumns:DisplayColumns[];
    mergedColumnsColumnKey:string;
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
                    height: '70%',
                    width: '70%',
                    data: {
                        id: this.parentId
                    }
                });

                dialogRef.afterClosed().subscribe((result: DialogResult) => {
                    if (result?.isSuccess) {
                        this.hasResults = true;
                        this.dataSource.push(result.data);
                        this.resultsLength++;
                        this.ref.detectChanges();
                        this.table.renderRows();
                        this.notify(result.message, "Adding");
                    }
                });
            }
            else {
                let dialogRef = this.dialog.open(this.AddOrEditComponent, {
                    height: '400px',
                    width: '600px',
                    data: {}
                });

                dialogRef.afterClosed().subscribe((result: DialogResult) => {
                    if (result?.isSuccess) {
                        this.dataSource.push(result.data);
                        this.resultsLength++;
                        this.table.renderRows();
                        this.notify(result.message, "Adding");
                    }
                });
            }
        });



    }




    openEditDialog = (row: any) => {
        let dialogRef = this.dialog.open(this.AddOrEditComponent, {
            data: row,
            autoFocus: true,
            maxWidth: '100%',
            maxHeight: '100%',
            height: '100%',
            width: '100%'
        });

        dialogRef.afterClosed().subscribe((result: DialogResult) => {
            if (result?.isSuccess) {
                this.dataSource = this.dataSource.filter((value, key) => {
                    if (value.id == result.data.id) {
                        for (var prop in result.data) {
                            value[prop] = result.data[prop];
                        }
                    }
                    return true;
                });
                this.notify(result.message, "Editing");
            }
        });
    }


    openImagesDialog= (row: any) => {
        debugger;
    const dialogRef = this.dialog.open(ImagesDialog, {
        data: row.imagesData,
        autoFocus: true,
        maxWidth: '100%',
        maxHeight: '100%',
        height: '90%',
        width: '70%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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


