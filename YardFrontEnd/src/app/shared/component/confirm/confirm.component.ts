import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogResult } from '../../Entity/DialogResult';
import { IConfirmInput } from '../../Entity/ConfirmInput';
import { Confirm } from '../../enum/Confirm';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
    confirm = Confirm;
    constructor(private dialogRef: MatDialogRef<ConfirmComponent, IDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: IConfirmInput) {

    }

    closePopup = (message: Confirm) => {
        this.dialogRef.close({ data: { message: message }, isSuccess: true, message: "" })
    }

    ngOnInit(): void {
    }

}
