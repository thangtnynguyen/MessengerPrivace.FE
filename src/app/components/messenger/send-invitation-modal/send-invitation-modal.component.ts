import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-send-invitation-modal',
  templateUrl: './send-invitation-modal.component.html',
  styleUrls: ['./send-invitation-modal.component.css']
})
export class SendInvitationModalComponent {


  modalRef?: BsModalRef;
  @ViewChild('profileModal') profileModal!: TemplateRef<any>;

  constructor(private modalService: BsModalService) {}

  openModal() {
    this.modalRef = this.modalService.show(this.profileModal);
  }

  closeModal() {
    this.modalRef?.hide();
  }

  
}
