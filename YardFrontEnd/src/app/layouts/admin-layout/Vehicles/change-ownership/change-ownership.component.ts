import { Component, OnInit, Inject } from '@angular/core';
import { ProviderRecord, BeneficiaryRecord, Client, IVehicleRecord, VehicleRequest, ProviderRequest, BeneficiaryRequest, VehicleOwnershipHistoryRequest } from '../../../../shared/service/appService';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogResult } from '../../../../shared/Entity/DialogResult';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-change-ownership',
    templateUrl: './change-ownership.component.html',
    styleUrls: ['./change-ownership.component.css'],
    providers: [DatePipe]
})
export class ChangeOwnershipComponent extends BaseManagementClass implements OnInit {
    providers: ProviderRecord[];
    Beneficiaries: BeneficiaryRecord[];
    minDate: Date = new Date();
    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ChangeOwnershipComponent, IDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private appService: Client, private datepipe: DatePipe) {
        super();
    }

    ngOnInit(): void {
        this.reactiveForm();

        this.appService.listProvider(new ProviderRequest()).subscribe(data => {
            this.providers = data.data;
        });

        this.appService.listBeneficiary(new BeneficiaryRequest()).subscribe(data => {
            this.Beneficiaries = data.data;
        });
    }

    errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    }

    submitForm = () => {
        if (this.form.valid) {
            let vehicle: IVehicleRecord = this.form.value;
            this.appService.changeVehicleOwnership(new VehicleRequest({
                vehicleRecord: vehicle
            })).subscribe(data => {
                if (data.success) {
                    this.dialogRef.close({
                        data: vehicle,
                        isSuccess: true,
                        message: "Vehicle ownership chnaged successfully"
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

    reactiveForm = () => {
        this.form = this.fb.group({
            id: [this.data.id, []],
            providerId: [null, [Validators.required]],
            beneficiaryId: [null, [Validators.required]],
            currentQrCode: ['', [Validators.required]],
            ownershipStartDate: [null, [Validators.required]],
        });
    }

}
