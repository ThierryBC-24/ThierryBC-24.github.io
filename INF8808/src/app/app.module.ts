import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Viz2Component } from './viz2/viz2.component';
import { BubbleBarChartComponent } from './bubble-bar-chart/bubble-bar-chart.component';
import { WaffleChartContainerComponent } from './waffle-chart-container/waffle-chart-container.component';
import { WaffleChartComponent } from './waffle-chart/waffle-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { AreaChartContainerComponent } from './area-chart-container/area-chart-container.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ConnectedPlotComponent } from './connected-plot/connected-plot.component';

@NgModule({
  declarations: [
    AppComponent,
    Viz2Component,
    BubbleBarChartComponent,
    WaffleChartContainerComponent,
    WaffleChartComponent,
    AreaChartComponent,
    AreaChartContainerComponent,
    LineChartComponent,
    ConnectedPlotComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
