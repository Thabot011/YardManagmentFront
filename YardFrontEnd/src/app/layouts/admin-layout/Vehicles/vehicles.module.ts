import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { ListComponent } from './list/list.component';
import { ManageVehicleDataComponent } from './manage-vehicle-data/manage-vehicle-data.component';
import { SharedModule } from '../../../shared/shared.module';
import { ChangeOwnershipComponent } from './change-ownership/change-ownership.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OwnershipHistoryComponent } from './ownership-history/ownership-history.component';
import { ActionsHistoryComponent } from './actions-history/actions-history.component';


@NgModule({
    declarations: [ListComponent, ManageVehicleDataComponent, ChangeOwnershipComponent, OwnershipHistoryComponent, ActionsHistoryComponent],
    imports: [
        CommonModule,
        VehiclesRoutingModule,
        MatDatepickerModule,
        SharedModule,
        MatNativeDateModule
    ],
    providers: [MatDatepickerModule],
    entryComponents: [ManageVehicleDataComponent, ChangeOwnershipComponent, OwnershipHistoryComponent, ActionsHistoryComponent]
})
export class VehiclesModule { }
