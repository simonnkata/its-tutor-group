import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorComponentComponent } from './tutor-component.component';

describe('TutorComponentComponent', () => {
  let component: TutorComponentComponent;
  let fixture: ComponentFixture<TutorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TutorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
