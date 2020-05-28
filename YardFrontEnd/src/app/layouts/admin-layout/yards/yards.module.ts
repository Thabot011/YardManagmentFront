import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YardsRoutingModule } from './yards-routing.module';
import { ListComponent } from './list/list.component';
import { YardManagentComponent } from './yard-managent/yard-managent.component';
import { ManageYardDataComponent } from './manage-yard-data/manage-yard-data.component';
import { SharedModule } from '../../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { YardEmployeesComponent } from './yard-employees/yard-employees.component';
import { ManageYardEmployeesComponent } from './manage-yard-employees/manage-yard-employees.component';
import { ListUpdatedComponent } from './list-updated/list-updated.component';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { ManageZoneDataComponent } from './manage-zone-data/manage-zone-data.component';
import { PendingYardsComponent } from './pending-yards/pending-yards.component';
import { PendingUpdatedYardsComponent } from './pending-updated-yards/pending-updated-yards.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';


@NgModule({
    declarations: [ListComponent, YardManagentComponent, ManageYardDataComponent, YardEmployeesComponent, ManageYardEmployeesComponent, ListUpdatedComponent, ZoneListComponent, ManageZoneDataComponent, PendingYardsComponent, PendingUpdatedYardsComponent],
    imports: [
        CommonModule,
        YardsRoutingModule,
        SharedModule,
        AngularMultiSelectModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBUtZjrs_fplvEWPYljDM2e_yDwEWMpaTM',
            libraries: ['drawing']
        })
    ],
    entryComponents: [ManageYardDataComponent, ManageYardEmployeesComponent, ManageZoneDataComponent]
})
export class YardsModule { }
