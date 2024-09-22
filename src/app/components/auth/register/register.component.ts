import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Page } from 'src/app/core/enums/page.enum';
import { emailValidator } from 'src/app/core/helpers/validator';
import { markAllAsTouched, validationMessages } from 'src/app/core/helpers/validatorHelper';
import { LoginRequest } from 'src/app/core/models copy/auth/login-request.interface';
import { ToastrService as NgxToastrService } from 'src/app/core/modules/toastr/toastr.service';
import { AuthService } from 'src/app/core/services/apis/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {


    isSubmitting: boolean = false;
    isLoading: boolean = false;
    public value = '';
    validationMessages = validationMessages;

    //register
    account: any = {
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        repeatPassword: '',
    };

    //get current url:
    currentUrl: string;

    constructor(private authService: AuthService, private bsModalRef: BsModalRef, private modalService: BsModalService, private fb: FormBuilder, private router: Router, private toastrService: NgxToastrService) {
        this.currentUrl = this.router.url;
    }



    public handleOnSubmitRegister() {
        this.isLoading = true;
        if (this.isSubmitting) {
            return;
        }
        else {
            const formData = new FormData();
            formData.append('name', this.account.name);
            formData.append('email', this.account.email);
            formData.append('phoneNumber', this.account.phoneNumber);
            formData.append('password', this.account.password);
            formData.append('status', 'true');
            formData.append('role', 'user');
            this.authService.register(formData).subscribe(
                res => {
                    if (res.status == true) {
                        this.toastrService.success('Thành công');
                        this.handlePostRegisterRedirect();
                        this.isLoading=false;

                    }
                    this.isLoading=false;

                },
                (exception) => {
                    this.toastrService.error(exception.error.Message);
                    this.isSubmitting = false;
                },
                () => {
                    this.isSubmitting = false;
                    this.isLoading = false;
                }
            );
        }

    }


    handlePostRegisterRedirect() {
        this.router.navigate([Page.Login]);

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
