import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';
import { KeyValue } from '@angular/common';
import { ComponentType } from '@angular/cdk/portal';
import { Client, IZoneRecord, IYardRecord, ZoneRequest, ZoneRecord } from '../../../../shared/service/appService';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ManageZoneDataComponent } from '../manage-zone-data/manage-zone-data.component';
import { Paging } from '../../../../shared/Entity/Paging';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DisplayColumns } from '../../../../shared/Entity/displayColumns';

@Component({
    selector: 'app-zone-list',
    templateUrl: './zone-list.component.html',
    styleUrls: ['./zone-list.component.css']
})
export class ZoneListComponent extends BaseListClass implements OnInit {

    zone: IZoneRecord;
    subscription: Subscription;
    parentId: number;
    parentName: string;
    displayColumns: DisplayColumns[] = [
        { key: "title", value: "Title" },
        { key: "capacity", value: "Capacity" },
    ];




    AddOrEditComponent: ComponentType<ManageZoneDataComponent> = ManageZoneDataComponent;

    constructor(private appService: Client, private fb: FormBuilder,
        private ref: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
        router: Router) {
        super();
        if (history.state.data?.zone) {
            this.zone = history.state.data?.zone;
            localStorage.setItem("zone", JSON.stringify(this.zone));
        }
        else if (JSON.parse(localStorage.getItem("zone"))) {
            this.zone = JSON.parse(localStorage.getItem("zone"));
        }

        this.subscription = router.events
            .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
            .subscribe(event => {
                if (
                    event.id === 1 &&
                    event.url === event.urlAfterRedirects
                ) {

                    this.zone = null;
                }
            });

        

    }



    getAll = (paging: Paging) => {
        if (paging.filter) {
            paging.filter.yardId = this.parentId;
        }
        else {
            paging.filter = {};
            paging.filter.yardId = this.parentId;
        }
        return this.appService.listZone(new ZoneRequest({
            pageIndex: paging.pageNum,
            pageSize: paging.pageSize,
            orderByColumn: paging.sortProperty,
            isDesc: paging.sortDirection == "desc" ? true : false,
            zoneRecord: paging.filter
        }))
    }

    reactiveForm = () => {
        this.form = this.fb.group({
            title: [''],
            capacity: [undefined],
        }, { validator: this.atLeastOne(Validators.required) })
    }

    ngAfterViewInit() {
        if (this.zone) {
            if (this.zone.id) {
                this.appTable.openEditDialog(this.zone)
            }
            if (!this.zone.id) {
                this.appTable.openAddDialogAfterNavigate(this.zone);
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        localStorage.clear();
    }

    ngOnInit(): void {
        this.reactiveForm();
        if (history.state.data?.id && history.state.data?.name) {
            localStorage.setItem("id", history.state.data.id);
            localStorage.setItem("name", history.state.data.name);
        }
        this.activatedRoute.paramMap.subscribe(params => {
            this.parentId = parseInt(params.get('id')) || history.state.data?.id || localStorage.getItem("id");
            this.parentName = params.get('name') || history.state.data?.name || localStorage.getItem("name");
        });
    }

    submitForm = () => {
        if (this.form.valid) {
            let zone: IZoneRecord = this.form.value;
            zone.id = 0;
            zone.yardId = this.parentId;
            this.filter = zone;
            this.ref.detectChanges();
            if (this.appTable.paginator) {
                this.appTable.paginator.firstPage();
            }
            this.appTable.ngAfterViewInit();
        }

    }

    changeActivation = (row: ZoneRecord) => {
        if (row.isActive) {
            return this.appService.deActivateZone(new ZoneRequest({
                zoneRecord: row
            }));
        }
        else {
            return this.appService.activateZone(new ZoneRequest({
                zoneRecord: row
            }));
        }
    }

    cancelSearch = () => {
        this.filter = new ZoneRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }

}
