import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

type AgeData = {
  GROUPE_AGE: string;
  NB_LESION: number;
};

/**
 * Represents the component for the waffle chart container.
 */
@Component({
  selector: 'app-waffle-chart-container',
  templateUrl: './waffle-chart-container.component.html',
  styleUrls: ['./waffle-chart-container.component.scss'],
})
export class WaffleChartContainerComponent implements OnInit {
  constructor() {}

  /**
   * The width of the chart.
   */
  public width = 0;

  /**
   * The height of the chart.
   */
  private height = 0;

  /**
   * The data for the chart.
   */
  public data: AgeData[] = [];

  /**
   * The total value of the chart.
   */
  public totalValue = 0;

  /**
   * The legend for the chart.
   */
  public legend: string = '';

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    d3.text('/assets/data/Viz 3/groupe_age_lesion.csv').then((data) => {
      let rowIndex = 0;
      const parsedData: AgeData[] = d3
        .csvParseRows(data, (d: any) => {
          rowIndex++;
          if (rowIndex === 1) {
            return null;
          }
          const columns = d[0].split(';');
          return {
            GROUPE_AGE: columns[0],
            NB_LESION: +columns[1],
          };
        })
        .filter((d) => d !== null) as AgeData[];
      this.data = parsedData;
      this.data.forEach((d) => (this.totalValue += d.NB_LESION));
      this.legend = '1 carré = ' + Math.round(this.totalValue / 100 / 100) * 100 + ' lésions';
    });
  }
}
