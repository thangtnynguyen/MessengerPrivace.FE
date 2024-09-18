import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/shared/components/layout/layout.component';
import { userInfoGuardGuard } from './core/guards/user-info.guard';

const routes: Routes = [

  {
    path:'auth',
    component:LayoutComponent,
    loadChildren:()=>import('./components/auth/auth.module').then((m)=>m.AuthModule)
  },
  {
    path:'messenger',
    canActivate: [userInfoGuardGuard],
    component:LayoutComponent,
    loadChildren:()=>import('./components/messenger/messenger.module').then((m)=>m.MessengerModule)
  },
  {
    path:'call-video',
    canActivate: [userInfoGuardGuard],
    component:LayoutComponent,
    loadChildren:()=>import('./components/call-video/call-video.module').then((m)=>m.CallVideoModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
