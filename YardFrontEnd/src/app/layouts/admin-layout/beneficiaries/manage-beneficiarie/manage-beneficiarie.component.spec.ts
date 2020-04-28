import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBeneficiarieComponent } from './manage-beneficiarie.component';

describe('ManageBeneficiarieComponent', () => {
  let component: ManageBeneficiarieComponent;
  let fixture: ComponentFixture<ManageBeneficiarieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageBeneficiarieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBeneficiarieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
