import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProviderContractsComponent } from './manage-provider-contracts.component';

describe('ManageProviderContractsComponent', () => {
  let component: ManageProviderContractsComponent;
  let fixture: ComponentFixture<ManageProviderContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProviderContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProviderContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
