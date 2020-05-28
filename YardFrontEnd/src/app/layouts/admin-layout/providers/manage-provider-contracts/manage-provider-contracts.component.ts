import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogResult } from '../../../../shared/Entity/DialogResult';
import { Client, ProviderContactRecord, IProviderContactRecord, ProviderContactRequest } from '../../../../shared/service/appService';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';

@Component({
    selector: 'app-manage-provider-contracts',
    templateUrl: './manage-provider-contracts.component.html',
    styleUrls: ['./manage-provider-contracts.component.css']
})
export class ManageProviderContractsComponent extends BaseManagementClass implements OnInit {

    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageProviderContractsComponent, IDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appService: Client) {
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
            providerContract.providerId = this.data.parentId;

            if (this.data.id) {
                providerContract.isActive = this.data.isActive;
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
            name: [{ value: this.data.name, disabled: this.data.onlyView }, [Validators.required]],
            email: [{ value: this.data.email, disabled: this.data.onlyView }, [Validators.required, Validators.email]],
            landline: [{ value: this.data.landline, disabled: this.data.onlyView }, []],
            mobile: [{ value: this.data.mobile, disabled: this.data.onlyView }, [Validators.required]],
        })
    }


}
