import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiariesRoutingModule } from './beneficiaries-routing.module';
import { ListComponent } from './list/list.component';
import { ManageBeneficiarieComponent } from './manage-beneficiarie/manage-beneficiarie.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
    declarations: [ListComponent, ManageBeneficiarieComponent],
    imports: [
        CommonModule,
        BeneficiariesRoutingModule,
        SharedModule
    ],
    entryComponents: [ManageBeneficiarieComponent]
})
export class BeneficiariesModule { }
