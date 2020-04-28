import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageYardDataComponent } from './manage-yard-data.component';

describe('ManageYardDataComponent', () => {
  let component: ManageYardDataComponent;
  let fixture: ComponentFixture<ManageYardDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageYardDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageYardDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
