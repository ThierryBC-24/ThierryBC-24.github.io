import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleBarChartComponent } from './bubble-bar-chart.component';

describe('BubbleBarChartComponent', () => {
  let component: BubbleBarChartComponent;
  let fixture: ComponentFixture<BubbleBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BubbleBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
