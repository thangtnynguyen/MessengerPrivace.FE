import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerIntroduceComponent } from './messenger-introduce.component';

describe('MessengerIntroduceComponent', () => {
  let component: MessengerIntroduceComponent;
  let fixture: ComponentFixture<MessengerIntroduceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessengerIntroduceComponent]
    });
    fixture = TestBed.createComponent(MessengerIntroduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
