import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationMessageModule } from './validation-message/validation-message.module';
import { LoadingUiModule } from './loading-ui/loading-ui.module';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CurrencyFormatPipe } from '../pipes/currency-format.pipe';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ToastrModule } from './toastr/toastr.module';
import { SidebarLeftComponent } from 'src/app/components/shared/components/sidebar-left/sidebar-left.component';
import { SearchFriendComponent } from './search-friend/search-friend.component';
import { SafePipe } from '../pipes/safe-pipe.pipe';


@NgModule({
  declarations: [
    CurrencyFormatPipe,LoadingSpinnerComponent,SidebarLeftComponent, SearchFriendComponent,
    SafePipe 


  ],
  imports: [CommonModule,BsDropdownModule, FormsModule, ReactiveFormsModule, RouterModule,ValidationMessageModule],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ValidationMessageModule,
    LoadingUiModule,
    CurrencyFormatPipe,
    LoadingSpinnerComponent,
    ToastrModule,
    SidebarLeftComponent,
    SearchFriendComponent,
    SafePipe 



  ],
})
export class SharedModule { }
