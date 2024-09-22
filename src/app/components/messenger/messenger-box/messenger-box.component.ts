import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/apis/auth.service';
import { MessengerService } from 'src/app/core/services/apis/messenger.service';
import { MessengerHubService } from 'src/app/core/services/signlrs/messenger-hub.service';
import { environment } from 'src/environments/environment';
import * as docx from 'docx-preview';
import { ActivatedRoute } from '@angular/router';
import { ConversationService } from 'src/app/core/services/apis/conversation.service';

@Component({
	selector: 'app-messenger-box',
	templateUrl: './messenger-box.component.html',
	styleUrls: ['./messenger-box.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class MessengerBoxComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit, AfterViewChecked {


	@Input() conversationId!: any;
	@Input() lastMessengerId!: any;
	@Input() lastSendId!: any;


	public baseImageUrl = environment.baseApiImageUrl;

	constructor(
		private modalService: BsModalService,
		private messengerService: MessengerService,
		private messengerHubService: MessengerHubService,
		private authService: AuthService,
		private changeDetectorRef: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private conversationService: ConversationService,


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

		if (this.lastSendId != this.userCurrent.id && this.lastSendId != null && this.conversationId != null) {
			const request = {
				id: this.lastMessengerId,
				conversationid: this.conversationId,
				status: 'read',
			};
			this.messengerService.updateStatus(request).subscribe();
			this.scrollToBottom();

		}

		if (this.conversationId != null) {
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
	}

	private shouldScroll = false;
	ngOnChanges(changes: SimpleChanges): void {
		if (changes['conversationId']) {
			if (this.conversationId != null) {
				this.handleGetMessengers();
				// this.scrollToBottom();
			}
			this.shouldScroll = true;

		}
		if (changes['messengers']) {
			if (this.conversationId != null) {
				this.handleGetMessengers();
				this.scrollToBottom();
			}
			this.shouldScroll = true;

		}
	}


	ngAfterViewInit() {
		this.scrollToBottom();
	}

	ngAfterViewChecked(): void {
		// this.scrollToBottom();
		if (this.shouldScroll) {
			this.scrollToBottom();
			this.shouldScroll = false;  // Đặt lại cờ sau khi cuộn
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
			sortBy: 'asc'
		};
		this.messengerService.getByConversation(request).subscribe(res => {
			if (res.status) {
				this.messengers = res.data.items;
				this.shouldScroll = true;

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
						return;
					}
					return response.arrayBuffer();
				})
				.then(data => {
					try {
						docx.renderAsync(data, this.wordContainer!.nativeElement)
							.catch(error => {
								this.errorMessage = 'Có lỗi xảy ra trong quá trình xử lý tài liệu,vui lòng tải tài liệu về để xem lâu dài';
							});
					} catch (error) {
						this.errorMessage = 'Có lỗi xảy ra trong quá trình xử lý tài liệu,vui lòng tải tài liệu về để xem lâu dài';
					}
				})
				.catch(error => {
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
			console.log("Đã scroll");
		} catch (err) {
			console.error('Error scrolling to bottom:', err);
		}
	}



}
