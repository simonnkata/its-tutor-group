import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreetextComponent } from './freetext.component';

describe('FreetextComponent', () => {
  let component: FreetextComponent;
  let fixture: ComponentFixture<FreetextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreetextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FreetextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})
