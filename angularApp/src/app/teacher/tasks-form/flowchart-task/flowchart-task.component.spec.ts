import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowchartTaskComponent } from './flowchart-task.component';

describe('FlowchartTaskComponent', () => {
  let component: FlowchartTaskComponent;
  let fixture: ComponentFixture<FlowchartTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowchartTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlowchartTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
