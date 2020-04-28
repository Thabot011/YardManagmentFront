import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YardsRoutingModule } from './yards-routing.module';
import { ListComponent } from './list/list.component';
import { YardManagentComponent } from './yard-managent/yard-managent.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDrawingModule } from '@agm/drawing';
import { ManageYardDataComponent } from './manage-yard-data/manage-yard-data.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [ListComponent, YardManagentComponent, ManageYardDataComponent],
    imports: [
        CommonModule,
        YardsRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyBDX0CmAA5eWZyn_vQJJI0JMZercy0mw8c",
            libraries: ['drawing']
        }),
        AgmDrawingModule,
        SharedModule
    ],
    entryComponents: [ManageYardDataComponent]
})
export class YardsModule { }
