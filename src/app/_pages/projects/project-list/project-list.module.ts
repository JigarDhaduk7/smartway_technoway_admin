import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectListRoutingModule } from './project-list-routing.module';
import { ProjectListComponent } from './project-list.component';

import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    ProjectListComponent
  ],
  imports: [
    CommonModule,
    ProjectListRoutingModule,
    FormsModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class ProjectListModule { }