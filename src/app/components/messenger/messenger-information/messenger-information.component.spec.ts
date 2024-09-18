import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerInformationComponent } from './messenger-information.component';

describe('MessengerInformationComponent', () => {
  let component: MessengerInformationComponent;
  let fixture: ComponentFixture<MessengerInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessengerInformationComponent]
    });
    fixture = TestBed.createComponent(MessengerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
