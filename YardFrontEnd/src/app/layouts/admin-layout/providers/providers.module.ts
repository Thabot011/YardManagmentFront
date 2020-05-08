import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../../../shared/shared.module';
import { ManageProvidersComponent } from './manage-providers/manage-providers.component';
import { ManageProviderContractsComponent } from './manage-provider-contracts/manage-provider-contracts.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';


@NgModule({
    declarations: [ListComponent, ManageProvidersComponent, ManageProviderContractsComponent, ContactsListComponent],
    imports: [
        CommonModule,
        ProvidersRoutingModule,
        SharedModule
    ],
    entryComponents: [ManageProvidersComponent, ManageProviderContractsComponent]
})
export class ProvidersModule { }
