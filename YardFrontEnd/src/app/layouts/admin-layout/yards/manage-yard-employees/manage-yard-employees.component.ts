import { Component, OnInit, Inject } from '@angular/core';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogResult } from '../../../../shared/Entity/DialogResult';
import { YardEmployeeRecord, Client, IYardEmployeeRecord, YardEmployeeRequest } from '../../../../shared/service/appService';

@Component({
    selector: 'app-manage-yard-employees',
    templateUrl: './manage-yard-employees.component.html',
    styleUrls: ['./manage-yard-employees.component.css']
})
export class ManageYardEmployeesComponent extends BaseManagementClass implements OnInit {

    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageYardEmployeesComponent, IDialogResult>,
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
            let yardEmployee: IYardEmployeeRecord = this.form.value;
            yardEmployee.yardId = this.data.parentId;
            if (this.data.id) {
                yardEmployee.isActive = this.data.isActive;
                this.appService.editYardEmployee(new YardEmployeeRequest({
                    yardEmployeeRecord: yardEmployee
                })).subscribe(data => {
                    if (data.success) {
                        this.dialogRef.close({
                            data: yardEmployee,
                            isSuccess: true,
                            message: "Yard employee Edited successfully"
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
                yardEmployee.id = 0;
                yardEmployee.isActive = true;

                this.appService.addYardEmployee(new YardEmployeeRequest({
                    yardEmployeeRecord: yardEmployee
                })).subscribe(data => {
                    if (data.success) {
                        this.dialogRef.close({
                            data: data.data[0],
                            isSuccess: data.success,
                            message: "Yard employee added successfully"
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
            position: [{ value: this.data.position, disabled: this.data.onlyView }, [Validators.required]]
        })
    }


}
