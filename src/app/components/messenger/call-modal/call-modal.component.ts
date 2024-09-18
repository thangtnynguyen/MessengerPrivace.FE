import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallSessionService } from 'src/app/core/services/apis/call-session.service';
import { CallSessionHubService } from 'src/app/core/services/signlrs/call-video/call-session-hub.service';
import { CallVideoHubService } from 'src/app/core/services/signlrs/call-video/call-video-hub.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-call-modal',
	templateUrl: './call-modal.component.html',
	styleUrls: ['./call-modal.component.css'],
	// encapsulation:ViewEncapsulation.None
})
export class CallModalComponent implements OnInit, OnChanges {

	constructor(
		private callSessionService: CallSessionService,
		private router: Router,
		private activeRoute: ActivatedRoute,
		private callVideoHubService: CallVideoHubService,
		private callSessionHubService: CallSessionHubService
	) {

	}


	ngOnInit() {
		console.log('CallModalComponent ngOnInit called');

		// this.callSessionHubService.startConnection().subscribe({
		// 	next: () => {
		// 		this.callSessionHubService.addJoinCallVideoListener((callSession) => {
		// 			console.log("info" + this.infoCallSession);
		// 			if (callSession != null) {
		// 				console.log("call section này cùi" + callSession.userCallVideos[0]);
		// 				if (callSession.userCallVideos.length > 1) {
		// 					console.log("Ông chủ đến đây");
		// 					this.router.navigate(['/call-video/call', this.infoCallSession.id]);
		// 				}
		// 			}
		// 		});
		// 	},
		// 	error: (err) => console.error('Error starting connection in ngOnInit: ', err)
		// });

		// if(this.infoCallSession!=null){
			// this.callSessionHubService.addJoinCallVideoListener((callSession) => {
			// 	console.log("info" + this.infoCallSession);
			// 	if (callSession != null) {
			// 		console.log("call section này cùi" + callSession.userCallVideos[0]);
			// 		if (callSession.userCallVideos.length > 1) {
			// 			console.log("Ông chủ đến đây");
			// 			this.router.navigate(['/call-video/call', this.infoCallSession.id]);
			// 		}
			// 	}
			// });
		// }

	}

	ngOnChanges() {

		// console.log('CallModalComponent ngOnChanges called');

		// this.callSessionHubService.startConnection().subscribe({
		// 	next: () => {
		// 		this.callSessionHubService.addJoinCallVideoListener((callSession) => {
		// 			console.log("info" + this.infoCallSession);
		// 			if (callSession != null) {
		// 				console.log("call section này cùi" + callSession.userCallVideos[0]);
		// 				if (callSession.userCallVideos.length > 1) {
		// 					console.log("Ông chủ đến đây");
		// 					this.router.navigate(['/call-video/call', this.infoCallSession.id]);
		// 				}
		// 			}
		// 		});
		// 	},
		// 	error: (err) => console.error('Error starting connection in ngOnInit: ', err)
		// });
	}

	@Input() infoConversation: any;
	@Input() infoCallSession: any;

	baseImageUrl = environment.baseApiImageUrl;
	isPopupVisible: boolean = false;

	isVideo: boolean = false;
	isCalling = false;

	openModal(isVideo: boolean) {
		this.isPopupVisible = true;
		this.isVideo = isVideo;
	}

	closeModal() {
		this.isPopupVisible = false;
	}


	handleSendRequestCallVideo() {
		this.isCalling = !this.isCalling;
		const request = {
			conversationId: this.infoConversation.id,
		};
		this.callSessionService.create(request).subscribe(res => {
			if (res.status == true) {
				this.infoCallSession = res.data;
				console.log("DMMMsao lai là null   " + res);
				this.callSessionHubService.startConnection().subscribe({
					next: () => {
						if (this.infoCallSession != null) {
							this.callSessionHubService.JoinCallSessionGroup(this.infoCallSession.id);
							console.log("Chủ cuộc họp đã join vô " + this.infoCallSession.id);
						}
						this.callVideoHubService.addCallVideoRequestListener((callSession) => {
							console.log("info" + this.infoCallSession);
							if (callSession != null) {
								if (callSession.userCallVideos.length > 1) {
									console.log("Ông chủ đến đây");
									this.router.navigate(['/call-video/call', this.infoCallSession.id]);
								}
							}
						});
					},
					error: (err) => console.error('Error starting connection in ngOnInit: ', err)
				});
			}
		});
	}




}
