import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiariesRoutingModule } from './beneficiaries-routing.module';
import { ListComponent } from './list/list.component';
import { ManageBeneficiarieComponent } from './manage-beneficiarie/manage-beneficiarie.component';
import { SharedModule } from '../../../shared/shared.module';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ManageBeneficiarieContactsComponent } from './manage-beneficiarie-contacts/manage-beneficiarie-contacts.component';


@NgModule({
    declarations: [ListComponent, ManageBeneficiarieComponent, ContactsListComponent, ManageBeneficiarieContactsComponent],
    imports: [
        CommonModule,
        BeneficiariesRoutingModule,
        SharedModule
    ],
    entryComponents: [ManageBeneficiarieComponent, ManageBeneficiarieContactsComponent]
})
export class BeneficiariesModule { }
