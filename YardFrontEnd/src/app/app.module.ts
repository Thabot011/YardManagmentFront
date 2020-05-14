import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        NavbarModule,
        FooterModule,
        SidebarModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })

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

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}