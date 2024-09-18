import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../../https/http-loading.service';

@Injectable({
    providedIn: 'root'
})
export class CallSessionService {

    constructor(private http: HttpLoadingService) { }


    create(request: any ): Observable<any> {
        return this.http.post('call-session/create', request);
    }

    addUser(request: any): Observable<any> {
        return this.http.put('call-session/add-user', request);
    }

    updateUser(request: any): Observable<any> {
        return this.http.put('call-session/update-user', request);
    }

    updateEndTime(request: any): Observable<any> {
        return this.http.put('call-session/update-end-time', request);
    }
    


}