import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../../https/http-loading.service';

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    constructor(private http: HttpLoadingService) { }


    getById(request: any = null): Observable<any> {
        return this.http.get('contact/get-by-user', request);
    }

    getStatusFriend(request: any = null): Observable<any> {
        return this.http.get('contact/status-friend', request);
    }

    sendFriendRequest(request: any): Observable<any> {
        return this.http.post('contact/send-friend-request', request);
    }

    acceptFriendRequest(request: any): Observable<any> {
        return this.http.post('contact/accept-friend-request', request);
    }
    


}