import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/core/enums/page.enum';
import { emailValidator } from 'src/app/core/helpers/validator';
import { markAllAsTouched, validationMessages } from 'src/app/core/helpers/validatorHelper';
import { LoginRequest } from 'src/app/core/models copy/auth/login-request.interface';
import { ToastrService as NgxToastrService } from 'src/app/core/modules/toastr/toastr.service';
import { AuthService } from 'src/app/core/services/apis/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {


	isSubmitting: boolean = false;
    isLoading: boolean =false;
    public value='';
    loginForm: FormGroup;
    validationMessages = validationMessages;

    //register
    account: any = {
        name: '',
        userName: '',
        email: '',
        password: '',
        repeatPassword: '',
    };

    //get current url:
    currentUrl: string;

    constructor(private authService: AuthService, private bsModalRef: BsModalRef, private modalService: BsModalService, private fb: FormBuilder, private router: Router, private toastrService: NgxToastrService) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email, emailValidator]],
            password: ['', [Validators.required, Validators.maxLength(20)]],
        });
        this.currentUrl = this.router.url;
    }



    public handleOnSubmitLogin() {
        this.isLoading=true;
        if (this.isSubmitting) {
            return;
        }
        if (this.loginForm.valid) {
            this.isSubmitting = true;
            const request: LoginRequest = this.loginForm.value;
            this.authService.loginByEmail(request).subscribe(
                (res) => {
                    if (res.status) {
                        this.authService.setAuthTokenLocalStorage(res.data);
                        this.authService.fetchUserCurrent().subscribe(
                            (data) => {
                                this.authService.setUserCurrent(data.data);
                            }
                        )
                        this.toastrService.success(res.message, "Thành công");
                        this.handlePostLoginRedirect();

                    }
                    else {
                        this.toastrService.error(res.message);
                    }
                },
                (exception) => {
                    this.toastrService.error(exception.error.Message);
                    this.isSubmitting = false;
                },
                () => {
                    this.isSubmitting = false;
                    this.isLoading=false;
                }
            );
        }
        else {
            markAllAsTouched(this.loginForm);
            this.toastrService.warn("Cần nhập đủ thông tin", "Cảnh báo");


        }


    }


    handlePostLoginRedirect() {
        this.router.navigate([Page.Messenger]); 

    }


	validateNumericInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = input.value;
		input.value = value.replace(/[^0-9]/g, '');
	}


	passwordFieldType1: string = 'password';

	togglePasswordVisibility(field: string) {
		if (field === 'passwordFieldType1') {
			this.passwordFieldType1 = this.passwordFieldType1 === 'password' ? 'text' : 'password';
		}
	}
}
