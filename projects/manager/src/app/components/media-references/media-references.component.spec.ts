import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaReferencesComponent } from './media-references.component';

describe('MediaReferencesComponent', () => {
  let component: MediaReferencesComponent;
  let fixture: ComponentFixture<MediaReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaReferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
