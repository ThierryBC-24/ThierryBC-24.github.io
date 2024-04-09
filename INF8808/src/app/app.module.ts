import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BubbleBarChartComponent } from './bubble-bar-chart/bubble-bar-chart.component';
import { WaffleChartContainerComponent } from './waffle-chart-container/waffle-chart-container.component';
import { WaffleChartComponent } from './waffle-chart/waffle-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { AreaChartContainerComponent } from './area-chart-container/area-chart-container.component';

@NgModule({
  declarations: [
    AppComponent,
    BubbleBarChartComponent,
    WaffleChartContainerComponent,
    WaffleChartComponent,
    AreaChartComponent,
    AreaChartContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
