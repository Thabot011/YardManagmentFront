import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YardEmployeesComponent } from './yard-employees.component';

describe('YardEmployeesComponent', () => {
  let component: YardEmployeesComponent;
  let fixture: ComponentFixture<YardEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YardEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YardEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
