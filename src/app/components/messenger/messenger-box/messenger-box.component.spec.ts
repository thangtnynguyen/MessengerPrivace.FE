import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerBoxComponent } from './messenger-box.component';

describe('MessengerBoxComponent', () => {
  let component: MessengerBoxComponent;
  let fixture: ComponentFixture<MessengerBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessengerBoxComponent]
    });
    fixture = TestBed.createComponent(MessengerBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
