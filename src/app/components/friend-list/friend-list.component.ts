import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/apis/auth.service';
import { ContactService } from 'src/app/core/services/apis/contact.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {

  public baseImageUrl = environment.baseApiImageUrl;
  public userCurrent:any;
  public isSearch:boolean=false;
  public keyWord:any;

  constructor(private authService:AuthService,private contactService:ContactService){
    this.authService.userCurrent.subscribe(user => {
			this.userCurrent = user;
		})
  }
  
  ngOnInit(): void {
  }

  onFocus(): void {
		this.isSearch = true;
	}

  
	handleReceiveDataChatInfo(data: any) {
	}

  handleChangeMessengerBox(conversation: any = null) {

	}

  handleSearchContact(){
    // this.contactService.
  }



}
