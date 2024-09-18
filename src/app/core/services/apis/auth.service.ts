import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../../utilities/http.service';
import { LocalStorage } from 'src/app/core/enums/local-storage.enum';;
import { LocalStorageService } from '../../utilities/local-storage.service';
import { HttpLoadingService } from '../../https/http-loading.service';
import { AuthToken } from '../../models copy/identity/auth-token.interface';
import { ApiResult } from '../../models copy/common/api-result.interface';
import { UserCurrent } from '../../models copy/user/user-current.interface';
import { LoginRequest } from '../../models copy/auth/login-request.interface';
import { RefreshTokenRequest } from '../../models copy/auth/refresh-token-request.interface';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	// private userCurrent: UserCurrent | null | undefined;
	private isInitAuthSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	isInitAuth$: Observable<boolean> = this.isInitAuthSubject.asObservable();


	private currentUserSubject = new BehaviorSubject<any>(null);
	public userCurrent = this.currentUserSubject.asObservable();

	getUserCurrent() {
		return this.currentUserSubject.value;
	}

	setUserCurrent(user: any) {
		this.currentUserSubject.next(user);
	}



	constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService, private httpService: HttpService, private httpLoadingService: HttpLoadingService) { }

	//Auth token
	getAuthTokenLocalStorage(): AuthToken | null {
		const authToken: AuthToken | null = this.localStorageService.getItem(LocalStorage.AuthToken);

		return authToken;
	}

	setAuthTokenLocalStorage(authToken: AuthToken | null) {
		this.localStorageService.setItem(LocalStorage.AuthToken, authToken);
	}


	getUserCurrentApi(): Observable<ApiResult<UserCurrent>> {
		return this.httpClient.get<ApiResult<UserCurrent>>('/user/user-info');
	}

	fetchUserCurrent(): Observable<ApiResult<UserCurrent>> {
		let headers = this.httpService.addSkipLoadingHeader();

		return this.httpClient.get<ApiResult<UserCurrent>>('/user/user-info', { headers });
	}

	register(request: any): Observable<any> {
		return this.httpClient.post('/auth/register', request);
	}

	loginByEmail(request: LoginRequest, password?: any): Observable<ApiResult<AuthToken>> {
		return this.httpClient.post<ApiResult<AuthToken>>('/auth/login', request);
	}

	editAccount(request: any): Observable<any> {
		return this.httpLoadingService.postFormData('user/edit-user-info', request);
	}

	refreshToken(request: RefreshTokenRequest): Observable<ApiResult<AuthToken>> {
		return this.httpClient.post<ApiResult<AuthToken>>('/auth/refresh-token', request);
	}

	hasRole(role: string): boolean {

		if (!this.currentUserSubject.value) {
			return false;
		}

		if (this.currentUserSubject.value.roles.includes(role)) {
			return true;
		} else {
			return false;
		}
	}

	hasRoleAsync(user: any, role: string): boolean {

		if (!user) {
			return false;
		}

		if (user.roles.includes(role)) {
			return true;
		} else {
			return false;
		}
	}

	logout(): Observable<ApiResult<boolean>> {
		return this.httpClient.post<ApiResult<boolean>>('/auth/logout', null);
	}



}









