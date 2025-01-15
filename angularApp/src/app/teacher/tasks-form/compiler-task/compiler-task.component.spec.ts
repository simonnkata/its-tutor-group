import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilerTaskComponent } from './compiler-task.component';

describe('CompilerTaskComponent', () => {
  let component: CompilerTaskComponent;
  let fixture: ComponentFixture<CompilerTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompilerTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompilerTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
