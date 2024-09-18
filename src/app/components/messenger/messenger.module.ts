import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessengerRoutingModule } from './messenger-routing.module';
import { MessengerBoxComponent } from './messenger-box/messenger-box.component';
import { MessengerIntroduceComponent } from './messenger-introduce/messenger-introduce.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MessengerInformationComponent } from './messenger-information/messenger-information.component';
import { CallModalComponent } from './call-modal/call-modal.component';
import { SendInvitationModalComponent } from './send-invitation-modal/send-invitation-modal.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { SafePipe } from 'src/app/core/pipes/safe-pipe.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MessengerContainerComponent } from './messenger-container/messenger-container.component';


@NgModule({
  declarations: [
    MessengerBoxComponent,
    MessengerContainerComponent,
    MessengerIntroduceComponent,
    MessengerInformationComponent,
    CallModalComponent,
    SendInvitationModalComponent,


  ],
  imports: [
    CommonModule,
    MessengerRoutingModule,
    CarouselModule.forRoot(),
    FormsModule,
    SharedModule,
    PdfViewerModule  
  ],
})
export class MessengerModule { }
