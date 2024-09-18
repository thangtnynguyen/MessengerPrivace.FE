import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallBoxComponent } from './call-box/call-box.component';

const routes: Routes = [

  {
    path: 'call/:id',
    component: CallBoxComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallVideoRoutingModule { }
