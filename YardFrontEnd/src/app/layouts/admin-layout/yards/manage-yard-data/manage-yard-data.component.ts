import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Client, CountryRecord, EmirateRecord, EmirateRequest, IYardRecord, YardRequest, IYardBoundaryRecord, CountryRequest } from '../../../../shared/service/appService';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';
import { IDialogResult } from '../../../../shared/Entity/DialogResult';
import { MatSelectChange } from '@angular/material/select';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatChipList } from '@angular/material/chips';

@Component({
    selector: 'app-manage-yard-data',
    templateUrl: './manage-yard-data.component.html',
    styleUrls: ['./manage-yard-data.component.css']
})
export class ManageYardDataComponent extends BaseManagementClass implements OnInit {

    visible = true;
    removable = true;
    position: TooltipPosition = 'above'
    countries: CountryRecord[];
    emirates: EmirateRecord[];
    points: Array<string> = new Array<string>();
    otherYards: IYardRecord[];
    statusArray: Array<any> = [{ statusId: 1, statusName: "Pending Review" },
    { statusId: 2, statusName: "Approved" }];

    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageYardDataComponent, IDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private appService: Client) {
        super();

    }

    ngOnInit(): void {
        this.reactiveForm();

        this.appService.listCountry(new CountryRequest()).subscribe(data => {
            this.countries = data.data;
        })

        if (this.data.id || this.data.countryId) {
            this.appService.listEmirate(new EmirateRequest({
                emirateRecord: { countryId: this.data.countryId }
            })).subscribe(data => {
                this.emirates = data.data;
            })
        }
        if (this.data.yardBoundaries?.length > 0) {

            this.points.push("Points Selected");
            this.form.patchValue({ yardBoundaries: 'Points Selected' });
        }

    }



    errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    }

    submitForm = () => {
        if (this.form.valid) {
            let yard: IYardRecord = this.form.getRawValue();
            yard.zoom = this.data.zoom;
            yard.yardBoundaries = this.data.yardBoundaries;
            if (this.data.id) {
                yard.isActive = this.data.isActive;
                this.appService.editYard(new YardRequest({
                    yardRecord: yard
                })).subscribe(data => {
                    if (data.success) {
                        yard.countryName = this.countries.find(c => c.id == yard.countryId).name;
                        yard.emirateName = this.emirates.find(e => e.id == yard.emirateId).name;
                        yard.name = yard.nameEn;
                        yard.statusId = 1;
                        yard.statusName = 'Approved'
                        this.dialogRef.close({
                            data: null,
                            isSuccess: true,
                            message: "Yard Edited successfully and pending review"
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
                        data.data[0].statusId = 1;
                        data.data[0].statusName = 'Pending Review';
                        this.dialogRef.close({
                            data: null,
                            isSuccess: data.success,
                            message: "Yard added successfully and pending review"
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
            countryId: [{ value: this.data.countryId, disabled: this.data.onlyView }, [Validators.required]],
            emirateId: [{ value: this.data.emirateId, disabled: this.data.onlyView }, [Validators.required]],
            yardBoundaries: [{ value: this.data.yardBoundaries?.length > 0 ? 'Points Selected' : null, disabled: this.data.onlyView }, [Validators.required]],
            area: [{ value: this.data.area, disabled: true }, [Validators.required]],
            capacity: [{ value: this.data.capacity, disabled: this.data.onlyView }, [Validators.required]],
            thresholdCapacity: [{ value: this.data.thresholdCapacity, disabled: this.data.onlyView }, [Validators.required]],
            workingFrom: [{ value: this.data.workingFrom, disabled: this.data.onlyView }],
            workingTo: [{ value: this.data.workingTo, disabled: this.data.onlyView }],
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
            this.form.patchValue({ emirateId: null })
        }
    }


    remove = (point: any) => {
        const index = this.points.indexOf(point);

        if (index >= 0) {
            this.points.splice(index, 1);
            this.form.patchValue({ yardBoundaries: '', distance: '' });

        }

    }

    naviagteToMap = () => {
        let yard: IYardRecord = this.form.value;
        yard.zoom = this.data.zoom;
        yard.area = this.data.area;
        yard.isActive = this.data.isActive;
        if (this.form.controls.yardBoundaries.value != "") {
            yard.yardBoundaries = this.data.yardBoundaries;
        }
        else {
            yard.yardBoundaries = new Array<IYardBoundaryRecord>();
        }

        this.appService.listYard(new YardRequest()).subscribe(res => {
            this.otherYards = res.data;
            if (yard.id) {
                this.otherYards = this.otherYards.filter((value, key) => {
                    return value.id != yard.id;
                });
            }
            this.otherYards = this.otherYards.filter((value, key) => {
                return value.yardBoundaries?.length > 0;
            });

            this.dialogRef.close();
            this.router.navigate(['manageMap'], {
                state: {
                    data:
                    {
                        yard: yard,
                        otherYards: this.otherYards
                    }
                }
            });
        });


    }

}
