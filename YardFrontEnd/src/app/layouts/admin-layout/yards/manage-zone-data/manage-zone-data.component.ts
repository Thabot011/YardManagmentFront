import { Component, OnInit, Inject } from '@angular/core';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';
import { IZoneRecord, CountryRecord, EmirateRecord, Client, CountryRequest, EmirateRequest, ZoneRequest, ProviderRecord, BeneficiaryRecord, ProviderRequest, BeneficiaryRequest, IZoneBoundaryRecord, IYardRecord, YardRequest } from '../../../../shared/service/appService';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogResult } from '../../../../shared/Entity/DialogResult';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-manage-zone-data',
    templateUrl: './manage-zone-data.component.html',
    styleUrls: ['./manage-zone-data.component.css']
})
export class ManageZoneDataComponent extends BaseManagementClass implements OnInit {
    yard: IYardRecord
    visible = true;
    removable = true;
    position: TooltipPosition = 'above'
    providers: ProviderRecord[];
    providersDropdown = [];
    Beneficiaries: BeneficiaryRecord[];
    BeneficiariesDropdown = [];
    points: Array<string> = new Array<string>();
    dropdownSettings = {};
    otherZones: IZoneRecord[];
    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageZoneDataComponent, IDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private appService: Client) {
        super();
        this.appService.listYard(new YardRequest({
            yardRecord: {
                id: data.parentId ? data.parentId : this.data.yardId,
                yardId: data.parentId ? data.parentId : this.data.yardId

            }
        })).subscribe(res => {
            this.yard = res.data[0];
        })
    }

    ngOnInit(): void {
        this.reactiveForm();

        this.dropdownSettings = {
            singleSelection: false,
            text: "Please Select",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class",
            lazyLoading: true,
            disabled: this.data.onlyView
        };

        this.appService.listProvider(new ProviderRequest()).subscribe(data => {
            this.providers = data.data;
            this.providersDropdown = this.providers.map(p => ({
                id: p.id,
                itemName: p.name
            }));
        })

        this.appService.listBeneficiary(new BeneficiaryRequest()).subscribe(data => {
            this.Beneficiaries = data.data;
            this.BeneficiariesDropdown = this.Beneficiaries.map(p => ({
                id: p.id,
                itemName: p.name
            }));
        })


        if (this.data.zoneBoundaries?.length > 0) {

            this.points.push("Points Selected");
            this.form.patchValue({ zoneBoundaries: 'Points Selected' });
        }

        if (this.data.zoneProviders?.length > 0) {
            this.form.patchValue({
                zoneProviders: this.data.zoneProviders.map(p => ({
                    id: p.providerId,
                    itemName: p.providerName
                }))
            });
        }

        if (this.data.zoneBeneficiarys?.length > 0) {
            this.form.patchValue({
                zoneBeneficiarys: this.data.zoneBeneficiarys.map(p => ({
                    id: p.beneficiaryId,
                    itemName: p.beneficiaryName
                }))
            });
        }


    }


    errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    }

    submitForm = () => {
        if (this.form.valid) {
            let zone: IZoneRecord = this.form.value;
            zone.yardId = this.data.yardId;
            zone.zoneBoundaries = this.data.zoneBoundaries;
            zone.zoneProviders = this.form.controls.zoneProviders.value.map(p => ({
                providerId: p.id,
                providerName: p.itemName
            }));

            zone.zoneBeneficiarys = this.form.controls.zoneBeneficiarys.value.map(p => ({
                beneficiaryId: p.id,
                beneficiaryName: p.itemName
            }));


            if (this.data.id) {
                zone.isActive = this.data.isActive;

                this.appService.editZone(new ZoneRequest({
                    zoneRecord: zone
                })).subscribe(data => {
                    if (data.success) {
                        this.dialogRef.close({
                            data: zone,
                            isSuccess: true,
                            message: "Zone Edited successfully"
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
                zone.id = 0;
                zone.isActive = true;

                this.appService.addZone(new ZoneRequest({
                    zoneRecord: zone
                })).subscribe(data => {
                    if (data.success) {

                        this.dialogRef.close({
                            data: data.data[0],
                            isSuccess: data.success,
                            message: "Zone added successfully"
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
            title: [{ value: this.data.title, disabled: this.data.onlyView }, [Validators.required]],
            zoneBoundaries: [{ value: this.data.zoneBoundaries?.length > 0 ? 'Points Selected' : null, disabled: this.data.onlyView }, [Validators.required]],
            capacity: [{ value: this.data.capacity, disabled: this.data.onlyView }, [Validators.required]],
            zoneProviders: [this.data.zoneProviders?.map(p => ({
                id: p.providerId,
                itemName: p.providerName
            })), []],
            zoneBeneficiarys: [this.data.zoneBeneficiarys?.map(p => ({
                id: p.beneficiaryId,
                itemName: p.beneficiaryName
            })), []],

        });
    }





    remove = (point: any) => {
        const index = this.points.indexOf(point);

        if (index >= 0) {
            this.points.splice(index, 1);
            this.form.patchValue({ yardBoundaries: '', distance: '' });

        }

    }

    naviagteToMap = () => {

        let zone: IZoneRecord = this.form.value;
        zone.yardId = this.yard.id;
        zone.isActive = this.data.isActive;

        zone.zoneProviders = this.form.controls.zoneProviders.value?.map(p => ({
            providerId: p.id,
            providerName: p.itemName
        }));

        zone.zoneBeneficiarys = this.form.controls.zoneBeneficiarys.value?.map(p => ({
            beneficiaryId: p.id,
            beneficiaryName: p.itemName
        }));

        if (this.form.controls.zoneBoundaries.value != "") {
            zone.zoneBoundaries = this.data.zoneBoundaries;
        }
        else {
            zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
        }

        this.appService.listZone(new ZoneRequest({
            zoneRecord: {
                yardId: this.yard.id
            }
        })).subscribe(res => {

            this.otherZones = res.data;
            if (zone.id) {
                this.otherZones = this.otherZones.filter((value, key) => {
                    return value.id != zone.id;
                });
            }

            this.dialogRef.close();
            this.router.navigate(['manageMap'], {
                state: {
                    data:
                    {
                        yard: this.yard,
                        zone: zone,
                        otherZones: this.otherZones
                    }
                }
            });
        });
    }

}
