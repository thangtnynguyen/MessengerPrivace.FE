import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallVideoRoutingModule } from './call-video-routing.module';
import { VideoBoxUserComponent } from './video-box-user/video-box-user.component';
import { CallBoxComponent } from './call-box/call-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';


import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [
    VideoBoxUserComponent,
    CallBoxComponent
  ],
  imports: [
    CommonModule,
    CallVideoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TimeagoModule.forRoot(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    PaginationModule.forRoot(),
  ]
})
export class CallVideoModule { }
