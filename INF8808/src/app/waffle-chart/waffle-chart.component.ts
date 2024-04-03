import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

type DataType = {
  GROUPE_AGE: string;
  NB_LESION: number;
};

@Component({
  selector: 'app-waffle-chart',
  templateUrl: './waffle-chart.component.html',
  styleUrls: ['./waffle-chart.component.scss'],
})
export class WaffleChartComponent implements OnInit {
  constructor() {}

  private svg: any;
  private width = 0;
  private height = 0;
  private data: DataType[] = [];
  private totalValue = 0;
  private margin = { top: 10, right: 10, bottom: 10, left: 10 };

  ngOnInit(): void {
    d3.text('/assets/data/Viz 3/groupe_age_lesion.csv').then((data) => {
      let rowIndex = 0;
      const parsedData: DataType[] = d3
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
        .filter((d) => d !== null) as DataType[];
      this.data = parsedData;
      const container = document.getElementById('div-waffle-chart') as HTMLElement;

      this.width = container.offsetWidth - this.margin.left - this.margin.right;
      this.height = container.offsetHeight - this.margin.top - this.margin.bottom;


      this.createSvg();
      this.data.forEach((d) => (this.totalValue += d.NB_LESION));
      this.data.forEach((d, i) => this.drawWaffle(d, i));
      this.drawLegend();
    });
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#waffle')
      .append('svg')
      .attr('width', this.width - this.margin.left - this.margin.right)
      .attr('height', this.height - this.margin.top - this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private addAgeText(chart: any, data: DataType, chartSize: number): void {
    const ageText = data.GROUPE_AGE.replace(/(\d+)/g, '$1 ANS');
    chart
      .append('text')
      .attr('x', chartSize / 2)
      .attr('y', -12) // position the text 10px above the chart
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', `${this.width * 0.013}px`)
      .attr('fill', '#00408B')
      .text(ageText);
  }

  private addValueText(chart: any, data: DataType, chartSize: number): void {
    chart
      .append('text')
      .attr('x', chartSize / 2)
      .attr('y', chartSize / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', `${this.width * 0.02}px`)
      .attr('fill', '#00408B')
      .text(`${Math.round((100 * data.NB_LESION) / this.totalValue)}%`);
  }

  private drawWaffle(data: DataType, index: number): void {
    const rows = 10;
    const cols = 10;
    const chartSpacing = this.width * 0.02;
    const chartSize =
      (this.width - (this.data.length + 2) * chartSpacing) / this.data.length;

    const waffle = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${chartSpacing + index * (chartSize + chartSpacing)}, ${
          (this.height - chartSize) / 2
        })`
      );

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        waffle
          .append('rect')
          .attr('x', j * (chartSize / cols))
          .attr('y', (rows - 1 - i) * (chartSize / rows)) // flip the y position
          .attr('width', chartSize / cols)
          .attr('height', chartSize / rows)
          .attr(
            'fill',
            ((i * cols + j) * this.totalValue) / 100 < data.NB_LESION
              ? '#674FFA'
              : '#E7E7E7'
          )
          .attr('stroke', '#fff')
          .attr('stroke-width', 3);
      }
    }

    this.addAgeText(waffle, data, chartSize);
    this.addValueText(waffle, data, chartSize);
  }

  private drawLegend(): void {
    const chartSize =
      (this.width - (this.data.length + 2) * this.width * 0.02) /
      this.data.length;
    const legendY =
      (this.height - chartSize) / 2 + chartSize + this.height * 0.05;

    const legend = this.svg
      .append('g')
      .attr('transform', `translate(${this.width / 2 - this.margin.right - this.margin.left}, ${legendY})`)
      .attr('text-anchor', 'middle');

    legend
      .append('text')
      .text(`1 carré = ${this.totalValue / 100} lésions`)
      .attr('font-size', '18px')
      .attr('fill', '#00408B');
  }
}
