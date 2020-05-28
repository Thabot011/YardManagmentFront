import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IDialogResult } from '../../../../shared/Entity/DialogResult';
import { Client, BeneficiaryContactRecord, IBeneficiaryContactRecord, BeneficiaryContactRequest } from '../../../../shared/service/appService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';

@Component({
    selector: 'app-manage-beneficiarie-contacts',
    templateUrl: './manage-beneficiarie-contacts.component.html',
    styleUrls: ['./manage-beneficiarie-contacts.component.css']
})
export class ManageBeneficiarieContactsComponent extends BaseManagementClass implements OnInit {


    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageBeneficiarieContactsComponent, IDialogResult>,
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
            let beneficiaryContract: IBeneficiaryContactRecord = this.form.value;
            beneficiaryContract.beneficiaryId = this.data.parentId;
            if (this.data.id) {
                beneficiaryContract.isActive = this.data.isActive;
                this.appService.editBeneficiaryContact(new BeneficiaryContactRequest({
                    beneficiaryContactRecord: beneficiaryContract
                })).subscribe(data => {
                    if (data.success) {
                        this.dialogRef.close({
                            data: beneficiaryContract,
                            isSuccess: true,
                            message: "Beneficiary contract Edited successfully"
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

                beneficiaryContract.id = 0;
                beneficiaryContract.isActive = true;

                this.appService.addBeneficiaryContact(new BeneficiaryContactRequest({
                    beneficiaryContactRecord: beneficiaryContract
                })).subscribe(data => {
                    if (data.success) {
                        this.dialogRef.close({
                            data: data.data[0],
                            isSuccess: data.success,
                            message: "Beneficiary contract added successfully"
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
