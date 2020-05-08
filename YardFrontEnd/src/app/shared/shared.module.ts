import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './component/table/table.component'
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';

import { Ng5SliderModule } from 'ng5-slider';


import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './component/loader/loader.component';
import { RouterModule } from '@angular/router';





@NgModule({
    declarations: [TableComponent, LoaderComponent],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSortModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatChipsModule,
        MatSnackBarModule,
        MatExpansionModule,
        Ng5SliderModule,
    ],
    exports: [
        ReactiveFormsModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatPaginatorModule,
        MatDialogModule,
        TableComponent,
        MatSortModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatChipsModule,
        MatSnackBarModule,
        MatExpansionModule,
        Ng5SliderModule
    ]
})
export class SharedModule { }
