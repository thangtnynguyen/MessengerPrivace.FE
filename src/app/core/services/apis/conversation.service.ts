import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../../https/http-loading.service';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {

    constructor(private http: HttpLoadingService) { }

  

    getByUser(request: any = null): Observable<any> {
        return this.http.get('conversation/get-by-user', request);
    }

    getById(request: any = null): Observable<any> {
        return this.http.get('conversation/get-by-id', request);
    }

    createOrGet(request: any ): Observable<any> {
        return this.http.post('conversation/create-or-get', request);
    }

 
    
}