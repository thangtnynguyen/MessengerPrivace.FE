import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConversationService } from 'src/app/core/services/apis/conversation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-send-invitation-modal',
  templateUrl: './send-invitation-modal.component.html',
  styleUrls: ['./send-invitation-modal.component.css']
})
export class SendInvitationModalComponent implements OnInit{

  baseImageUrl=environment.baseApiImageUrl;

  modalRef?: BsModalRef;
  @ViewChild('profileModal') profileModal!: TemplateRef<any>;

	@Input() infoConversation: any;

  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
		private conversationService: ConversationService,
  ) {}


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
			const conversationId = params['id'];
			if (conversationId) {
				console.log('Conversation ID:', conversationId);
				this.conversationService.getById({id:conversationId}).subscribe(res=>{
					if(res.status==true){
						this.infoConversation=res.data;
					}
				})
			}
		});
  }


  isModalOpen = false;

  // openModal() {
  //   this.modalRef = this.modalService.show(this.profileModal);
  // }

  // closeModal() {
  //   this.modalRef?.hide();
  // }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  
}

