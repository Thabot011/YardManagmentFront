import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../../../shared/shared.module';
import { ManageProvidersComponent } from './manage-providers/manage-providers.component';


@NgModule({
  declarations: [ListComponent, ManageProvidersComponent],
  imports: [
    CommonModule,
      ProvidersRoutingModule,
      SharedModule
    ],
    entryComponents: [ManageProvidersComponent]
})
export class ProvidersModule { }
