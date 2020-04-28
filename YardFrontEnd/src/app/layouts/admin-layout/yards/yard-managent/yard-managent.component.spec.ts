import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YardManagentComponent } from './yard-managent.component';

describe('YardManagentComponent', () => {
  let component: YardManagentComponent;
  let fixture: ComponentFixture<YardManagentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YardManagentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YardManagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
