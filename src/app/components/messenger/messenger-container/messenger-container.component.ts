import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CallModalComponent } from '../call-modal/call-modal.component';
import { SendInvitationModalComponent } from '../send-invitation-modal/send-invitation-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/apis/auth.service';
import { ContactService } from 'src/app/core/services/apis/contact.service';
import { ConversationService } from 'src/app/core/services/apis/conversation.service';
import { MessengerService } from 'src/app/core/services/apis/messenger.service';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'src/app/core/configs/paging.config';
import { environment } from 'src/environments/environment';
import conversationTypeConstant from 'src/app/core/constants/conversation-type.constant';
import { IconService } from 'src/app/core/services/apis/icon.service';
import { MessengerHubService } from 'src/app/core/services/signlrs/messenger-hub.service';
import { CallVideoHubService } from 'src/app/core/services/signlrs/call-video/call-video-hub.service';
import { CallSessionHubService } from 'src/app/core/services/signlrs/call-video/call-session-hub.service';
import { CallSessionService } from 'src/app/core/services/apis/call-session.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-messenger-container',
	templateUrl: './messenger-container.component.html',
	styleUrls: ['./messenger-container.component.css']
})
export class MessengerContainerComponent implements OnInit, OnDestroy {

	public userCurrent: any = null;
	public baseImageUrl = environment.baseApiImageUrl;

	public isSearch: boolean = false;
	public keyWord: string = '';

	public isDropdownVisible = false;

	public infoConversation: any;

	public infoCallSession: any;

	public conversations: any = [];

	private conversationTypeConstant = conversationTypeConstant;

	public isCallRequest: boolean = false;

	constructor(private modalService: BsModalService,
		private authService: AuthService,
		private contactService: ContactService,
		private conversationService: ConversationService,
		private messengerService: MessengerService,
		private iconService: IconService,
		private messengerHubService: MessengerHubService,
		private callVideoHubService: CallVideoHubService,
		private callSessionHubService:CallSessionHubService,
		private callSessionService:CallSessionService,
		private router :Router

	) {
		this.authService.userCurrent.subscribe(user => {
			this.userCurrent = user;
		})
	}

	public isMessengerBoxBlank = true;
	public messenger: any = { images: [], files: [], medias: [], content: '' };
	public selectedImage: string | null = null;
	modalRef?: BsModalRef;



	@ViewChild(CallModalComponent) callModalComponent!: CallModalComponent;
	@ViewChild(SendInvitationModalComponent) sendInvitationModalComponent!: SendInvitationModalComponent;
	@ViewChild('fileInput') fileInput!: ElementRef;
	@ViewChild('imageInput') imageInput!: ElementRef;
	@ViewChild('messengersContainer') private messengersContainer!: ElementRef;


	private isDoneJoinConversation: number = 0;
	ngOnInit() {
		document.addEventListener('paste', this.handlePaste.bind(this));
		this.handleGetConversations();

		this.messengerHubService.startConnection().subscribe({
			next: () => {
				if (this.conversations != null && this.conversations.length > 0) {
					this.conversations.forEach((conversation: any) => {
						this.messengerHubService.joinConversationGroup(conversation.id);
						this.isDoneJoinConversation += 1;
					});
					this.messengerHubService.addMessengerUpdateStatusListener((status) => {
						if (status == true) {
							this.handleGetConversations();
						}
					});
					this.messengerHubService.addMessengerListener((messenger) => {
						if (messenger != null) {
							this.handleGetConversations();
						}
					});
				}

			},
			error: (err) => console.error('Error starting connection in ngOnInit: ', err)
		});

		this.callVideoHubService.startConnection().subscribe({
			next: () => {
				if (this.conversations != null && this.conversations.length > 0) {
					this.conversations.forEach((conversation: any) => {
						this.callVideoHubService.joinCallVideoGroup(conversation.id);
						this.isDoneJoinConversation += 1;
					});
					this.callVideoHubService.addCallVideoRequestListener((callSession) => {
						if (callSession != null) {
							if (callSession.callerId != this.userCurrent.id) {
								this.isCallRequest = true;
								this.infoCallSession=callSession;
								console.log("Anh đến rồi");
								console.log(callSession);
							}
							else{
								this.infoCallSession=callSession;
							}
						}
					});
					this.callVideoHubService.addAcceptCallVideoRequestListener((callSession) => {
						console.log("info" + this.infoCallSession);
						if (callSession != null) {
							console.log("call section này cùi" + callSession.userCallVideos[0]);
							if (callSession.userCallVideos.length > 1) {
								console.log("Ông chủ đến đây"+this.infoCallSession.id);
								this.router.navigate(['/call-video/call', this.infoCallSession.id]);
							}
						}
					});
				}

			},
			error: (err) => console.error('Error starting connection in ngOnInit: ', err)
		});

	
	}

	ngOnDestroy() {
		// if (this.conversations != null && this.conversations.length>0) {
		// 	this.conversations.forEach((conversation:any) => {
		// 		this.messengerHubService.leaveConversationGroup(conversation.id);
		// 	});

		// }
		this.isCallRequest = false;

	}


	handleGetConversations() {
		const request = {
			pageIndex: DEFAULT_PAGE_INDEX,
			pageSize: DEFAULT_PAGE_SIZE,
		}
		this.conversationService.getByUser(request).subscribe(res => {
			if (res.status && res.data != null) {
				this.conversations = res.data.items;

			}
		})

		console.log('đã làm mới');
	}

	handleSendInvite() {
		const request = {
			userId: '',
		}
		this.contactService.sendFriendRequest(request).subscribe(res => {

		});
	}


	handleChangeMessengerBox(conversation: any = null) {

		if (conversation == null) {
			this.isMessengerBoxBlank = !this.isMessengerBoxBlank;
		}
		else {
			this.infoConversation = conversation;
			this.isMessengerBoxBlank = !this.isMessengerBoxBlank;

		}
	}


	handleReceiveDataChatInfo(data: any) {
		this.infoConversation = data;
	}

	handleChangeFriendChat() {
		if (1 === 1) {

		}
	}


	handleSendMessenger() {
		if (this.messenger.content.trim() == '' && this.messenger.medias.length <= 0) {
			return;
		}
		else {
			const formData = new FormData();
			formData.append('conversationId', this.infoConversation.id);
			formData.append('replyId', '');
			formData.append('senderId', this.userCurrent.id);
			formData.append('content', this.messenger.content);
			formData.append('messengerType', 'all');
			formData.append('status', 'sent');

			if (this.messenger.medias && this.messenger.medias.length > 0) {
				for (let i = 0; i < this.messenger.medias.length; i++) {
					const mediaFile = this.messenger.medias[i];
					formData.append(`mediaFiles[${i}].file`, mediaFile.file, mediaFile.file.name);
					formData.append(`mediaFiles[${i}].type`, mediaFile.type);
					formData.append(`mediaFiles[${i}].name`, mediaFile.name);

				}
			}

			this.messengerService.send(formData).subscribe(res => {
				if (res.status === true) {
					this.messenger.content = '';
					this.messenger.images = [];
					this.messenger.files = [];
					this.messenger.medias = [];
				}
			});
		}

	}

	handleRejectCallVideoRequest() {
		this.callVideoHubService.rejectCallVideoRequest(this.infoCallSession.conversationId);
		this.isCallRequest = false;
	}

	handleAcceptCallVideoRequest() {
		// this.callSessionHubService.startConnection().subscribe({
		// 	next: () => {
		// 		if (this.infoCallSession != null) {
		// 			this.callSessionHubService.JoinCallSessionGroup(this.infoCallSession.id);
		// 			console.log("Đã join vô cuộc gọi nhé  "+this.infoCallSession.id);
		// 		}
		// 	},
		// 	error: (err) => console.error('Error starting connection in ngOnInit: ', err)
		// });
		this.isCallRequest = false;
		const request={
			conversationId:this.infoCallSession.conversationId,
			callSessionId:this.infoCallSession.id,
			muteCamera:false,
			muteMicro:false,
			status:'online'
		};
		this.callSessionService.addUser(request).subscribe(res=>{
			if(res.status==true){
				this.router.navigate(['/call-video/call', this.infoCallSession.id]);
			}
		});

	}




	changeBackground(color: string) {
		document.documentElement.style.setProperty('--background-color', color);
	}


	toggleDropdown() {
		this.isDropdownVisible = !this.isDropdownVisible;
	}

	onFocus(): void {
		this.isSearch = true;
	}



	onImageSelected(event: any) {
		if (event.target.files) {
			for (let i = 0; i < event.target.files.length; i++) {
				const file = event.target.files[i];
				const fileType = this.getFileType(file);
				this.messenger.medias.push({ file: file, type: fileType, name: file.name });
				if (fileType == 'image') {
					const reader = new FileReader();
					reader.onload = (e: any) => {
						this.messenger.images.push(e.target.result);
					};
					reader.readAsDataURL(file);
				}
				else {
					this.messenger.files.push({ name: file.name, type: fileType });

				}

			}
		}
	}

	onFileSelected(event: any) {
		if (event.target.files) {
			for (let i = 0; i < event.target.files.length; i++) {
				const file = event.target.files[i];
				const fileType = this.getFileType(file);
				this.messenger.medias.push({ file: file, type: fileType, name: file.name });
				if (fileType == 'image') {
					const reader = new FileReader();
					reader.onload = (e: any) => {
						this.messenger.images.push(e.target.result);
					};
					reader.readAsDataURL(file);
				}
				else {
					this.messenger.files.push(file.name);
				}
			}
		}
	}

	getFileType(file: File): string {
		const extension = file.name.split('.').pop()?.toLowerCase();
		switch (extension) {
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
				return 'image';
			case 'mp4':
			case 'avi':
			case 'mov':
			case 'wmv':
				return 'video';
			case 'mp3':
			case 'wav':
			case 'aac':
			case 'flac':
				return 'audio';
			case 'xls':
			case 'xlsx':
				return 'excel';
			case 'doc':
			case 'docx':
				return 'word';
			case 'ppt':
			case 'pptx':
				return 'powerpoint';
			case 'pdf':
				return 'pdf';
			default:
				return 'other';
		}
	}


	triggerImageInput() {
		this.imageInput.nativeElement.click();
	}

	triggerFileInput() {
		this.fileInput.nativeElement.click();
	}
	handlePaste(event: ClipboardEvent) {
		if (event.clipboardData) {
			const items = event.clipboardData.items;
			for (let i = 0; i < items.length; i++) {
				if (items[i].type.indexOf('image') !== -1) {
					const file = items[i].getAsFile();
					if (file) {
						const reader = new FileReader();
						reader.onload = (e: any) => {
							this.messenger.images.push(e.target.result);
						};
						reader.readAsDataURL(file);
					}
				}
			}
		}
	}

	removeImage(index: number) {
		this.messenger.images.splice(index, 1);
		this.messenger.medias.splice(index, 1);
	}

	removeAllImages() {
		this.messenger.images = [];
		this.messenger.medias = [];
	}

	removeFile(index: number) {
		this.messenger.files.splice(index, 1);
		this.messenger.medias.splice(index, 1);
	}

	removeAllFiles() {
		this.messenger.files = [];
		this.messenger.medias = [];
	}

	icons: any = [];
	isShowIcons = false;
	handleOpenListIcons() {
		this.isShowIcons = !this.isShowIcons;
		const request = {
			pageSize: 100,

		};
		this.iconService.getPaging(request).subscribe(res => {
			if (res.status == true) {
				this.icons = res.data.items;
			}
		})
	}
	handleCloseListIcons() {
		this.isShowIcons = false;
	}

	handleSendIcon(icon: any) {
		const formData = new FormData();
		formData.append('ConversationId', this.infoConversation.id);
		formData.append('replyId', '');
		formData.append('senderId', this.userCurrent.id);
		formData.append('messengerType', 'icon');
		formData.append('status', 'sent');
		if (icon.type == 'image') {
			formData.append('icon.url', icon.url);
		}
		if (icon.type == 'svg') {
			formData.append('icon.data', icon.data);
		}
		formData.append('icon.name', icon.name);

		this.messengerService.send(formData).subscribe(res => {
			if (res.status === true) {
				this.messenger.content = '';
				this.messenger.images = [];
				this.messenger.files = [];
				this.messenger.medias = [];
				this.isShowIcons = false;

			}
		});

	}

	convertTimeToRelative(time: Date): string {
		const currentTime = new Date();
		const timeDiff = currentTime.getTime() - new Date(time).getTime();
		const seconds = Math.floor(timeDiff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const weeks = Math.floor(days / 7);
		const months = Math.floor(days / 30);
		const years = Math.floor(days / 365);

		if (years > 0) {
			return years === 1 ? '1 năm trước' : `${years} năm trước`;
		} else if (months > 0) {
			return months === 1 ? '1 tháng trước' : `${months} tháng trước`;
		} else if (weeks > 0) {
			return weeks === 1 ? '1 tuần trước' : `${weeks} tuần trước`;
		} else if (days > 1) {
			return days === 2 ? 'hôm qua' : `${days} ngày trước`;
		} else if (days === 1) {
			return 'hôm kia';
		} else if (hours > 0) {
			return `${hours} giờ trước`;
		} else if (minutes > 0) {
			return `${minutes} phút trước`;
		} else {
			return 'vừa mới';
		}
	}

	scrollToBottom(): void {
		try {
			this.messengersContainer.nativeElement.scrollTop = this.messengersContainer.nativeElement.scrollHeight;
		} catch (err) {
			console.error('Error scrolling to bottom:', err);
		}
	}





}
