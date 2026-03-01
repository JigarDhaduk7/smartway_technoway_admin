import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisionaryLeadershipComponent } from './visionary-leadership.component';

const routes: Routes = [{ path: '', component: VisionaryLeadershipComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisionaryLeadershipRoutingModule { }
