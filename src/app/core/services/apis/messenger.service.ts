import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../../https/http-loading.service';

@Injectable({
    providedIn: 'root'
})
export class MessengerService {

    constructor(private http: HttpLoadingService) { }

    getByConversation(request: any = null): Observable<any> {
        return this.http.get('messenger/get-by-conversation', request);
    }

    send(request: any ): Observable<any> {
        return this.http.postFormData('messenger/send', request);
    }

    updateStatus(request: any ): Observable<any> {
        return this.http.put('messenger/update-status', request);
    }

 
    
}