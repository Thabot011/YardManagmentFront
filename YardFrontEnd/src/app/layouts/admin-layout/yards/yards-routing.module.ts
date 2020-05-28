import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { YardManagentComponent } from './yard-managent/yard-managent.component';
import { YardEmployeesComponent } from './yard-employees/yard-employees.component';
import { ListUpdatedComponent } from './list-updated/list-updated.component';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { PendingYardsComponent } from './pending-yards/pending-yards.component';
import { PendingUpdatedYardsComponent } from './pending-updated-yards/pending-updated-yards.component';


const routes: Routes = [


    {
        path: "list", component: ListComponent
    },
    {
        path: "listToupdate", component: ListUpdatedComponent
    },
    {
        path: "listPending", component: PendingYardsComponent
    },
    {
        path: "listToupdatePending", component: PendingUpdatedYardsComponent
    },
    {
        path: "manageMap", component: YardManagentComponent
    },
    {
        path: "employee/:id/:name", component: YardEmployeesComponent
    },
    {
        path: "zoneList/:id/:name", component: ZoneListComponent
    },
    {
        path: "zoneList", component: ZoneListComponent
    },



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YardsRoutingModule { }
