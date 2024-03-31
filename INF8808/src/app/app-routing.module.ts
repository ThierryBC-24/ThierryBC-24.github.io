import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Viz2Component } from './viz2/viz2.component';

const routes: Routes = [
  { path: 'viz2', component: Viz2Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
