import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBeneficiarieContactsComponent } from './manage-beneficiarie-contacts.component';

describe('ManageBeneficiarieContactsComponent', () => {
  let component: ManageBeneficiarieContactsComponent;
  let fixture: ComponentFixture<ManageBeneficiarieContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageBeneficiarieContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBeneficiarieContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
