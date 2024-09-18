import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// import { LastUserJoinRoom } from '../models/lastUserJoinRoom';
// import { MuteObject } from '../models/mute-object';

@Injectable({
  providedIn: 'root'
})
export class MuteCamMicService {

  private muteMicro: any;
  private muteCamera: any;

  private muteMicroSource = new Subject<any>();
  muteMicro$ = this.muteMicroSource.asObservable();

  private muteCameraSource = new Subject<any>();
  muteCamera$ = this.muteCameraSource.asObservable();

  private shareScreenSource = new Subject<boolean>();
  shareScreen$ = this.shareScreenSource.asObservable();

  private lastShareScreenSource = new Subject<any>();
  lastShareScreen$ = this.lastShareScreenSource.asObservable();

  private shareScreenToLastUserSource = new Subject<boolean>();
  shareScreenToLastUser$ = this.shareScreenToLastUserSource.asObservable();

  private userIsSharingSource = new Subject<string>();
  userIsSharing$ = this.userIsSharingSource.asObservable();

  constructor() { }

  set Microphone(value: any) {
    this.muteMicro = value;
    this.muteMicroSource.next(value);
  }

  get Microphone(): any {
    return this.muteMicro;
  }

  set Camera(value: any) {
    this.muteCamera = value;
    this.muteCameraSource.next(value);
  }

  get Camera(): any {
    return this.muteCamera;
  }

  set ShareScreen(value: boolean) {
    this.shareScreenSource.next(value);
  }

  set LastShareScreen(value: any) {
    this.lastShareScreenSource.next(value);
  }

  set ShareScreenToLastUser(value: boolean) {
    this.shareScreenToLastUserSource.next(value);
  }

  set UserIsSharing(value: string){
    this.userIsSharingSource.next(value);
  }
}
