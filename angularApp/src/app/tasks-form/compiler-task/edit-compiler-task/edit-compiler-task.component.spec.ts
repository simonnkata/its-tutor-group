import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompilerTaskComponent } from './edit-compiler-task.component';

describe('EditCompilerTaskComponent', () => {
  let component: EditCompilerTaskComponent;
  let fixture: ComponentFixture<EditCompilerTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCompilerTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCompilerTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
