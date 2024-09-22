import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/shared/components/layout/layout.component';
import { userInfoGuardGuard } from './core/guards/user-info.guard';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		canActivate: [userInfoGuardGuard],
		component: LayoutComponent,
		children: [
			{
				path: 'messenger',
				canActivate: [AuthGuard],

				loadChildren: () => import('./components/messenger/messenger.module').then((m) => m.MessengerModule)
			},
			{
				path: 'call-video',
				canActivate: [AuthGuard],

				loadChildren: () => import('./components/call-video/call-video.module').then((m) => m.CallVideoModule)
			},
			{
				path: 'friend/list',
				canActivate: [AuthGuard],
				component: FriendListComponent,
			}
			,
			{
				path: '',
				redirectTo: 'messenger',
				pathMatch: 'full'

			}
		]
	},
	{
		path: 'auth',
		component: LayoutComponent,
		loadChildren: () => import('./components/auth/auth.module').then((m) => m.AuthModule)
	},
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'

	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
