import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionaryLeadershipComponent } from './visionary-leadership.component';

describe('VisionaryLeadershipComponent', () => {
  let component: VisionaryLeadershipComponent;
  let fixture: ComponentFixture<VisionaryLeadershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisionaryLeadershipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionaryLeadershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
