import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../../https/http-loading.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpLoadingService) { }



  search(request: any = null): Observable<any> {
    return this.http.get('user/search', request);
  }


  create(request: any): Observable<any> {
    return this.http.post('user/create', request);
  }

  
  verificationByPhoneOtp(request: any): Observable<any> {
    return this.http.post('user/verification-by-phone-otp', request);
  }

  rendNewPassword(request: any): Observable<any> {
    return this.http.post('user/set-password', request);
  }

  changePassword(request: any): Observable<any> {
    return this.http.put('user/password-change-current-user', request);
  }


  reSendPhoneOtp(request: any): Observable<any> {
    return this.http.post('user/resend-phone-otp', request);
  }

  getPaging(request: any = null): Observable<any> {
    return this.http.get('user/paging', request);
  }

  getById(request: any = null): Observable<any> {
    return this.http.get('user/get-by-id', request);
  }


}
