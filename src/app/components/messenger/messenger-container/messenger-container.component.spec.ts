import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerContainerComponent } from './messenger-container.component';

describe('MessengerListComponent', () => {
  let component: MessengerContainerComponent;
  let fixture: ComponentFixture<MessengerContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessengerContainerComponent]
    });
    fixture = TestBed.createComponent(MessengerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
