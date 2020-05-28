import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageYardEmployeesComponent } from './manage-yard-employees.component';

describe('ManageYardEmployeesComponent', () => {
  let component: ManageYardEmployeesComponent;
  let fixture: ComponentFixture<ManageYardEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageYardEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageYardEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
