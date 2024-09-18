import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../../https/http-loading.service';

@Injectable({
    providedIn: 'root'
})
export class IconService {

    constructor(private http: HttpLoadingService) { }

    getPaging(request: any = null): Observable<any> {
        return this.http.get('icon/get-paging', request);
    }


    
}