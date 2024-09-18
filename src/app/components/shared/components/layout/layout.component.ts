import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from '../../../auth/login/login.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  @ViewChild(LoginComponent) loginComponent!: LoginComponent;

}
