import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';


const routes: Routes = [
    {
        path: "list",
        component: ListComponent
    },
    {
        path: "contactsList/:id/:name",
        component: ContactsListComponent
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BeneficiariesRoutingModule { }
