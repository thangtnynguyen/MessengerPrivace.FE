import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MuteCamMicService } from './mute-cam-mic.service';
import { MessageCountStreamService } from './message-count-stream.service';
import { AuthService } from '../../apis/auth.service';

@Injectable({
	providedIn: 'root'
})
export class CallSessionHubService {

	private baseUrl = environment.baseSignLRUrl;
	private hubConnection!: signalR.HubConnection;
	private userCurrent: any;
	//private onlineUsersSource = new BehaviorSubject<Member[]>([]);
	//onlineUsers$ = this.onlineUsersSource.asObservable();

	private oneOnlineUserSource = new Subject<any>();
	oneOnlineUser$ = this.oneOnlineUserSource.asObservable();

	private oneOfflineUserSource = new Subject<any>();
	oneOfflineUser$ = this.oneOfflineUserSource.asObservable();

	private messagesThreadSource = new BehaviorSubject<any[]>([]);
	messagesThread$ = this.messagesThreadSource.asObservable();


	private authToken;

	constructor(private toastr: ToastrService,
		private messageCount: MessageCountStreamService,
		private muteCamMicro: MuteCamMicService,
		private authService: AuthService
	) {
		this.authToken = this.authService.getAuthTokenLocalStorage()?.accessToken;
		this.authService.userCurrent.subscribe(user => {
			this.userCurrent = user;
		})
	}

	public startConnection(): Observable<void> {
		this.hubConnection = new signalR.HubConnectionBuilder()
			.withUrl(`${this.baseUrl}/hubs/call-session`, {
				accessTokenFactory: () => this.authToken || '',
				skipNegotiation: true,
				transport: signalR.HttpTransportType.WebSockets,
				withCredentials: true
			})
			.withAutomaticReconnect().build();

		return from(this.hubConnection.start().then(() => this.addHubListeners()));
	}

	private addHubListeners(): void {
		this.hubConnection.on('JoinCallVideoGroup', (callSessionId: string) => {
			console.log(`Joined call video group: ${callSessionId}`);
		});

		this.hubConnection.on('LeaveCallVideoGroup', (callSessionId: string) => {
			console.log(`Left call video group: ${callSessionId}`);
		});

		// this.hubConnection.on('ReceiveMessenger', (messenger: any) => {
		//     console.log('Received new message:', messenger);
		// });
	}


	public JoinCallSessionGroup(callSessionId: string): void {
		this.hubConnection.invoke('JoinCallSessionGroup', callSessionId)
			.then(() => {
				console.log(`Invoked join for call session: ${callSessionId}`);
			})
			.catch(err => console.error('Error joining call-video group: ', err));
	}

	public LeaveCallSessionGroup(callSessionId: string): void {
		this.hubConnection.invoke('LeaveCallSessionGroup', callSessionId)
			.then(() => console.log(`Invoked leave for call session: ${callSessionId}`))
			.catch(err => console.error('Error leaving conversation group: ', err));
	}


	public addJoinCallVideoListener(callback: (callSession: any) => void): void {
		this.hubConnection.on('JoinCallVideo', (callSession: any) => {
			this.oneOnlineUserSource.next(callSession);
			callback(callSession);
		});
	}

	public addUserOnlineInGroupListener(callback: (user: any) => void): void {
		this.hubConnection.on('UserOnlineInGroup', (user: any) => {
			this.oneOnlineUserSource.next(user);
			callback(user);
		});
	}
	public addUserOfflineOutGroupListener(callback: (user: any) => void): void {
		this.hubConnection.on('UserOfflineOutGroup', (user: any) => {
			this.oneOnlineUserSource.next(user);
			callback(user);
		});
	}


	stopHubConnection() {
		if (this.hubConnection) {
			this.hubConnection.stop().catch(error => console.log(error));
		}
	}

	async sendMessage(content: string) {
		return this.hubConnection.invoke('SendMessage', { content })
			.catch(error => console.log(error));
	}

	async muteMicroPhone(mute: boolean) {
		return this.hubConnection.invoke('MuteMicro', mute)
			.catch(error => console.log(error));
	}

	async muteCamera(mute: boolean) {
		return this.hubConnection.invoke('MuteCamera', mute)
			.catch(error => console.log(error));
	}

	async shareScreen(roomId: number, isShareScreen: boolean) {
		return this.hubConnection.invoke('ShareScreen', roomId, isShareScreen)
			.catch(error => console.log(error));
	}

	async shareScreenToUser(roomId: number, username: string, isShareScreen: boolean) {
		return this.hubConnection.invoke('ShareScreenToUser', roomId, username, isShareScreen)
			.catch(error => console.log(error));
	}
}
