import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { Client } from '../../../../shared/service/appService';

@Component({
    selector: 'app-manage-yard-data',
    templateUrl: './manage-yard-data.component.html',
    styleUrls: ['./manage-yard-data.component.css']
})
export class ManageYardDataComponent implements OnInit {


    form: FormGroup;
    visible = true;
    removable = true;

    countries: {};
    cities: {};
    points: any[];

    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageYardDataComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private appService: Client) {
    }

    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listProvider().subscribe()
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
            city: ['', [Validators.required]],
            boundaries: [{ value: '', disabled: true }, [Validators.required]],
            area: [{ value: '', disabled: true }, [Validators.required]],
            capacity: ['', [Validators.required]],
            thresholdCapacity: ['', [Validators.required]],
            workingHours: ['', [Validators.required]],
        });
    }

    onChangeCountry(countryId: number) {
        if (countryId) {
            this.appService.listEmirate().subscribe(
                data => {
                    this.cities = data;
                }
            );
        } else {
            this.cities = null;
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
