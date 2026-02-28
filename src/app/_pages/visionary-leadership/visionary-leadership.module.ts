import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VisionaryLeadershipRoutingModule } from './visionary-leadership-routing.module';
import { VisionaryLeadershipComponent } from './visionary-leadership.component';


@NgModule({
  declarations: [
    VisionaryLeadershipComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    VisionaryLeadershipRoutingModule
  ]
})
export class VisionaryLeadershipModule { }
