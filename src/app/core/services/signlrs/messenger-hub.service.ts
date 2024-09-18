import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { AuthService } from '../apis/auth.service';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessengerHubService {
    private authToken;
    private hubConnection!: signalR.HubConnection;
    private baseUrl = environment.baseSignLRUrl;

    constructor(private authService: AuthService) {
        this.authToken = this.authService.getAuthTokenLocalStorage()?.accessToken;
        if (this.authToken) {
            this.startConnection().subscribe({
                next: () => console.log('Connection started'),
                error: (err) => console.error('Error while starting connection: ', err)
            });
        } else {
            console.error('No auth token available. Please login again.');
        }
    }

    public startConnection(): Observable<void> {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.baseUrl}/hubs/messenger`, {
                accessTokenFactory: () => this.authToken || '',
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                withCredentials: true
            })
            .withAutomaticReconnect().build();

        return from(this.hubConnection.start().then(() => this.addHubListeners()));
    }


    private addHubListeners(): void {
        this.hubConnection.on('JoinConversationGroup', (conversationId: string) => {
            console.log(`Joined conversation group: ${conversationId}`);
        });

        this.hubConnection.on('LeaveConversationGroup', (conversationId: string) => {
            console.log(`Left conversation group: ${conversationId}`);
        });
    }

    public joinConversationGroup(conversationId: string): void {
        this.hubConnection.invoke('JoinConversationGroup', conversationId)
            .then(() => console.log(`Invoked join for group: ${conversationId}`))
            .catch(err => console.error('Error joining conversation group: ', err));
    }

    public leaveConversationGroup(conversationId: string): void {
        this.hubConnection.invoke('LeaveConversationGroup', conversationId)
            .then(() => console.log(`Invoked leave for group: ${conversationId}`))
            .catch(err => console.error('Error leaving conversation group: ', err));
    }

    public addMessengerListener(callback: (messenger: any) => void): void {
        this.hubConnection.on('ReceiveMessenger', callback);
    }

    public addMessengerUpdateStatusListener(callback: (messenger: any) => void): void {
        this.hubConnection.on('MessengerUpdated', callback);
    }

    public stopConnection(): void {
        if (this.hubConnection) {
            this.hubConnection.stop()
                .then(() => console.log('Connection stopped'))
                .catch(err => console.error('Error while stopping connection: ', err));
        }
    }


    // public addActivityListener(callback: (activity: any) => void) {
    //     this.hubConnection.on('ReceiveActivity', callback);
    // }

    // public addNotificationListener(callback: (notification: any) => void) {
    //     this.hubConnection.on('ReceiveNotification', callback);
    // }

    // public addBannerUpdateListener(callback: (banner: any) => void) {
    //     this.hubConnection.on('BannerUpdated', callback);
    // }


    // public sendActivity(userName: string, userAvatar: string, activityType: string, activityContent: string) {
    //     this.hubConnection.invoke('SendActivity', userName, userAvatar, activityType, activityContent)
    //         .catch(err => console.error(err));
    // }


    // public addConnectionCountListeners(callback: (count: any) => void) {
    //     this.hubConnection.on('UpdateConnectionCount', callback);
    // }



}
