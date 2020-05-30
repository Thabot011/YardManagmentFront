import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Client, CountryRecord, EmirateRecord, EmirateRequest, IVehicleRecord, VehicleRequest, ProviderRecord, ProviderRequest, MakeRequest, MakeRecord, ModelRequest, ModelRecord, CountryRequest, PlateTypeRequest, PlateTypeRecord, BeneficiaryRequest, BeneficiaryRecord, VehicleStatusRequest, VehicleDataStatusRequest, VehicleStatusRecord, VehicleDataStatusRecord } from '../../../../shared/service/appService';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';
import { IDialogResult } from '../../../../shared/Entity/DialogResult';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-manage-vehicle-data',
    templateUrl: './manage-vehicle-data.component.html',
    styleUrls: ['./manage-vehicle-data.component.css']
})
export class ManageVehicleDataComponent extends BaseManagementClass implements OnInit {


    visible = true;
    removable = true;

    vehicleStatus: VehicleStatusRecord[];
    vehiclesDataStatus: VehicleDataStatusRecord[];
    makes: MakeRecord[];
    providers: ProviderRecord[];
    models: ModelRecord[];
    countries: CountryRecord[];
    emirates: EmirateRecord[];
    plateTypes: PlateTypeRecord[];
    beneficiaries: BeneficiaryRecord[];

    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageVehicleDataComponent, IDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private appService: Client) {
        super();
    }

    ngOnInit(): void {
        debugger;
        this.reactiveForm();
      
        if (this.data.id) {
            this.appService.listVehicleStatus(new VehicleStatusRequest()).subscribe(data => {
                this.vehicleStatus = data.data;
            });
    
            this.appService.listVehicleDataStatus(new VehicleDataStatusRequest()).subscribe(data => {
                this.vehiclesDataStatus = data.data;
            });
            this.appService.listProvider(new ProviderRequest()).subscribe(data => {
                this.providers = data.data;
            });

            this.appService.listMake(new MakeRequest()).subscribe(data => {
                this.makes = data.data;
            });

            this.appService.listModel(new ModelRequest({
                modelRecord: { makeId: this.data.makeId }})).subscribe(data => {
                this.models = data.data;
            });

            this.appService.listPlateType(new PlateTypeRequest()).subscribe(data => {
                this.plateTypes = data.data;
            });

            this.appService.listBeneficiary(new BeneficiaryRequest()).subscribe(data => {
                this.beneficiaries = data.data;
            });

            this.appService.listCountry(new CountryRequest()).subscribe(data => {
                this.countries = data.data;
            });
            
            this.appService.listEmirate(new EmirateRequest({
                emirateRecord: { countryId: this.data.countryId }
            })).subscribe(data => {
                this.emirates = data.data;
            })
        }
    }

    errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    }

    submitForm = () => {
        if (this.form.valid) {
            let vehicle: IVehicleRecord = this.form.value;
            if (this.data.id) {
                this.appService.editVehicle(new VehicleRequest({
                    vehicleRecord: vehicle
                })).subscribe(data => {
                    if (data.success) {

                        this.dialogRef.close({
                            data: vehicle,
                            isSuccess: true,
                            message: "Vehicle Edited successfully"
                        });
                    }
                    else {
                        this.dialogRef.close({
                            data: {},
                            isSuccess: data.success,
                            message: data.message
                        });
                    }
                });
            }
        }
    }

    reactiveForm = () => {
        this.form = this.fb.group({
            id: [this.data.id, []],
            vin: [{ value: this.data.vin, disabled: this.data.onlyView }, [Validators.required]],
            providerId: [this.data.providerId, [Validators.required]],
            beneficiaryId: [this.data.beneficiaryId, [Validators.required]],
            year: [this.data.year, [Validators.required]],
            makeId: [this.data.makeId, [Validators.required]],
            modelId: [this.data.modelId, [Validators.required]],
            countryId: [this.data.countryId, [Validators.required]],
            emirateId: [this.data.emirateId, [Validators.required]],
            number: [this.data.number, [Validators.required]],
            code: [this.data.code, [Validators.required]],
            plateTypeId: [this.data.plateTypeId, [Validators.required]],
            currentQrCode: [this.data.currentQrCode, [Validators.required]],
            dataStatusId: [this.data.dataStatusId, [Validators.required]],
            statusId: [this.data.statusId, [Validators.required]],
        });
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
        }
    }



   

}
