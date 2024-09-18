import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingUiService } from '../loading-ui/loading-ui.service';

@Injectable({
	providedIn: 'root',
})
export class HttpLoadingService {
	// private baseUrl: string = enviroment.baseApiUrl;

	constructor(
		private http: HttpClient,
		private loadingUi: LoadingUiService,
	) { }

	getToken(): string {
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		return user.token || '';
	}

	// get(endpoint: string): Observable<any> {
	//   const headers = this.createHeaders();
	//   return this.http.get(`/${endpoint}`, { headers }).pipe(
	//     catchError((error: HttpErrorResponse) => {
	//       this.handleErrorResponse(error);
	//       return throwError(error);
	//     })
	//   );
	// }

	get(endpoint: string, data: any): Observable<any> {
		const headers = this.createHeaders();
		const queryParams = this.buildQueryParams(data);
		this.loadingUi.show();

		return this.http.get(`/${endpoint}${queryParams ? `?${queryParams}` : ''}`, { headers }).pipe(
			catchError((error: HttpErrorResponse) => {
				this.handleErrorResponse(error);
				return throwError(error);
			}),
			finalize(() => {
				this.loadingUi.hide();
			})
		);
	}
	getHaveData(endpoint: string, data: any): Observable<any> {
		const headers = this.createHeaders();
		const queryParams = this.buildQueryParams(data);
		this.loadingUi.show();

		return this.http.get(`/${endpoint}${queryParams ? `?${queryParams}` : ''}`, { headers }).pipe(
			catchError((error: HttpErrorResponse) => {
				this.handleErrorResponse(error);
				return throwError(error);
			}),
			finalize(() => {
				this.loadingUi.hide();
			})
		);
	}
	buildQueryParams(data: any): string {
		if (data) {
			const params = new URLSearchParams();
			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					params.set(key, data[key]);
				}
			}
			return params.toString();
		}
		return '';
	}
	post(endpoint: string, data: any): Observable<any> {
		this.loadingUi.show();
		const headers = this.createHeaders();
		return this.http.post(`/${endpoint}`, data, { headers }).pipe(
			catchError((error: HttpErrorResponse) => {
				this.handleErrorResponse(error);
				return throwError(error);
			}),
			finalize(() => {
				this.loadingUi.hide();
			})
		);
	}

	public postFormData(endpoint: string, formData: FormData): Observable<any> {
		this.loadingUi.show();
		const headers = this.createHeadersForFormData();
		// const headers = this.createHeaders();

		return this.http.post(`/${endpoint}`, formData, { headers }).pipe(
			catchError((error: HttpErrorResponse) => {
				this.handleErrorResponse(error);
				return throwError(error);
			}),
			finalize(() => {
				this.loadingUi.hide();
			})
		);
	}

	put(endpoint: string, data: any): Observable<any> {
		const headers = this.createHeaders();
		return this.http.put(`/${endpoint}`, data, { headers }).pipe(
			catchError((error: HttpErrorResponse) => {
				this.handleErrorResponse(error);
				return throwError(error);
			})
		);
	}

	public putFormData(endpoint: string, formData: FormData): Observable<any> {
		this.loadingUi.show();
		const headers = this.createHeadersForFormData();
		// const headers = this.createHeaders();

		return this.http.put(`/${endpoint}`, formData, { headers }).pipe(
			catchError((error: HttpErrorResponse) => {
				this.handleErrorResponse(error);
				return throwError(error);
			}),
			finalize(() => {
				this.loadingUi.hide();
			})
		);
	}

	delete(endpoint: string): Observable<any> {
		const headers = this.createHeaders();
		return this.http.delete(`/${endpoint}`, { headers }).pipe(
			catchError((error: HttpErrorResponse) => {
				this.handleErrorResponse(error);
				return throwError(error);
			})
		);
	}

	private createHeaders() {
		return new HttpHeaders({
			Authorization: `Bearer ${this.getToken()}`,
			'Content-Type': 'application/json',
		});
	}
	private createHeadersForFormData() {
		return new HttpHeaders({
			Authorization: `Bearer ${this.getToken()}`,
		});
	}

	handleErrorResponse(error: HttpErrorResponse) {
		console.error('HTTP Error:', error);
	}
}
