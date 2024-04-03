import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WaffleChartContainerComponent } from './waffle-chart-container/waffle-chart-container.component';
import { WaffleChartComponent } from './waffle-chart/waffle-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    WaffleChartContainerComponent,
    WaffleChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
