import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallModalComponent } from './call-modal.component';

describe('CallModalComponent', () => {
  let component: CallModalComponent;
  let fixture: ComponentFixture<CallModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallModalComponent]
    });
    fixture = TestBed.createComponent(CallModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
