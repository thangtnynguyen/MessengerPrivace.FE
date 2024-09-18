import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/shared/components/layout/layout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpInterceptor } from './core/interceptors/http.interceptor';
import { SharedPipe } from './core/constants/shared-pipe.constant';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from "./core/modules/shared.module";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { SafePipe } from './core/pipes/safe-pipe.pipe';
import { TimeagoModule } from 'ngx-timeago';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FriendListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(), // ToastrModule added
    ModalModule.forRoot(),
    TimeagoModule.forRoot(),  
    SharedModule,
    BrowserAnimationsModule,
],
  providers: [
    ...SharedPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
