import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallBoxComponent } from './call-box.component';

describe('CallBoxComponent', () => {
  let component: CallBoxComponent;
  let fixture: ComponentFixture<CallBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallBoxComponent]
    });
    fixture = TestBed.createComponent(CallBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
