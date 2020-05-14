import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Client, CountryRecord, EmirateRecord, EmirateRequest, IYardRecord, YardRequest } from '../../../../shared/service/appService';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';
import { DialogResult } from '../../../../shared/Entity/DialogResult';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-manage-yard-data',
    templateUrl: './manage-yard-data.component.html',
    styleUrls: ['./manage-yard-data.component.css']
})
export class ManageYardDataComponent extends BaseManagementClass implements OnInit {


    visible = true;
    removable = true;

    countries: CountryRecord[];
    emirates: EmirateRecord[];
    points: any[];

    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageYardDataComponent, DialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private appService: Client) {
        super();
    }

    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listCountry().subscribe(data => {
            this.countries = data.data;
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
            let yard: IYardRecord = this.form.value;
            if (this.data.id) {
                this.appService.editYard(new YardRequest({
                    yardRecord: yard
                })).subscribe(data => {
                    if (data.success) {
                        yard.countryName = this.countries.find(c => c.id == yard.countryId).name;
                        yard.emirateName = this.emirates.find(e => e.id == yard.emirateId).name;
                        yard.name = yard.nameEn;
                        this.dialogRef.close({
                            data: yard,
                            isSuccess: true,
                            message: "Yard Edited successfully"
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
                yard.id = 0;
                yard.isActive = true;

                this.appService.addYard(new YardRequest({
                    yardRecord: yard
                })).subscribe(data => {
                    if (data.success) {
                        data.data[0].countryName =
                            this.countries.find(c => c.id == data.data[0].countryId).name;
                        data.data[0].emirateName =
                            this.emirates.find(e => e.id == data.data[0].emirateId).name;

                        data.data[0].name = yard.nameEn;
                        this.dialogRef.close({
                            data: data.data[0],
                            isSuccess: data.success,
                            message: "Yard added successfully"
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
            name: ['', [Validators.required]],
            country: ['', [Validators.required]],
            emirate: ['', [Validators.required]],
            boundaries: [{ value: '', disabled: true }, [Validators.required]],
            distance: [{ value: '', disabled: true }, [Validators.required]],
            capacity: ['', [Validators.required]],
            thresholdCapacity: ['', [Validators.required]],
            workingFrom: ['', [Validators.required]],
            workingTo: ['', [Validators.required]],
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


    remove = (point: any) => {
        const index = this.points.indexOf(point);

        if (index >= 0) {
            this.points.splice(index, 1);
        }
    }

    naviagteToMap = () => {
        this.dialogRef.close();
        this.router.navigate(['/manageMap']);
    }

}
