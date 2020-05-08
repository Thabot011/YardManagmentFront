import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogResult } from '../../../../shared/Entity/DialogResult';
import { Client, BeneficiaryContactRecord, IBeneficiaryContactRecord, BeneficiaryContactRequest } from '../../../../shared/service/appService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-manage-beneficiarie-contacts',
    templateUrl: './manage-beneficiarie-contacts.component.html',
    styleUrls: ['./manage-beneficiarie-contacts.component.css']
})
export class ManageBeneficiarieContactsComponent implements OnInit {

    form: FormGroup;



    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageBeneficiarieContactsComponent, DialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: BeneficiaryContactRecord, private appService: Client) {
    }

    ngOnInit(): void {
        this.reactiveForm();
    }

    errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    }

    submitForm() {
        if (this.form.valid) {
            let beneficiaryContract: IBeneficiaryContactRecord = this.form.value;

            if (this.data.beneficiaryId) {
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
                beneficiaryContract.beneficiaryId = this.data.id;
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

    reactiveForm() {
        this.form = this.fb.group({
            id: [this.data.id, []],
            name: [this.data.name, [Validators.required]],
            email: [this.data.email, [Validators.required, Validators.email]],
            landline: [this.data.landline, []],
            mobile: [this.data.mobile, [Validators.required]],
        })
    }

}
