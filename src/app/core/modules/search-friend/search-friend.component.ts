import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/apis/user.service';
import { ConversationService } from '../../services/apis/conversation.service';
import conversationTypeConstant from '../../constants/conversation-type.constant';
import { AuthService } from '../../services/apis/auth.service';

@Component({
	selector: 'app-search-friend',
	templateUrl: './search-friend.component.html',
	styleUrls: ['./search-friend.component.css']
})
export class SearchFriendComponent {

	@Input() keyWord!: any;

	@Output() eventChange = new EventEmitter<boolean>();

	@Output() dataChatInfoEvent = new EventEmitter<any>();


	public friends: any = [];

	private searchTimer: any = null;

	public userCurrent:any; 

	private conversationTypeConstant= conversationTypeConstant;

	constructor(
		private userService: UserService,
		private authService:AuthService,
		private conversationService:ConversationService
	) {
		this.authService.userCurrent.subscribe(user=>{
			this.userCurrent=user;
		});
	}



	//0.5s mới gọi api
	ngOnChanges(changes: SimpleChanges): void {
		if (changes['keyWord']) {
			if (changes['keyWord'].currentValue !== changes['keyWord'].previousValue) {
				if (this.searchTimer) {
					clearTimeout(this.searchTimer);
				}
				this.searchTimer = setTimeout(() => {
					if (changes['keyWord'].currentValue != '') {
						this.handleSearchFriends();
					}
				}, 500);
			}
		}
	}

	handleSearchFriends() {
		const request = {
			keyWord: this.keyWord,
		}
		this.userService.search(request).subscribe(res => {
			if (res.status) {
				this.friends = res.data;
			}
			else {
				this.friends = [];
			}
		})
	}


	handleCreateConversation(friend:any){
		const request={
			type:this.conversationTypeConstant.personal,
			participants:[this.userCurrent.id,friend.id],
			administrators:[this.userCurrent.id,friend.id],
		}
		this.conversationService.createOrGet(request).subscribe(res=>{
			this.dataChatInfoEvent.emit(res.data);
		});
	}

	
	handleShowMessengerBox(){
		this.eventChange.emit(true);
	}



	// ngOnChanges(changes: SimpleChanges): void {
	//   if (changes['keyWord']) {
	//     if (changes['keyWord'].currentValue !== changes['keyWord'].previousValue) {
	//       this.handleSearchFriends();
	//     }
	//   }
	// }

}
