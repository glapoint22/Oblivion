import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishManagerFormComponent } from './publish-manager-form.component';

describe('PublishManagerFormComponent', () => {
  let component: PublishManagerFormComponent;
  let fixture: ComponentFixture<PublishManagerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishManagerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishManagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
