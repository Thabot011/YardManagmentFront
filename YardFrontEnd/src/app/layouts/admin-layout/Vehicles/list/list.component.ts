import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { ManageVehicleDataComponent } from '../manage-vehicle-data/manage-vehicle-data.component';
import { ComponentType } from '@angular/cdk/portal';
import { Client, VehicleRequest, VehicleRecord, ProviderRequest, ProviderRecord, BeneficiaryRecord, BeneficiaryRequest, VehicleTypeRecord, VehicleTypeRequest, VehicleStatusRecord, VehicleStatusRequest, VehicleDataStatusRecord, VehicleDataStatusRequest, VehicleResponse, ImageRecord } from '../../../../shared/service/appService';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';
import { DisplayColumns } from 'app/shared/Entity/displayColumns';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap'
import { VehicleMergedRecord, VehicleMergedResponse } from 'app/shared/Entity/VehicleMergedRecord';
import { MatOption } from '@angular/material/core';
import { OwnershipHistoryComponent } from '../ownership-history/ownership-history.component';
import { ActionsHistoryComponent } from '../actions-history/actions-history.component';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: [DatePipe]
})
export class ListComponent extends BaseListClass implements OnInit {

    displayColumns: DisplayColumns[] = [
        { key: "assetId", value: "AssetId" },
        { key: "QRCodes", value: "QR Code" },
        // { key: "yardInDateStr", value: "yard In Date" },  
        { key: "statusName", value: "Status" },
        { key: "dataStatusName", value: "DataStatus" },
        { key: "vehicleData", value: "Make/Model" },
        { key: "vin", value: "Vin" },
        { key: "vehicleTypeName", value: "Vehicle Type" },
        { key: "platesData", value: "plates" },
        { key: "vehicleImages", value: "Images" }

    ];


    providers: ProviderRecord[];
    beneficiaries: BeneficiaryRecord[];
    vehicleTypes: VehicleTypeRecord[];
    vehicleStatus: VehicleStatusRecord[];
    vehiclesDataStatus: VehicleDataStatusRecord[];
    plateItem: string;
    imageItem: string;
    qrCode: string;
    imagesData: string[];
    AddOrEditComponent: ComponentType<ManageVehicleDataComponent> = ManageVehicleDataComponent;
    ListPopupComponent: ComponentType<OwnershipHistoryComponent> = OwnershipHistoryComponent;
    ActionsPopupListComponent: ComponentType<ActionsHistoryComponent> = ActionsHistoryComponent;
    detailsLink: string = "vehicle/list";
    imagesList: string[];
    @ViewChild('beneficiaryAllSelected') private beneficiaryAllSelected: MatOption;
    @ViewChild('dataStatusAllSelected') private dataStatusAllSelected: MatOption;
    @ViewChild('statusAllSelected') private statusAllSelected: MatOption;
    @ViewChild('providerAllSelected') private providerAllSelected: MatOption;
    @ViewChild('vehicleTypeAllSelected') private vehicleTypeAllSelected: MatOption;
    checkDataStatus: boolean;

    constructor(private appService: Client, private fb: FormBuilder,
        private ref: ChangeDetectorRef,
        public datepipe: DatePipe) {
        super();

    }


    getAll = (pageing: Paging) => {
        return new Observable(subscriber => {
            this.appService.listVehicle(new VehicleRequest({
                pageIndex: pageing.pageNum,
                pageSize: pageing.pageSize,
                orderByColumn: "YardInDate",
                isDesc: pageing.sortDirection == "desc" ? true : false,
                vehicleRecord: pageing.filter
            })
            ).subscribe(res => {
                debugger;
                let vehicleMergedRecords: Array<VehicleMergedRecord> = new Array<VehicleMergedRecord>();

                for (let i = 0; i < res.data.length; i++) {
                    let index = res.data[i];

                    let vehicleMergedRecord: VehicleMergedRecord = new VehicleMergedRecord();
                    if (index.dataStatusName == "Pending Data Completion" && index.dataStatusId == 1) {
                        vehicleMergedRecord.checkEditOrComplete = true;
                    }
                    else { vehicleMergedRecord.checkEditOrComplete = false; }
                    vehicleMergedRecord.platesData = [];
                    vehicleMergedRecord.imagesData = [];
                    vehicleMergedRecord.QRCodes = [];
                    vehicleMergedRecord.id = index.id;
                    vehicleMergedRecord.statusId = index.statusId;
                    vehicleMergedRecord.dataStatusId = index.dataStatusId;
                    vehicleMergedRecord.makeId = index.makeId;
                    vehicleMergedRecord.makeName = index.makeName;
                    vehicleMergedRecord.modelId = index.modelId;
                    vehicleMergedRecord.modelName = index.modelName;
                    vehicleMergedRecord.year = index.year;
                    vehicleMergedRecord.providerId = index.providerId;
                    vehicleMergedRecord.providerName = index.providerName;
                    vehicleMergedRecord.ownershipStartDate = index.ownershipStartDate;
                    vehicleMergedRecord.beneficiaryId = index.beneficiaryId;
                    vehicleMergedRecord.beneficiaryName = index.beneficiaryName;
                    vehicleMergedRecord.emirateId = index.plates[0]?.emirateId;
                    vehicleMergedRecord.emirateName = index.plates[0]?.emirateName;
                    vehicleMergedRecord.plateCodeId = index.plates[0]?.plateCodeId;
                    vehicleMergedRecord.code = index.plates[0]?.code;
                    vehicleMergedRecord.plateTypeId = index.plates[0]?.plateTypeId;
                    vehicleMergedRecord.plateTypeName = index.plates[0]?.plateTypeName;
                    vehicleMergedRecord.number = index.plates[0]?.number;
                    vehicleMergedRecord.currentQrCode = index.currentQrCode;


                    vehicleMergedRecord.vin = index.vin;
                    vehicleMergedRecord.vehicleTypeName = index.vehicleTypeName;
                    let dateString = (this.datepipe.transform(index.yardInDate, 'yyyy/MM/dd'));
                    vehicleMergedRecord.yardInDateStr = dateString;
                    vehicleMergedRecord.statusName = index.statusName;
                    vehicleMergedRecord.dataStatusName = index.dataStatusName;
                    //vehicleMergedRecord.statusName = ((index.statusName)?index.statusName : " ").concat(((index.dataStatusName)? ' / '+ index.dataStatusName : " "));
                    vehicleMergedRecord.assetId = ((index.id) ? index.id : 0);
                    vehicleMergedRecord.vehicleData = ((index.makeName) ? index.makeName : "") + ' ' + ((index.modelName) ? index.modelName : "") + ' ' + ((index.year) ? index.year : "");

                    for (let j = 0; j < index.plates.length; j++) {
                        this.plateItem = ((index.plates[j]?.code) ? index.plates[j]?.code : "")
                            + ' - ' + ((index.plates[j]?.emirateName) ? index.plates[j]?.emirateName : "")
                            + ' - ' + ((index.plates[j]?.number) ? index.plates[j]?.number : "")
                            + ' - ' + ((index.plates[j]?.plateTypeName) ? index.plates[j]?.plateTypeName : "");
                        vehicleMergedRecord.platesData.push(this.plateItem);
                    }

                    vehicleMergedRecord.vehicleImages = ((index.images[0]?.imageUrl) ? index.images[0]?.imageUrl : "");

                    for (let k = 0; k < index.images.length; k++) {
                        let imageRecord: ImageRecord = new ImageRecord();
                        this.imageItem = ((index.images[k]?.imageUrl) ? index.images[k]?.imageUrl : "");
                        imageRecord.imageUrl = this.imageItem;
                        vehicleMergedRecord.imagesData.push(imageRecord);
                    }
                    for (let m = 0; m < index.qrCodes.length; m++) {
                        this.qrCode = ((index.qrCodes[m]?.qrCode) ? index.qrCodes[m]?.qrCode : "");
                        vehicleMergedRecord.QRCodes.push(this.qrCode);
                    }
                    vehicleMergedRecords.push(vehicleMergedRecord);
                }
                let vehicleMergedResponse: VehicleMergedResponse = new VehicleMergedResponse();
                vehicleMergedResponse.data = vehicleMergedRecords;
                vehicleMergedResponse.success = res.success;
                vehicleMergedResponse.totalCount = res.totalCount;
                vehicleMergedResponse.message = res.message;
                return subscriber.next(vehicleMergedResponse);
            })
        })

    }

    reactiveForm = () => {
        this.form = this.fb.group({
            beneficiaryIdsFilter: [''],
            providerIdsFilter: [''],
            vehicleTypeIdsFilter: [''],
            statusIdsFilter: [''],
            dataStatusIdsFilter: [''],
            plateNumberFilter: '',
            idStrFilter: '',
            qrCodeFilter: '',
            vin: '',

        }, { validator: this.atLeastOne(Validators.required) })
    }

    ngOnInit(): void {
        this.reactiveForm();

        this.appService.listProvider(new ProviderRequest()).subscribe(data => {
            this.providers = data.data;
        });

        this.appService.listBeneficiary(new BeneficiaryRequest()).subscribe(data => {
            this.beneficiaries = data.data;
        });

        this.appService.listVehicleType(new VehicleTypeRequest()).subscribe(data => {
            this.vehicleTypes = data.data;
        });

        this.appService.listVehicleStatus(new VehicleStatusRequest()).subscribe(data => {
            this.vehicleStatus = data.data;
        });

        this.appService.listVehicleDataStatus(new VehicleDataStatusRequest()).subscribe(data => {
            this.vehiclesDataStatus = data.data;
        });

    }

    submitForm = () => {
        if (this.form.valid) {
            let vehicle: VehicleMergedRecord = this.form.value;
            vehicle.id = 0;
            this.filter = vehicle;
            this.ref.detectChanges();
            this.appTable.ngAfterViewInit();
        }

    }

    changeActivation: (row: any) => import("rxjs").Observable<any>;



    cancelSearch = () => {
        this.filter = new VehicleRecord();
        this.form.reset();
        this.ref.detectChanges();
        this.appTable.ngAfterViewInit();
    }

    toggleAllSelection(filterControl) {
        if (filterControl == this.form.controls.statusIdsFilter) {
            if (this.statusAllSelected.selected) {
                this.form.controls.statusIdsFilter
                    .patchValue([...this.vehicleStatus.map(item => item.id), -1]);
            } else {
                this.form.controls.statusIdsFilter.patchValue([]);
            }
        }
        else if (filterControl == this.form.controls.dataStatusIdsFilter) {
            if (this.dataStatusAllSelected.selected) {
                this.form.controls.dataStatusIdsFilter
                    .patchValue([...this.vehiclesDataStatus.map(item => item.id), -1]);
            } else {
                this.form.controls.dataStatusIdsFilter.patchValue([]);
            }
        }
        else if (filterControl == this.form.controls.providerIdsFilter) {
            if (this.providerAllSelected.selected) {
                this.form.controls.providerIdsFilter
                    .patchValue([...this.providers.map(item => item.id), -1]);
            } else {
                this.form.controls.providerIdsFilter.patchValue([]);
            }
        }
        else if (filterControl == this.form.controls.vehicleTypeIdsFilter) {
            if (this.vehicleTypeAllSelected.selected) {
                this.form.controls.vehicleTypeIdsFilter
                    .patchValue([...this.vehicleTypes.map(item => item.id), -1]);
            } else {
                this.form.controls.vehicleTypeIdsFilter.patchValue([]);
            }
        }
        else {
            if (this.beneficiaryAllSelected.selected) {
                this.form.controls.beneficiaryIdsFilter
                    .patchValue([...this.beneficiaries.map(item => item.id), -1]);
            } else {
                this.form.controls.beneficiaryIdsFilter.patchValue([]);
            }
        }
    }


}
