import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedPlotComponent } from './connected-plot.component';

describe('ConnectedPlotComponent', () => {
  let component: ConnectedPlotComponent;
  let fixture: ComponentFixture<ConnectedPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectedPlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
