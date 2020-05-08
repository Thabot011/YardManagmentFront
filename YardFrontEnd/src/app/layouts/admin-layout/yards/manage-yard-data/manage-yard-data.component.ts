import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Client, CountryRecord, EmirateRecord, EmirateRequest } from '../../../../shared/service/appService';
import { Options } from 'ng5-slider';

@Component({
    selector: 'app-manage-yard-data',
    templateUrl: './manage-yard-data.component.html',
    styleUrls: ['./manage-yard-data.component.css']
})
export class ManageYardDataComponent implements OnInit {
    options: Options = {
        floor: 0,
        ceil: 200
    };

    slider: {
        from: 0,
        to:12
    }

    form: FormGroup;
    visible = true;
    removable = true;

    countries: CountryRecord[];
    emirates: EmirateRecord[];
    points: any[];

    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageYardDataComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private appService: Client) {
    }

    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listCountry().subscribe(data => {
            this.countries = data.data;
        })
    }

    errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    }

    submitForm() {
        if (this.form.valid) {
            console.log(this.form.value)
            this.dialogRef.close(this.form.value);
        }
    }

    reactiveForm() {
        this.form = this.fb.group({
            name: ['', [Validators.required]],
            country: ['', [Validators.required]],
            emirate: ['', [Validators.required]],
            boundaries: [{ value: '', disabled: true }, [Validators.required]],
            area: [{ value: '', disabled: true }, [Validators.required]],
            capacity: ['', [Validators.required]],
            thresholdCapacity: ['', [Validators.required]],
            workingHoursFrom: ['', [Validators.required]],
            workingHoursto: ['', [Validators.required]],
        });
    }

    onChangeCountry(countryId: number) {
        if (countryId) {
            this.appService.listEmirate(new EmirateRequest({
                emirateRecord: {
                    countryId: countryId
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
        this.router.navigate(['/manageMap']);
    }

}
