import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { ManageYardDataComponent } from '../manage-yard-data/manage-yard-data.component';
import { ComponentType } from '@angular/cdk/portal';
import { Client, IYardRecord, YardRequest, YardRecord, CountryRecord, EmirateRecord, CountryRequest, EmirateRequest, IYardBoundaryRecord } from '../../../../shared/service/appService';
import { KeyValue } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { pairwise, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DisplayColumns } from '../../../../shared/Entity/displayColumns';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent extends BaseListClass implements OnInit {
    yard: IYardRecord;
    displayColumns: DisplayColumns[] = [
        { key: "name", value: "Name" },
        { key: "capacity", value: "Capacity" },
        { key: "countryName", value: "Country name" },
        { key: "emirateName", value: "Emirate name" },
        { key: "statusName", value: "Status name" }
    ];
    subscription: Subscription;
    countries: CountryRecord[];
    emirates: EmirateRecord[];
    detailsLink: string = "yard/employee";
    zoneLink: string = "yard/zoneList";
    detailsLinkName: string = "View yard employees";

    AddOrEditComponent: ComponentType<ManageYardDataComponent> = ManageYardDataComponent;
    browserRefresh: boolean;

    constructor(private appService: Client, private fb: FormBuilder,
        private ref: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
        router: Router) {
        super();


        this.subscription = router.events
            .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
            .subscribe(event => {
                if (
                    event.id === 1 &&
                    event.url === event.urlAfterRedirects
                ) {

                    this.yard = null;
                }
            });

        if (history.state.data?.yard) {
            this.yard = history.state.data?.yard || localStorage.getItem("yard");
            localStorage.setItem("yard", JSON.stringify(this.yard))
        }
    }



    getAll = (pageing: Paging) => {
        if (pageing.filter) {
            pageing.filter.statusId = 2;
        }
        else {
            pageing.filter = {};
            pageing.filter.statusId = 2;
        }


        pageing.filter.statusId = 2;
        return this.appService.listYard(new YardRequest({
            pageIndex: pageing.pageNum,
            pageSize: pageing.pageSize,
            orderByColumn: pageing.sortProperty,
            isDesc: pageing.sortDirection == "desc" ? true : false,
            yardRecord: pageing.filter
        }))
    }

    reactiveForm = () => {
        this.form = this.fb.group({
            name: [''],
            countryId: [undefined],
            emirateId: [undefined],
            capacity: [undefined],
            area: [undefined],
            thresholdCapacity: [undefined],
            workingFrom: [undefined],
            workingTo: [undefined],
            isActive: [undefined],
        }, { validator: this.atLeastOne(Validators.required) })
    }

    ngAfterViewInit() {

        if (this.yard) {
            if (this.yard.id) {
                this.appTable.openEditDialog(this.yard)
            }
            if (!this.yard.id) {
                this.appTable.openAddDialogAfterNavigate(this.yard);
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        localStorage.clear();
    }


    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listCountry(new CountryRequest()).subscribe(data => {
            this.countries = data.data;
        });


    }

    submitForm = () => {
        if (this.form.valid) {
            let yard: IYardRecord = this.form.value;
            for (var key in yard) {
                if (!yard[key]) {
                    yard[key] = undefined;
                }
            }
            yard.id = 0;
            yard.isActive = this.form.controls.isActive.value;
            this.filter = yard;
            this.ref.detectChanges();
            if (this.appTable.paginator) {
                this.appTable.paginator.firstPage();
            }
            this.appTable.ngAfterViewInit();
        }

    }

    changeActivation = (row: YardRecord) => {
        if (row.isActive) {
            return this.appService.deActivateYard(new YardRequest({
                yardRecord: row
            }));
        }
        else {
            return this.appService.activateYard(new YardRequest({
                yardRecord: row
            }));
        }
    }


    onChangeCountry(e: MatSelectChange) {
        if (e.value) {
            this.appService.listEmirate(new EmirateRequest({
                emirateRecord: {
                    countryId: e.value
                }
            })).subscribe(
                data => {
                    this.emirates = data.data;
                }
            );
        } else {
            this.emirates = null;
            this.form.patchValue({ emirateId: null })
        }
    }

    cancelSearch = () => {
        this.filter = new YardRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }


}
