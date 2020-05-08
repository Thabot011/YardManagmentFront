import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { API_BASE_URL } from './shared/service/appService';
import { environment } from '../environments/environment';
import { LoaderService } from './shared/service/loader.service';
import { LoaderInterceptor } from './shared/interceptor/loader.interceptor';


@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        NavbarModule,
        FooterModule,
        SidebarModule,
        AppRoutingModule

    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
    ],
    providers: [{ provide: API_BASE_URL, useValue: environment.apiUrl },
        LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
