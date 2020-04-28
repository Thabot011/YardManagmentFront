import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { UserComponent } from '../../user/user.component';
import { TablesComponent } from '../../tables/tables.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: HomeComponent },
    { path: 'user', component: UserComponent },
    { path: 'table', component: TablesComponent },
    { path: 'typography', component: TypographyComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'upgrade', component: UpgradeComponent },
    {
        path: 'provider', loadChildren:
            () => import('./providers/providers.module').then(m => m.ProvidersModule)
    },
    {
        path: 'beneficiarie', loadChildren:
            () => import('./beneficiaries/beneficiaries.module').then(m => m.BeneficiariesModule)
    },
    {
        path: 'yard', loadChildren:
            () => import('./yards/yards.module').then(m => m.YardsModule)
    }
];
