import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationService } from 'src/app/core/services/apis/conversation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-messenger-information',
  templateUrl: './messenger-information.component.html',
  styleUrls: ['./messenger-information.component.css']
})
export class MessengerInformationComponent implements OnInit {


  constructor
    (
      private activatedRoute: ActivatedRoute,
      private conversationService: ConversationService,
    ) {

  }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const conversationId = params['id'];
      if (conversationId) {
        console.log('Conversation ID:', conversationId);
        this.conversationService.getById({ id: conversationId }).subscribe(res => {
          if (res.status == true) {
            this.infoConversation = res.data;
          }
        })
      }
    });
  }


  baseImageUrl = environment.baseApiImageUrl;

  @Input() infoConversation: any;

}
