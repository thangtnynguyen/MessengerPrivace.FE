import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessengerContainerComponent } from './messenger-container/messenger-container.component';
import { MessengerBoxComponent } from './messenger-box/messenger-box.component';

const routes: Routes = [
  {
    path: '',
    component: MessengerContainerComponent
  },
  {
    path: 'list',
    component: MessengerContainerComponent
  },
  {
    path: 'box/:id',
    component: MessengerBoxComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessengerRoutingModule { }
