import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-waffle-chart',
  templateUrl: './waffle-chart.component.html',
  styleUrls: ['./waffle-chart.component.scss'],
})
export class WaffleChartComponent implements OnInit {
  constructor() {}

  private svg: any;
  private width = window.innerWidth;
  private height = window.innerHeight;
  private data = [
    {
      age: 'Moins de 20 ans',
      value: 3200,
    },
    {
      age: '20 ans à 24 ans',
      value: 12800,
    },
    {
      age: '25 ans à 34 ans',
      value: 33600,
    },
    {
      age: '35 ans à 44 ans',
      value: 36800,
    },
    {
      age: '45 ans à 54 ans',
      value: 35200,
    },
    {
      age: '55 ans à 64 ans',
      value: 28800,
    },
    {
      age: '65 ans ou plus',
      value: 9600,
    },
  ];
  private totalValue = 0;

  ngOnInit(): void {
    this.createSvg();
    this.data.forEach((d) => (this.totalValue += d.value));
    this.data.forEach((d, i) => this.drawWaffle(d, i));
    this.drawLegend();
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#waffle')
      .append('svg')
      .attr('width', this.width - 24)
      .attr('height', this.height - 24)
      .append('g')
      .attr('transform', `translate(0,0)`);
  }

  private drawWaffle(data: any, index: number): void {
    const rows = 10;
    const cols = 10;
    const chartSpacing = this.width * 0.02; // adjust this value to change the spacing
    const chartSize =
      (this.width - (this.data.length + 2) * chartSpacing) / this.data.length; // updated

    const waffle = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${chartSpacing + index * (chartSize + chartSpacing)}, ${
          (this.height - chartSize) / 2
        })`
      );

    // Add age text above the chart
    waffle
      .append('text')
      .attr('x', chartSize / 2)
      .attr('y', -12) // position the text 10px above the chart
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', `${this.width * 0.013}px`)
      .attr('fill', '#00408B')
      .text(data.age);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        waffle
          .append('rect')
          .attr('x', j * (chartSize / cols))
          .attr('y', (rows - 1 - i) * (chartSize / rows)) // flip the y position
          .attr('width', chartSize / cols)
          .attr('height', chartSize / rows)
          .attr('fill', (i * cols + j) * 1600 < data.value ? '#674FFA' : '#E7E7E7')
          .attr('stroke', '#fff')
          .attr('stroke-width', 3);
      }
    }

    // Add text to the center of the chart
    waffle
      .append('text')
      .attr('x', chartSize / 2)
      .attr('y', chartSize / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', `${this.width * 0.02}px`)
      .attr('fill', '#00408B')
      .text(`${(100 * data.value) / this.totalValue}%`);
  }

  private drawLegend(): void {
    const chartSize = (this.width - (this.data.length + 2) * this.width * 0.02) / this.data.length;
    const legendY = (this.height - chartSize) / 2 + chartSize + this.height * 0.05; // adjust this value to change the padding
  
    const legend = this.svg.append('g')
      .attr('transform', `translate(${this.width / 2}, ${legendY})`)
      .attr('text-anchor', 'middle');
  
    // Add the text
    legend.append('text')
      .text(`1 carré = ${this.totalValue / 100} lésions`)
      .attr('font-size', '18px')
      .attr('fill', '#00408B');
  }
}
