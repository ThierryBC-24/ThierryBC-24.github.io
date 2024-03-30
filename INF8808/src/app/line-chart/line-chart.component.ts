import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

interface RisksData {
  ANNEE: number;
  'RISQUES ERGONOMIQUES': number;
  'RISQUES PSYCHOSOCIAUX': number;
  'EXPOSITION AU BRUIT': number;
  'CHUTES DE MEME NIVEAU': number;
  'FRAPPE, COINCE OU ECRASE PAR UN OBJET': number;
}

const RISK_NAMES: (keyof RisksData)[] = [
  'RISQUES ERGONOMIQUES',
  'RISQUES PSYCHOSOCIAUX',
  'EXPOSITION AU BRUIT',
  'CHUTES DE MEME NIVEAU',
  'FRAPPE, COINCE OU ECRASE PAR UN OBJET',
];

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  private svg: any;
  private margin = { top: 50, right: 50, bottom: 50, left: 50 };
  private width: number = 0;
  private height: number = 0;
  private colorScale = d3
    .scaleOrdinal()
    .domain(RISK_NAMES)
    .range(d3.schemeCategory10); // Use a categorical color scheme

  constructor() {}

  ngOnInit(): void {
    this.initializeSvg();
    this.drawChart();
  }

  private initializeSvg(): void {
    const container = document.getElementById(
      'line-chart-container'
    ) as HTMLElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const margin = {
      top: 0.25 * containerHeight,
      right: 0.25 * containerWidth,
      bottom: 0.25 * containerHeight,
      left: 0.25 * containerWidth,
    };

    this.width = containerWidth - margin.left - margin.right;
    this.height = containerHeight - margin.top - margin.bottom;

    this.svg = d3
      .select('figure#line')
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  }

  private drawChart(): void {
    d3.text('/assets/data/Viz 7/annee_risques.csv')
      .then((data) => {
        const parsedData: RisksData[] = this.parseCsvData(data);

        this.prepareData(parsedData);

        const xScale = this.createXScale(parsedData);
        const yScale = this.createYScale(parsedData);

        this.drawLines(parsedData, xScale, yScale);
        this.drawAxes(xScale, yScale);
        this.drawLabels();
      })
      .catch((error) => {
        console.log('Error loading the data: ' + error);
      });
  }

  private parseCsvData(data: string): RisksData[] {
    let rowIndex = 0;
    return d3
      .csvParseRows(data, (d: any) => {
        rowIndex++;
        if (rowIndex === 1) {
          return null; // Skip the header row
        }
        const columns = d[0].split(';');
        return {
          ANNEE: +columns[0],
          'RISQUES ERGONOMIQUES': +columns[1],
          'RISQUES PSYCHOSOCIAUX': +columns[2],
          'EXPOSITION AU BRUIT': +columns[3],
          'CHUTES DE MEME NIVEAU': +columns[4],
          'FRAPPE, COINCE OU ECRASE PAR UN OBJET': +columns[5],
        };
      })
      .filter((d) => d !== null) as RisksData[];
  }

  private prepareData(parsedData: RisksData[]): void {
    parsedData.forEach((d) => {
      const totalRisks =
        d['RISQUES ERGONOMIQUES'] +
        d['RISQUES PSYCHOSOCIAUX'] +
        d['EXPOSITION AU BRUIT'] +
        d['CHUTES DE MEME NIVEAU'] +
        d['FRAPPE, COINCE OU ECRASE PAR UN OBJET'];

      Object.keys(d).forEach((key) => {
        if (key !== 'ANNEE') {
          const riskKey = key as keyof RisksData;
          d[riskKey] = (d[riskKey] / totalRisks) * 100;
        }
      });
    });
  }

  private createXScale(parsedData: RisksData[]): any {
    const yearExtent = d3.extent(parsedData, (d) => d.ANNEE) as [
      number,
      number
    ];
    const yearRange = yearExtent[1] - yearExtent[0];
    const padding = yearRange * 0.05;

    return d3
      .scaleLinear()
      .domain([yearExtent[0] - padding, yearExtent[1] + padding])
      .range([0, this.width]);
  }

  private createYScale(parsedData: RisksData[]): any {
    const valuesWithoutYear: number[] = parsedData.flatMap((d) =>
      Object.values(d).filter((value, index) => index !== 0)
    );

    const minYValue = d3.min(valuesWithoutYear) || 0;
    const maxYValue = d3.max(valuesWithoutYear) || 0;

    return d3
      .scaleLinear()
      .domain([minYValue, maxYValue + 5])
      .range([this.height, 0]);
  }

  private drawLines(parsedData: RisksData[], xScale: any, yScale: any): void {
    RISK_NAMES.forEach((risk: keyof RisksData) => {
      const line = d3
        .line<RisksData>()
        .x((d) => xScale(d.ANNEE))
        .y((d) => yScale(d[risk]));

      this.svg
        .append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', () => this.colorScale(risk))
        .attr('stroke-width', 2)
        .attr('d', line);

      this.svg
        .selectAll(`dot-${risk}`)
        .data(parsedData)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', (d: RisksData) => xScale(d.ANNEE))
        .attr('cy', (d: RisksData) => yScale(d[risk]))
        .style('fill', () => this.colorScale(risk));
    });

    this.drawLegend(RISK_NAMES);
  }

  private drawAxes(xScale: any, yScale: any): void {
    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(7)
          .tickFormat((value) => value.toString())
      )
  
    this.svg
      .append('g')
      .call(d3.axisLeft(yScale).tickSize(-this.width).tickFormat((value) => `${value}%`))
      .attr('stroke-opacity', 0.2)
  }

  /*private drawAxes(xScale: any, yScale: any): void {
    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(7)
          .tickFormat((value) => value.toString())
      ); // Use "d" format for whole numbers
  
    this.svg
      .append('g')
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-this.width) // This creates the horizontal lines across the plot area
          .tickFormat(null) // This removes the tick labels
      )
      .call((g: any) => g.select('.domain').remove()) // This removes the vertical line on y axis
      .selectAll('.tick line') // select all the horizontal tick lines
      .attr('stroke-opacity', 0.2) // make them less dark
      .attr('stroke-dasharray', '2,2'); // make them dashed lines
  }*/

  private drawLegend(risks: (keyof RisksData)[]): void {
    const legend = this.svg
      .append('g')
      .attr('transform', `translate(${this.width + this.margin.right},${20})`);

    legend
      .selectAll('.legend-item')
      .data(risks)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d: string, i: number) => `translate(0,${i * 20})`);

    legend
      .selectAll('.legend-item')
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d: string) => this.colorScale(d));

    legend
      .selectAll('.legend-item')
      .append('text')
      .attr('x', 15)
      .attr('y', 10)
      .text((d: string) => d);
  }

  private drawLabels(): void {
    this.svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Percentage of Risks');

    this.svg
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Line Chart of Risks Over Years');
  }
}
