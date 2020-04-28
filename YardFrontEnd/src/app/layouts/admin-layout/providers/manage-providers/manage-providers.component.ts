import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client, CountryRequest, CountryRecord, EmirateRequest, EmirateRecord } from '../../../../shared/service/appService';

@Component({
    selector: 'app-manage-providers',
    templateUrl: './manage-providers.component.html',
    styleUrls: ['./manage-providers.component.css']
})
export class ManageProvidersComponent implements OnInit {

    form: FormGroup;
    providerTypes = [{ name: 'Bank', value: 1 },
    { name: 'Individual', value: 2 },
    { name: 'Customer', value: 3 },
    { name: 'Gov Entity', value: 4 }
    ]

    countries: {};
    cities: {};


    constructor(private fb: FormBuilder, 
        private dialogRef: MatDialogRef<ManageProvidersComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appService: Client) {
    }

    ngOnInit(): void {
        this.reactiveForm();
        this.appService.listCountry().subscribe();
    }

    errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    }

    submitForm() {
        if (this.form.valid) {

            this.dialogRef.close(this.form.value);
        }
    }

    reactiveForm() {
        this.form = this.fb.group({
            arabicName: ['', [Validators.required]],
            englishName: ['', [Validators.required]],
            providerType: ['', [Validators.required]],
            country: ['', [Validators.required]],
            city: ['', [Validators.required]],
            address: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            landlineNumber: ['', []],
            mobile: ['', [Validators.required]],
            website: ['', []],
            TRN: ['', [Validators.required]],
        })
    }

    onChangeCountry(countryId: number) {
        if (countryId) {
            this.appService.listEmirate(new EmirateRequest({
                emirateRecord: new EmirateRecord( { countryId: countryId })
            })).subscribe(
                data => {
                    this.cities = data;
                }
            );
        } else {
            this.cities = null;
        }
    }

}
