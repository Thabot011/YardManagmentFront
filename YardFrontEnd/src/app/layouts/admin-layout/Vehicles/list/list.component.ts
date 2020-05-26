import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Paging } from '../../../../shared/Entity/Paging';
import { ManageVehicleDataComponent } from '../manage-vehicle-data/manage-vehicle-data.component';
import { ComponentType } from '@angular/cdk/portal';
import { Client, VehicleRequest, VehicleRecord, ProviderRequest, ProviderRecord, BeneficiaryRecord, BeneficiaryRequest, VehicleTypeRecord,VehicleTypeRequest, VehicleStatusRecord , VehicleStatusRequest, VehicleDataStatusRecord, VehicleDataStatusRequest, VehicleResponse, ImageRecord} from '../../../../shared/service/appService';
import {  DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseListClass } from '../../../../shared/class/base/base-list-class';
import { DisplayColumns } from 'app/shared/Entity/displayColumns';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap'
import { VehicleMergedRecord, VehicleMergedResponse } from 'app/shared/Entity/VehicleMergedRecord';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: [DatePipe]
})
export class ListComponent extends BaseListClass implements OnInit {
 
    displayColumns:DisplayColumns[] = [
        { key: "assetId", value: "Asset Id"},
        { key: "QRCodes", value: "qr Code" },
       // { key: "yardInDateStr", value: "yard In Date" },  
        { key: "statusName", value: "status" },
        { key:"vehicleData",value:"Make/Model"},
        { key: "vin", value: "vin"},
        { key: "vehicleTypeName", value: "vehicle Type" },
        { key: "platesData", value: "plates"},
        { key: "vehicleImages", value: "Images"}
        // { key: "providerName", value: "provider" }, 
        //{ key: "beneficiaryName", value: "beneficiary" },
     

    ];


    providers: ProviderRecord[];
    beneficiaries: BeneficiaryRecord[];
    vehicleTypes: VehicleTypeRecord[];
    vehicleStatus: VehicleStatusRecord[];
    vehiclesDataStatus: VehicleDataStatusRecord[];
    plateItem: string;
    imageItem: string;
    qrCode: string;
    imagesData:string[];
    AddOrEditComponent: ComponentType<ManageVehicleDataComponent> = ManageVehicleDataComponent;
    detailsLink: string = "vehicle/list";
    imagesList:string[];
    constructor(private appService: Client, private fb: FormBuilder,
        private ref: ChangeDetectorRef,
        public datepipe: DatePipe) {
        super();
    }


     

    getAll = (pageing: Paging) => {  
      return new Observable(subscriber=>
        { this.appService.listVehicle(new VehicleRequest({
        pageIndex: pageing.pageNum,
        pageSize: pageing.pageSize,
        orderByColumn: "YardInDate",
        isDesc: pageing.sortDirection == "desc" ? true : false,
        vehicleRecord: pageing.filter
    })
).subscribe(res => {
        let vehicleMergedRecords:Array<VehicleMergedRecord> = new Array<VehicleMergedRecord>();

        for (let i = 0; i < res.data.length; i++) { 
        
        let index = res.data[i]; 
        
        let vehicleMergedRecord:VehicleMergedRecord = new VehicleMergedRecord();  
        vehicleMergedRecord.platesData = [];
        vehicleMergedRecord.imagesData= [];
        vehicleMergedRecord.QRCodes= [];
        vehicleMergedRecord.vin = index.vin;
        vehicleMergedRecord.vehicleTypeName = index.vehicleTypeName;
        let dateString = (this.datepipe.transform(index.yardInDate, 'yyyy/MM/dd'));
        vehicleMergedRecord.yardInDateStr = dateString;
        vehicleMergedRecord.statusName = ((index.statusName)?index.statusName: "").concat(((index.dataStatusName)? ' / '+ index.dataStatusName: ""));
        vehicleMergedRecord.assetId =  ((index.plates[0]?.id)? index.plates[0]?.id:0);
        vehicleMergedRecord.vehicleData = ((index.makeName)? index.makeName: "")+' '+((index.modelName)? index.modelName: "")+' '+((index.year)? index.year: "");
        
        for (let j = 0; j < index.plates.length; j++) {              
        this.plateItem =  ((index.plates[j]?.code)? index.plates[j]?.code:"") 
         +' - '+ ((index.plates[j]?.emirateName)? index.plates[j]?.emirateName:"") 
         +' - '+ ((index.plates[j]?.number)? index.plates[j]?.number:"")
         +' - '+ ((index.plates[j]?.plateTypeName)? index.plates[j]?.plateTypeName:""); 
         vehicleMergedRecord.platesData.push(this.plateItem);
        }
                    
        vehicleMergedRecord.vehicleImages = ((index.images[0]?.imageUrl)? index.images[0]?.imageUrl:"");

        for (let k = 0; k < index.images.length; k++) {  
            let imageRecord: ImageRecord = new ImageRecord();
            this.imageItem = ((index.images[k]?.imageUrl)? index.images[k]?.imageUrl:"");
            imageRecord.imageUrl= this.imageItem;
            vehicleMergedRecord.imagesData.push(imageRecord);
         }
        for (let m = 0; m < index.qrCodes.length; m++) {               
            this.qrCode = ((index.qrCodes[m]?.qrCode)? index.qrCodes[m]?.qrCode:"");
            vehicleMergedRecord.QRCodes.push(this.qrCode);
           }
           vehicleMergedRecords.push(vehicleMergedRecord);
    }
    let vehicleMergedResponse:VehicleMergedResponse = new VehicleMergedResponse();
    vehicleMergedResponse.data = vehicleMergedRecords;
    vehicleMergedResponse.success = res.success;
    vehicleMergedResponse.totalCount = res.totalCount;
    vehicleMergedResponse.message = res.message;
    return subscriber.next(vehicleMergedResponse);
 })})
         
        
               
      
      
       
        
    }

    reactiveForm = () => {
        this.form = this.fb.group({
            beneficiaryIdsFilter: [''],
            providerIdsFilter: [''],
            vehicleTypeIdsFilter: [''],
            statusIdsFilter: [''],
            dataStatusId: [''],
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
}
