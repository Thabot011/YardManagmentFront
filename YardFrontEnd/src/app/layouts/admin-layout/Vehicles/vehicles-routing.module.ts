import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
//import { YardManagentComponent } from './yard-managent/yard-managent.component';


const routes: Routes = [
    {
        path: "list", component: ListComponent
    }
    // ,
    // {
    //     path: "manageMap", component: YardManagentComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VehiclesRoutingModule { }
