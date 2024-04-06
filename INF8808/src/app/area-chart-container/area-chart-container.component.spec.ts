import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaChartContainerComponent } from './area-chart-container.component';

describe('AreaChartContainerComponent', () => {
  let component: AreaChartContainerComponent;
  let fixture: ComponentFixture<AreaChartContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaChartContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaChartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
