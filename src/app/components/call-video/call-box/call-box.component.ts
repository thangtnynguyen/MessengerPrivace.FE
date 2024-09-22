import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Subscription } from 'rxjs';
import Peer from "peerjs"; //tsconfig.json "esModuleInterop": true,

import { ToastrService } from 'ngx-toastr';
import { MuteCamMicService } from 'src/app/core/services/signlrs/call-video/mute-cam-mic.service';
import { ConfigService } from 'src/app/core/services/signlrs/call-video/ConfigService';
import { UtilityStreamService } from 'src/app/core/services/signlrs/call-video/utility-stream.service';
import { RecordFileService } from 'src/app/core/services/signlrs/call-video/record-file.service';
import { MessageCountStreamService } from 'src/app/core/services/signlrs/call-video/message-count-stream.service';
import { AuthService } from 'src/app/core/services/apis/auth.service';
import { LocalStorageService } from 'src/app/core/utilities/local-storage.service';
import { eMeet } from 'src/app/core/models/eMeeting';
import { VideoElement } from 'src/app/core/models/video-element';
import { CallVideoHubService } from 'src/app/core/services/signlrs/call-video/call-video-hub.service';
import { CallSessionHubService } from 'src/app/core/services/signlrs/call-video/call-session-hub.service';



@Component({
	selector: 'app-call-box',
	templateUrl: './call-box.component.html',
	styleUrls: ['./call-box.component.css']
})
export class CallBoxComponent implements OnInit, OnDestroy {
	isPersonal: boolean = true;
	isMeeting!: boolean;
	messageInGroup: any[] = [];
	currentRoomId = 0;
	currentUser: any;
	currentMember: any;
	subscriptions = new Subscription();
	statusScreen!: eMeet;
	chatForm!: UntypedFormGroup;
	messageCount = 0;
	shareScreenPeer: any;
	@ViewChild('videoPlayer', { static: false }) localvideoPlayer!: ElementRef;
	shareScreenStream: any;
	enableShareScreen = true;// enable or disable button sharescreen
	isStopRecord = false;
	textStopRecord = 'Start Record';
	videos: any[] = [];
	isRecorded!: boolean;
	userIsSharing!: string;

	constructor(private callVideoHub: CallVideoHubService,
		private shareScreenService: MuteCamMicService,
		private configService: ConfigService,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private router: Router,
		private utility: UtilityStreamService,
		private recordFileService: RecordFileService,
		private messageCountService: MessageCountStreamService,
		private authService: AuthService,
		private localStorageService: LocalStorageService,
		private callSessionHubService: CallSessionHubService
	) {
		this.authService.userCurrent.subscribe(user => {
			this.currentUser = user;
			this.currentMember = user;

			// this.currentMember = { userName: user.userName, displayName: user.displayName } as Member
		})
	}

	//chan khong cho tat trinh duyet khi o trang nay
	@HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
		if (this.isMeeting) {
			$event.returnValue = true;
		}
	}

	callSessionId!: any;
	myPeer: any;
	async  ngOnInit() {

		await this.createLocalStream();

		this.isMeeting = true
		this.isRecorded = this.configService.isRecorded;//enable or disable recorded
		const enableShareScreen = JSON.parse(this.localStorageService.getItem('share-screen'))
		if (enableShareScreen) {// != null
			this.enableShareScreen = enableShareScreen
		}

		this.khoiTaoForm();
		this.callSessionId = this.route.snapshot.paramMap.get('id') != null ? this.route.snapshot.paramMap.get('id') : '';
		this.callSessionHubService.startConnection().subscribe({
			next: () => {
				if (this.callSessionId != null) {
					this.callSessionHubService.JoinCallSessionGroup(this.callSessionId);
					this.callSessionHubService.addUserOnlineInGroupListener((user) => {
						console.log(user.name + " JOIN");
					});
					this.callSessionHubService.addUserOfflineOutGroupListener((user) => {
						console.log(user.name + " LEARVE");
						this.videos = this.videos.filter((video) => video.user.id != user.id);
						this.tempvideos = this.tempvideos.filter(video => video.user.id != user.id);
					});

					this.callSessionHubService.addJoinCallVideoListener((callSession) => {
						if (callSession != null) {
							// làm gì đó 
						}
					});

				}

			},
			error: (err) => console.error('Error starting connection in ngOnInit: ', err)
		});
		this.myPeer = new Peer(this.currentUser.id, {
			config: {
				'iceServers': [{
					urls: "stun:stun.l.google.com:19302",
				}, {
					urls: "turn:numb.viagenie.ca",
					username: "webrtc@live.com",
					credential: "muazkh"
				}]
			}
		});

		this.myPeer.on('open', (userId: any) => {
			console.log("kết nối tới peer thành công !" + userId);
		});

		this.myPeer.on('error', (err: any) => {
			console.error('Peer error:', err);
		});


		this.shareScreenPeer = new Peer('share_' + this.currentUser.id, {
			config: {
				'iceServers': [{
					urls: this.configService.STUN_SERVER
				}, {
					urls: this.configService.urlTurnServer,
					username: this.configService.username,
					credential: this.configService.password
				}]
			}
		})

		this.shareScreenPeer.on('call', (call: any) => {
			call.answer(this.shareScreenStream);
			call.on('stream', (otherUserVideoStream: MediaStream) => {
				this.shareScreenStream = otherUserVideoStream;
			});

			call.on('error', (err: any) => {
				console.error(err);
			})
		});

		//call group
		this.myPeer.on('call', (call: any) => {
			call.answer(this.stream);

			call.on('stream', (otherUserVideoStream: MediaStream) => {
				this.addOtherUserVideo(call.metadata.user, otherUserVideoStream);
			});

			call.on('error', (err: any) => {
				console.error(err);
			})
		});

		this.subscriptions.add(
			this.callSessionHubService.oneOnlineUser$.subscribe(member => {
				if (this.currentUser.id != member.id) {
					if (!member.id) {
						console.error('member.id không hợp lệ:', member.id);
						return;
					}
					// console.log('member.id không hợp lệ:', member.id)

					// Let some time for new peers to be able to answer
					setTimeout(() => {
						if (!this.myPeer || this.myPeer.disconnected) {
							console.error('Peer chưa kết nối hoặc đã ngắt kết nối');
							return;
						}
						if (!this.stream) {
							console.error('Stream chưa được khởi tạo');
							// return;
							this.createLocalStream();

						}
						const call = this.myPeer.call(member.id, this.stream, {
							metadata: { user: this.currentMember },
						});

						// Kiểm tra nếu call là undefined
						if (!call) {
							console.error("Không thể thực hiện cuộc gọi tới member.id:", member.id);
							return;
						}
						// console.log(call);
						call.on('stream', (otherUserVideoStream: MediaStream) => {
							this.addOtherUserVideo(member, otherUserVideoStream);
							console.log("Chuẩn rồi nhé" + member);
						});

						call.on('close', () => {
							this.videos = this.videos.filter((video) => video.user.id != member.id);
							//xoa user nao offline tren man hinh hien thi cua current user
							this.tempvideos = this.tempvideos.filter(video => video.user.id != member.id);
						});
					}, 1000);
				}
			})
		);
		

		this.subscriptions.add(this.callVideoHub.oneOfflineUser$.subscribe(member => {
			this.videos = this.videos.filter(video => video.user.id !== member.id);
			//xoa user nao offline tren man hinh hien thi current user
			this.tempvideos = this.tempvideos.filter(video => video.user.id !== member.id);
		}));

		this.subscriptions.add(
			this.callVideoHub.messagesThread$.subscribe(messages => {
				this.messageInGroup = messages;
			})
		);

		//hien thi so tin nhan chua doc
		this.subscriptions.add(
			this.messageCountService.messageCount$.subscribe(value => {
				this.messageCount = value;
			})
		);

		// bat che do share 1 man hinh len, nhan tu callVideoHub
		this.subscriptions.add(
			this.shareScreenService.shareScreen$.subscribe(val => {
				if (val) {//true = share screen
					this.statusScreen = eMeet.SHARESCREEN
					this.enableShareScreen = false;
					localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));
				} else {// false = stop share
					this.statusScreen = eMeet.NONE
					this.enableShareScreen = true;
					localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));
				}
			})
		)

		// bat dau share stream toi user vao sau cung tu user xuat phat stream
		this.subscriptions.add(this.shareScreenService.lastShareScreen$.subscribe(val => {
			if (val.isShare) {//true = share screen        
				this.callVideoHub.shareScreenToUser(Number.parseInt(this.callSessionId), val.username, true)
				setTimeout(() => {
					const call = this.shareScreenPeer.call('share_' + val.username, this.shareScreenStream);
				}, 1000)
			}
		}))

		this.subscriptions.add(this.utility.kickedOutUser$.subscribe(val => {
			this.isMeeting = false
			this.authService.logout()
			this.toastr.info('You have been locked by admin')
			this.router.navigateByUrl('/login')
		}))

		this.subscriptions.add(this.shareScreenService.userIsSharing$.subscribe(val => {
			this.userIsSharing = val
		}))
	}


	//khong xai
	/* addMyVideo(stream: MediaStream) {
	  this.videos.push({
		muted: true,
		srcObject: stream,
		user: { userName: this.currentUser.userName, displayName: this.currentUser.displayName } as Member,
	  });
	} */

	addOtherUserVideo(user: any, stream: MediaStream) {
		const alreadyExisting = this.videos.some(video => video.user.userName === user.userName);
		if (alreadyExisting) {
			console.log(this.videos, user);
			return;
		}

		this.videos.push({
			muted: false,
			srcObject: stream,
			user: user
		});

		if (this.videos.length <= this.maxUserDisplay) {
			this.tempvideos.push({
				muted: false,
				srcObject: stream,
				user: user
			})
		}
	}

	maxUserDisplay = 8; // chi hien toi da la 8 user
	tempvideos: VideoElement[] = [];

	stream: any;
	enableVideo = true;
	enableAudio = true;

	async createLocalStream() {
		try {
			this.stream = await navigator.mediaDevices.getUserMedia({ video: this.enableVideo, audio: this.enableAudio });
			this.localvideoPlayer.nativeElement.srcObject = this.stream;
			this.localvideoPlayer.nativeElement.load();
			this.localvideoPlayer.nativeElement.play();

		} catch (error) {
			console.error(error);
			alert(`Can't join room, error ${error}`);
		}
	}

	enableOrDisableVideo() {
		this.enableVideo = !this.enableVideo
		if (this.stream.getVideoTracks()[0]) {
			this.stream.getVideoTracks()[0].enabled = this.enableVideo;
			this.callVideoHub.muteCamera(this.enableVideo)
		}
	}

	enableOrDisableAudio() {
		this.enableAudio = !this.enableAudio;
		if (this.stream.getAudioTracks()[0]) {
			this.stream.getAudioTracks()[0].enabled = this.enableAudio;
			this.callVideoHub.muteMicroPhone(this.enableAudio)
		}
	}

	// onSelect(data: TabDirective): void {
	// 	if (data.heading == "Chat") {
	// 		this.messageCountService.ActiveTabChat = true;
	// 		this.messageCountService.MessageCount = 0;
	// 		this.messageCount = 0;
	// 	} else {
	// 		this.messageCountService.ActiveTabChat = false;
	// 	}
	// }

	khoiTaoForm() {
		this.chatForm = new UntypedFormGroup({
			content: new UntypedFormControl('', Validators.required)
		})
	}

	sendMessage() {
		this.callVideoHub.sendMessage(this.chatForm.value.content).then(() => {
			this.chatForm.reset();
		})
	}

	async shareScreen() {
		try {
			// @ts-ignore
			let mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
			this.callVideoHub.shareScreen(Number.parseInt(this.callSessionId), true);
			this.shareScreenStream = mediaStream;
			this.enableShareScreen = false;

			this.videos.forEach(v => {
				const call = this.shareScreenPeer.call('share_' + v.user.userName, mediaStream);
				//call.on('stream', (otherUserVideoStream: MediaStream) => { });
			})

			mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
				this.callVideoHub.shareScreen(Number.parseInt(this.callSessionId), false);
				this.enableShareScreen = true;
				localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));
			});
		} catch (e) {
			console.log(e);
			alert(e)
		}
	}

	StartRecord() {
		this.isStopRecord = !this.isStopRecord;
		if (this.isStopRecord) {
			this.textStopRecord = 'Stop record';
			this.recordFileService.startRecording(this.stream);
		} else {
			this.textStopRecord = 'Start record';
			this.recordFileService.stopRecording();
			setTimeout(() => {
				this.recordFileService.upLoadOnServer().subscribe(() => {
					this.toastr.success('Upload file on server success');
				})
			}, 1000)
		}
	}

	/*   getTURNServer(): any{
		return { 'iceServers': [
		  { url:'stun:stun.12voip.com:3478'}
	   ] };
	  } */

	ngOnDestroy() {
		this.isMeeting = false;
		this.myPeer.disconnect();//dong ket noi nhung van giu nguyen cac ket noi khac
		this.shareScreenPeer.destroy();//dong tat ca cac ket noi
		this.callVideoHub.leaveCallVideoGroup(this.callSessionId);
		this.callVideoHub.stopHubConnection();
		this.subscriptions.unsubscribe();
		localStorage.removeItem('share-screen');
	}

	@HostListener('window:beforeunload', ['$event'])
	unloadHandler($event: any) {

		console.log("cayyy");
		$event.returnValue = true;

		// this.callVideoHub.leaveCallVideoGroup(this.conversationId);

	}


	onLoadedMetadata(event: Event) {
		(event.target as HTMLVideoElement).play();
	}

	isOwnVideoZoomed = false;

	toggleOwnVideoZoom() {
		this.isOwnVideoZoomed = !this.isOwnVideoZoomed;
	}


}
