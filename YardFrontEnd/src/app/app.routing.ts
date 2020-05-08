import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/provider/list',
        pathMatch: 'full',
    }, {
        path: '',
        component: AdminLayoutComponent,
        loadChildren: () => import(`./layouts/admin-layout/admin-layout.module`).then(m => m.AdminLayoutModule)
    },
    {
        path: '**',
        redirectTo: '/provider/list'
    }
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
