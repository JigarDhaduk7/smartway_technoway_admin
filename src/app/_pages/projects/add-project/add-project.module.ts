import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProjectRoutingModule } from './add-project-routing.module';
import { AddProjectComponent } from './add-project.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    AddProjectComponent
  ],
  imports: [
    CommonModule,
    AddProjectRoutingModule,
    AngularEditorModule,
    FormsModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    AngularEditorModule
  ]
})
export class AddProjectModule { }
