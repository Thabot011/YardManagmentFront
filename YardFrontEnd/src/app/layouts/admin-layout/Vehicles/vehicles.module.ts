import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { ListComponent } from './list/list.component';
//import { YardManagentComponent } from './yard-managent/yard-managent.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDrawingModule } from '@agm/drawing';
import { ManageVehicleDataComponent } from './manage-vehicle-data/manage-vehicle-data.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [ListComponent, ManageVehicleDataComponent],
    imports: [
        CommonModule,
        VehiclesRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyBDX0CmAA5eWZyn_vQJJI0JMZercy0mw8c",
            libraries: ['drawing']
        }),
        AgmDrawingModule,
        SharedModule
    ],
    entryComponents: [ManageVehicleDataComponent]
})
export class VehiclesModule { }
