import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogResult } from '../../../../shared/Entity/DialogResult';
import { Client, ProviderContactRecord, IProviderContactRecord, ProviderContactRequest } from '../../../../shared/service/appService';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';

@Component({
    selector: 'app-manage-provider-contracts',
    templateUrl: './manage-provider-contracts.component.html',
    styleUrls: ['./manage-provider-contracts.component.css']
})
export class ManageProviderContractsComponent extends BaseManagementClass implements OnInit {

    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageProviderContractsComponent, DialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: ProviderContactRecord, private appService: Client) {
        super();
    }

    ngOnInit(): void {
        this.reactiveForm();
    }

    errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    }

    submitForm = () => {
        if (this.form.valid) {
            let providerContract: IProviderContactRecord = this.form.value;

            if (this.data.providerId) {
                this.appService.editProviderContact(new ProviderContactRequest({
                    providerContactRecord: providerContract
                })).subscribe(data => {
                    if (data.success) {
                        this.dialogRef.close({
                            data: providerContract,
                            isSuccess: true,
                            message: "Provider contract Edited successfully"
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
            else {
                providerContract.providerId = this.data.id;
                providerContract.id = 0;
                providerContract.isActive = true;

                this.appService.addProviderContact(new ProviderContactRequest({
                    providerContactRecord: providerContract
                })).subscribe(data => {
                    if (data.success) {
                        this.dialogRef.close({
                            data: data.data[0],
                            isSuccess: data.success,
                            message: "Provider contract added successfully"
                        });
                    }
                    else {
                        this.dialogRef.close({
                            data: {},
                            isSuccess: data.success,
                            message: data.message
                        })
                    }
                });
            }
        }
    }

    reactiveForm = () => {
        this.form = this.fb.group({
            id: [this.data.id, []],
            name: [this.data.name, [Validators.required]],
            email: [this.data.email, [Validators.required, Validators.email]],
            landline: [this.data.landline, []],
            mobile: [this.data.mobile, [Validators.required]],
        })
    }


}
