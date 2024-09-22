import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Page } from '../enums/page.enum';
import { AuthService } from '../services/apis/auth.service';
import { AuthToken } from '../models copy/identity/auth-token.interface';


@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router, private loadingService: NgxSpinnerService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		if (this.authService.getUserCurrent()) {
			return of(true);
		} else {
			this.loadingService.show();
			const authToken: AuthToken | null = this.authService.getAuthTokenLocalStorage();
			console.log("Đã vào auth guard rồi nhé");
			if (authToken?.accessToken) {
				return this.authService.fetchUserCurrent().pipe(
					map(res => {
						if (res.status) {
							this.authService.setUserCurrent(res.data);
							this.loadingService.hide();
							return true;
						} else {
							this.authService.setUserCurrent(null);
							this.authService.setAuthTokenLocalStorage(null);
							this.loadingService.hide();
							this.router.navigate([Page.Login]);
							return false;
						}
					}),
					catchError(() => {
						this.authService.setUserCurrent(null);
						this.authService.setAuthTokenLocalStorage(null);
						this.loadingService.hide();
						this.router.navigate([Page.Login]);
						return of(false);
					})
				);
			} else {
				this.authService.setUserCurrent(null);
				this.authService.setAuthTokenLocalStorage(null);
				this.loadingService.hide();
				this.router.navigate([Page.Login]);
				return of(false);
			}
		}
	}
}
