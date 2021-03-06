import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client, CountryRequest, CountryRecord, EmirateRequest, EmirateRecord, ProviderTypeRecord, ProviderRecord, ProviderTypeRequest, ProviderRequest, IProviderRecord } from '../../../../shared/service/appService';
import { MatSelectChange } from '@angular/material/select';
import { IDialogResult } from '../../../../shared/Entity/DialogResult';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';

@Component({
    selector: 'app-manage-providers',
    templateUrl: './manage-providers.component.html',
    styleUrls: ['./manage-providers.component.css']
})
export class ManageProvidersComponent extends BaseManagementClass implements OnInit {

    providerTypes: ProviderTypeRecord[];

    countries: CountryRecord[];
    emirates: EmirateRecord[];


    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageProvidersComponent, IDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appService: Client) {
        super();
    }

    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listCountry(new CountryRequest()).subscribe(data => {
            this.countries = data.data;
        });

        this.appService.listProviderType(new ProviderTypeRequest()).subscribe(data => {
            this.providerTypes = data.data;
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
            let provider: IProviderRecord = this.form.value;

            if (this.data.id) {
                provider.isActive = this.data.isActive;

                this.appService.editProvider(new ProviderRequest({
                    providerRecord: provider
                })).subscribe(data => {
                    if (data.success) {
                        provider.countryName = this.countries.find(c => c.id == provider.countryId).name;
                        provider.emirateName = this.emirates.find(e => e.id == provider.emirateId).name;
                        provider.typeName = this.providerTypes.find(p => p.id == provider.typeId).name;
                        provider.name = provider.nameEn;
                        this.dialogRef.close({
                            data: provider,
                            isSuccess: true,
                            message: "Provider Edited successfully"
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
                provider.id = 0;
                provider.isActive = true;

                this.appService.addProvider(new ProviderRequest({
                    providerRecord: provider
                })).subscribe(data => {
                    if (data.success) {
                        data.data[0].countryName =
                            this.countries.find(c => c.id == data.data[0].countryId).name;
                        data.data[0].emirateName =
                            this.emirates.find(e => e.id == data.data[0].emirateId).name;
                        data.data[0].typeName =
                            this.providerTypes.find(p => p.id == data.data[0].typeId).name;
                        data.data[0].name = provider.nameEn;
                        this.dialogRef.close({
                            data: data.data[0],
                            isSuccess: data.success,
                            message: "Provider added successfully"
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
            mobile: [{ value: this.data.mobile, disabled: this.data.onlyView }, [Validators.required]],
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
