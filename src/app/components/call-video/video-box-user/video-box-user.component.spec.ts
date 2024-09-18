import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoBoxUserComponent } from './video-box-user.component';

describe('VideoBoxUserComponent', () => {
  let component: VideoBoxUserComponent;
  let fixture: ComponentFixture<VideoBoxUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoBoxUserComponent]
    });
    fixture = TestBed.createComponent(VideoBoxUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
