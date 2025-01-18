import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GapTaskComponent } from './gap-task.component';

describe('GapTaskComponent', () => {
  let component: GapTaskComponent;
  let fixture: ComponentFixture<GapTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GapTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GapTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
