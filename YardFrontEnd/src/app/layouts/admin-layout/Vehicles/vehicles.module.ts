import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { ListComponent } from './list/list.component';
import { ManageVehicleDataComponent } from './manage-vehicle-data/manage-vehicle-data.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [ListComponent, ManageVehicleDataComponent],
    imports: [
        CommonModule,
        VehiclesRoutingModule,
        SharedModule
    ],
    entryComponents: [ManageVehicleDataComponent]
})
export class VehiclesModule { }
