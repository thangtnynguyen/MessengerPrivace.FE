import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/apis/auth.service';
import { MessengerService } from 'src/app/core/services/apis/messenger.service';
import { MessengerHubService } from 'src/app/core/services/signlrs/messenger-hub.service';
import { environment } from 'src/environments/environment';
import * as docx from 'docx-preview';

@Component({
	selector: 'app-messenger-box',
	templateUrl: './messenger-box.component.html',
	styleUrls: ['./messenger-box.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class MessengerBoxComponent implements OnInit, OnDestroy, OnChanges {


	@Input() conversationId!: any;
	@Input() lastMessengerId!: any;
	@Input() lastSendId!: any;


	public baseImageUrl = environment.baseApiImageUrl;

	constructor(
		private modalService: BsModalService,
		private messengerService: MessengerService,
		private messengerHubService: MessengerHubService,
		private authService: AuthService,
		private changeDetectorRef: ChangeDetectorRef

	) {
		this.authService.userCurrent.subscribe((user: any) => {
			this.userCurrent = user;
		})

	}

	public userCurrent: any;

	public messengers: any = [];
	key = 'messages';
	public messenger: any = { images: [], author: 'Thắng' };
	public selectedImage: string | null = null;

	modalRef?: BsModalRef;
	@ViewChild('messengersContainer') private messengersContainer!: ElementRef;

	@ViewChild('ImagePreview') ImagePreview!: TemplateRef<any>;
	@ViewChild('FDFPreview') FDFPreview!: TemplateRef<any>;
	@ViewChild('WORDPreview') WORDPreview!: TemplateRef<any>;
	@ViewChild('wordContainer', { static: false }) wordContainer!: ElementRef;

	public media: any = {
		type: '...',
		url: '...'
	}


	ngOnInit(): void {
		if(this.lastSendId!=this.userCurrent.id){
			const request = {
				id: this.lastMessengerId,
				conversationid: this.conversationId,
				status: 'read',
			};
			this.messengerService.updateStatus(request).subscribe();
		}
		this.messengerHubService.startConnection().subscribe({
			next: () => {
				if (this.conversationId != null) {
					this.messengerHubService.joinConversationGroup(this.conversationId);
					this.handleGetMessengers();
					this.messengerHubService.addMessengerListener((messenger) => {
						if (this.messengers.length > 20) {
							// this.messengers.unshift(messenger);
							// this.messengers.pop();
							this.messengers.shift(); // Xóa phần tử đầu tiên
							this.messengers.push(messenger); // Thêm phần tử mới vào cuối mảng
						}
						else {
							// this.messengers.unshift(messenger);
							this.messengers.push(messenger);

						}
						this.scrollToBottom();


					});
				}

			},
			error: (err) => console.error('Error starting connection in ngOnInit: ', err)
		});
	}


	ngOnChanges(changes: SimpleChanges): void {
		if (changes['conversationId']) {
			if (this.conversationId != null) {
				this.handleGetMessengers();
			}
		}
	}

	getGoogleDocsViewerUrl(fileUrl: string): string {
		return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
	}



	ngOnDestroy() {
		// this.messengerHubService.leaveConversationGroup(this.conversationId);
	}

	handleGetMessengers() {
		const request = {
			conversationId: this.conversationId,
			pageSize: 100,
			sortBy:'asc'
		};
		this.messengerService.getByConversation(request).subscribe(res => {
			if (res.status) {
				this.messengers = res.data.items;
			}
			else {
				this.messengers = [];
			}
		});

	}

	openModalRoomImage(img: string) {
		this.selectedImage = img;
		this.modalRef = this.modalService.show(this.ImagePreview);
	}
	closeModalRoomImage() {
		this.modalRef?.hide();
	}

	openModalFDFPreview(media: any) {
		if (media.type == 'pdf') {
			this.media = media;
			// this.changeDetectorRef.detectChanges();
			this.modalRef = this.modalService.show(this.FDFPreview);
		}
	}
	closeModalFDFPreview() {
		this.modalRef?.hide();
	}


	isShowWORDPreview = false;
	errorMessage = '';
	openModalWORDPreview(media: any) {
		if (media.type === 'word') {

			// this.modalRef = this.modalService.show(this.WORDPreview);
			this.isShowWORDPreview = true;
			this.media = media;
			fetch(this.baseImageUrl + media.url)
				.then(response => {
					if (!response.ok) {
						this.errorMessage = 'Có lỗi xảy ra trong quá trình xử lý tài liệu,vui lòng tải tài liệu về để xem lâu dài';
						// throw new Error(`HTTP error! Status: ${response.status}`);
						return;
					}
					return response.arrayBuffer();
				})
				.then(data => {
					try {
						docx.renderAsync(data, this.wordContainer!.nativeElement)
							.catch(error => {
								// console.error('Error rendering document:', error);
								this.errorMessage = 'Có lỗi xảy ra trong quá trình xử lý tài liệu,vui lòng tải tài liệu về để xem lâu dài';
							});
					} catch (error) {
						// console.error('Error rendering document:', error);
						this.errorMessage = 'Có lỗi xảy ra trong quá trình xử lý tài liệu,vui lòng tải tài liệu về để xem lâu dài';
					}
				})
				.catch(error => {
					// console.error('Fetch error:', error);
					this.errorMessage = 'Không thể tải tài liệu. Vui lòng thử lại sau.';
				});
		}
	}

	closeModalWORDPreview() {
		this.isShowWORDPreview = false;
		this.modalRef?.hide();
	}


	scrollToBottom(): void {
		try {
			this.messengersContainer.nativeElement.scrollTop = this.messengersContainer.nativeElement.scrollHeight + 1000;
		} catch (err) {
			console.error('Error scrolling to bottom:', err);
		}
	}



}
