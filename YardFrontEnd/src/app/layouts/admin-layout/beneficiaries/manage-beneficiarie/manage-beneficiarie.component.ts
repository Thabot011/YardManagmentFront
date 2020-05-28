import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client, CountryRequest, BeneficiaryTypeRequest, BeneficiaryTypeRecord, CountryRecord, EmirateRecord, EmirateRequest, IBeneficiaryRecord, BeneficiaryRequest } from '../../../../shared/service/appService';
import { IDialogResult } from '../../../../shared/Entity/DialogResult';
import { MatSelectChange } from '@angular/material/select';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';

@Component({
    selector: 'app-manage-beneficiarie',
    templateUrl: './manage-beneficiarie.component.html',
    styleUrls: ['./manage-beneficiarie.component.css']
})
export class ManageBeneficiarieComponent extends BaseManagementClass implements OnInit {


    BeneficiaryTypes: BeneficiaryTypeRecord[];

    countries: CountryRecord[];
    emirates: EmirateRecord[];


    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageBeneficiarieComponent, IDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appService: Client) {
        super();
    }

    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listCountry(new CountryRequest()).subscribe(data => {
            this.countries = data.data;
        });

        this.appService.listBeneficiaryType(new BeneficiaryTypeRequest()).subscribe(data => {
            this.BeneficiaryTypes = data.data;
        })

        if (this.data.id) {
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
            let Beneficiary: IBeneficiaryRecord = this.form.value;

            if (this.data.id) {
                Beneficiary.isActive = this.data.isActive;

                this.appService.editBeneficiary(new BeneficiaryRequest({
                    beneficiaryRecord: Beneficiary
                })).subscribe(data => {
                    if (data.success) {
                        Beneficiary.countryName = this.countries.find(c => c.id == Beneficiary.countryId).name;
                        Beneficiary.emirateName = this.emirates.find(e => e.id == Beneficiary.emirateId).name;
                        Beneficiary.typeName = this.BeneficiaryTypes.find(p => p.id == Beneficiary.typeId).name;
                        Beneficiary.name = Beneficiary.nameEn;
                        this.dialogRef.close({
                            data: Beneficiary,
                            isSuccess: true,
                            message: "Beneficiary Edited successfully"
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
                Beneficiary.id = 0;
                Beneficiary.isActive = true;

                this.appService.addBeneficiary(new BeneficiaryRequest({
                    beneficiaryRecord: Beneficiary
                })).subscribe(data => {
                    if (data.success) {
                        data.data[0].countryName =
                            this.countries.find(c => c.id == data.data[0].countryId).name;
                        data.data[0].emirateName =
                            this.emirates.find(e => e.id == data.data[0].emirateId).name;
                        data.data[0].typeName =
                            this.BeneficiaryTypes.find(p => p.id == data.data[0].typeId).name;
                        data.data[0].name = Beneficiary.nameEn;
                        this.dialogRef.close({
                            data: data.data[0],
                            isSuccess: data.success,
                            message: "Beneficiary added successfully"
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
            nameEn: [{ value: this.data.nameEn, disabled: this.data.onlyView }, [Validators.required]],
            nameAr: [{ value: this.data.nameAr, disabled: this.data.onlyView }, [Validators.required]],
            typeId: [{ value: this.data.typeId, disabled: this.data.onlyView }, [Validators.required]],
            countryId: [{ value: this.data.countryId, disabled: this.data.onlyView }, [Validators.required]],
            emirateId: [{ value: this.data.emirateId, disabled: this.data.onlyView }, [Validators.required]],
            address: [{ value: this.data.address, disabled: this.data.onlyView }, [Validators.required]],
            email: [{ value: this.data.email, disabled: this.data.onlyView }, [Validators.required, Validators.email]],
            landline: [{ value: this.data.landline, disabled: this.data.onlyView }, []],
            website: [{ value: this.data.website, disabled: this.data.onlyView }, []],
            trn: [{ value: this.data.trn, disabled: this.data.onlyView }, [Validators.required]],
        })
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

}
