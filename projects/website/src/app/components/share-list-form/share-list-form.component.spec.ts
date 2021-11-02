import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareListFormComponent } from './share-list-form.component';

describe('ShareListFormComponent', () => {
  let component: ShareListFormComponent;
  let fixture: ComponentFixture<ShareListFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareListFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
