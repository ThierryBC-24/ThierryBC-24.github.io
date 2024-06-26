import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

interface RisksData {
  ANNEE: number;
  'RISQUES ERGONOMIQUES': number;
  'RISQUES PSYCHOSOCIAUX': number;
  'EXPOSITION AU BRUIT': number;
  'CHUTES DE MEME NIVEAU': number;
  'FRAPPE, COINCE OU ECRASE PAR UN OBJET': number;
  TOTAL: number;
}

const RISK_NAMES: (keyof RisksData)[] = [
  'RISQUES ERGONOMIQUES',
  'RISQUES PSYCHOSOCIAUX',
  'EXPOSITION AU BRUIT',
  'CHUTES DE MEME NIVEAU',
  'FRAPPE, COINCE OU ECRASE PAR UN OBJET',
];

/**
 * Represents the LineChartComponent class.
 * This component displays a line chart with data from a CSV file.
 */
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  private svg: any;
  private margin = { top: 25, right: 25, bottom: 25, left: 25 };
  private width: number = 0;
  private height: number = 0;
  private colorScale = d3
    .scaleOrdinal()
    .domain(RISK_NAMES)
    .range(['#674FFA', '#A999CD', '#EF26C9', '#FFC44D', '#009E75']);

  private xScale: any;
  private yScale: any;
  private data: RisksData[] = [];

  constructor() {}

  /**
   * Initializes the SVG container for the line chart.
   */
  ngOnInit(): void {
    this.initializeSvg();
    this.drawBackground();
    this.drawChart();
  }

  /**
   * Initializes the SVG container for the line chart.
   */
  private initializeSvg(): void {
    const container = document.getElementById('line-chart') as HTMLElement;

    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = container.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3
      .select('figure#line')
      .append('svg')
      .attr('width', container.offsetWidth)
      .attr('height', container.offsetHeight)
      .append('g')
      .attr('transform', `translate(0, 0)`);
  }

  /**
   * Draws the line chart.
   */
  private drawChart(): void {
    d3.text('/assets/data/Viz 7/annee_risques.csv')
      .then((data) => {
        const parsedData: RisksData[] = this.parseCsvData(data);
        this.data = parsedData;

        this.prepareData(parsedData);

        const xScale = this.createXScale(parsedData);
        const yScale = this.createYScale(parsedData);

        this.drawLines(parsedData, xScale, yScale);
        this.drawAxes(xScale, yScale);
        this.drawLabels();
        this.drawLegend(RISK_NAMES);
      })
      .catch((error) => {
        console.log('Error loading the data: ' + error);
      });
  }

  /**
   * Parses the CSV data.
   */
  private parseCsvData(data: string): RisksData[] {
    let rowIndex = 0;
    return d3
      .csvParseRows(data, (d: any) => {
        rowIndex++;
        if (rowIndex === 1) {
          return null;
        }
        const columns = d[0].split(';');
        return {
          ANNEE: +columns[0],
          'RISQUES ERGONOMIQUES': +columns[1],
          'RISQUES PSYCHOSOCIAUX': +columns[2],
          'EXPOSITION AU BRUIT': +columns[3],
          'CHUTES DE MEME NIVEAU': +columns[4],
          'FRAPPE, COINCE OU ECRASE PAR UN OBJET': +columns[5],
          TOTAL: +columns[6],
        };
      })
      .filter((d) => d !== null) as RisksData[];
  }

  /**
   * Modifies the data parsed from the csv to be useable for the line chart.
   */
  private prepareData(parsedData: RisksData[]): void {
    parsedData.forEach((d) => {
      const totalRisks = d['TOTAL'];

      Object.keys(d).forEach((key) => {
        if (key !== 'ANNEE' && key !== 'TOTAL') {
          const riskKey = key as keyof RisksData;
          d[riskKey] = (d[riskKey] / totalRisks) * 100;
        }
      });
    });
  }

  /**
   * Creates the X scale for the line chart.
   */
  private createXScale(parsedData: RisksData[]): any {
    const yearExtent = d3.extent(parsedData, (d) => d.ANNEE) as [
      number,
      number
    ];
    const yearRange = yearExtent[1] - yearExtent[0];
    const padding = yearRange * 0.05;
    this.xScale = d3
      .scaleLinear()
      .domain([yearExtent[0] - padding, yearExtent[1] + padding])
      .range([this.margin.left, this.width - this.margin.right]);

    return this.xScale;
  }

  /**
   * Creates the Y scale for the line chart.
   */
  private createYScale(parsedData: RisksData[]): any {
    const scaledValues: number[] = parsedData.flatMap((d) =>
      Object.entries(d)
        // Filter out the pairs where the key is either 'ANNEE' or 'TOTAL'
        .filter(([key, value]) => key !== 'ANNEE' && key !== 'TOTAL')
        // Map to get only the values
        .map(([key, value]) => value)
    );

    const minYValue = d3.min(scaledValues) || 0;
    const maxYValue = d3.max(scaledValues) || 0;

    this.yScale = d3
      .scaleLinear()
      .domain([minYValue, maxYValue + 5])
      .range([this.height - this.margin.top, this.margin.bottom]);

    return this.yScale;
  }

  /**
   * Draws the lines for the line chart.
   */
  private drawLines(parsedData: RisksData[], xScale: any, yScale: any): void {
    RISK_NAMES.forEach((risk: keyof RisksData) => {
      const line = d3
        .line<RisksData>()
        .x((d) => xScale(d.ANNEE))
        .y((d) => yScale(d[risk]));

      let g = this.svg.append('g');

      g.append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', () => this.colorScale(risk))
        .attr('stroke-width', 2)
        .attr('class', `line-${risk.replace(/ /g, '-')}`)
        .attr('d', line)
        .on('mouseover', () => {
          this.handleHover(risk);
        })
        .on('mouseout', () => {
          this.handleOut();
        });

      let self = this;
      g.selectAll(`dot`)
        .data(parsedData)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', (d: RisksData) => xScale(d.ANNEE))
        .attr('cy', (d: RisksData) => yScale(d[risk]))
        .attr('class', `dot-${risk.replace(/ /g, '-')}`)
        .style('fill', () => this.colorScale(risk))
        .on('mouseover', function (this: SVGCircleElement) {
          self.handleHover(risk, this);
        })
        .on('mouseout', () => {
          this.handleOut();
        });
    });
  }

  /**
   * Draws the axes for the line chart.
   */
  private drawAxes(xScale: any, yScale: any): void {
    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(7)
          .tickFormat((value) => value.toString())
          .tickSize(0)
          .tickPadding(10)
      );

    this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-this.width + this.margin.left + this.margin.right)
          .tickFormat((value) => `${value}%`)
      )
      .attr('stroke-opacity', 0.2);
  }

  /**
   * Draws the legend for the line chart.
   */
  private drawLegend(risks: (keyof RisksData)[]): void {
    const legend = d3
      .select('figure#legend-line-chart')
      .append('svg')
      .attr('width', 280)
      .attr('height', 20 * 5 + 12 * 5)
      .append('g')
      .attr('transform', `translate(0,${this.margin.top})`);

    legend
      .selectAll('.legend-item')
      .data(risks)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d: string, i: number) => `translate(0,${i * 20})`)
      .each(function (this: any, d: string) {
        d3.select(this).classed(d, true);
      });

    legend
      .selectAll('.legend-item')
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d: any) => this.colorScale(d) as string);

    legend
      .selectAll('.legend-item')
      .append('text')
      .attr('x', 15)
      .attr('y', 10)
      .style('font-size', '12px')
      .text((d: any) => d);
  }

  private drawLabels(): void {
    this.svg
      .append('text')
      .attr('x', (this.width - this.margin.left) / 2)
      .attr('y', this.margin.top - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(
        'Évolution du nombre de lésions liés aux risques prioritaires (2016-2022)'
      );
  }

  /**
   * Draws the background of the line chart representing before and after the changes made by the CNESST.
   */
  private drawBackground(): void {
    this.svg
      .append('rect')
      .attr('x', this.margin.left)
      .attr(
        'width',
        (4 * (this.width - this.margin.left - this.margin.right)) / 7
      )
      .attr('height', this.height - this.margin.top - this.margin.bottom)
      .attr('y', this.margin.top)
      .attr('fill', '#BBC8DE')
      .style('opacity', 0.5);
  }

  /**
   * Changes the opacity of the lines and circles in the line chart.
   */
  private changeOpacity(risk: keyof RisksData, opacity: number): void {
    d3.selectAll("circle[class*='dot']").style('opacity', opacity);
    d3.selectAll("path[class*='line']").style('opacity', opacity);
    d3.selectAll(`g[class^='legend-item']`).style('opacity', opacity);
    d3.selectAll(`circle[class*='dot-${risk.replace(/ /g, '-')}']`).style(
      'opacity',
      1
    );
    d3.selectAll(`path[class*='line-${risk.replace(/ /g, '-')}']`).style(
      'opacity',
      1
    );
    d3.selectAll(`g[class='legend-item ${risk}']`).style('opacity', 1);
  }

  /**
   * Handles the hover event on the line chart.
   */
  private handleHover(risk: keyof RisksData, circle?: SVGCircleElement): void {
    this.changeOpacity(risk, 0.3);

    if (circle) {
      const data: RisksData = d3.select(circle).datum() as RisksData;
      let g = d3.select(circle.parentNode as SVGGElement);

      this.addShadow();

      let group = g.append('g').attr('class', 'tooltip');
      let colorRect = group
        .append('rect')
        .attr('y', circle.cy.baseVal.value - 15 - 10)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', this.colorScale(risk) as string);

      let tooltipText = group
        .append('text')
        .attr('y', circle.cy.baseVal.value - 15)
        .text(`${data.ANNEE} - ${data[risk].toFixed(2)}%`)
        .attr('class', 'tooltip')
        .style('font-size', '14px')
        .style('opacity', '1');

      let bbox = (group.node() as SVGTextElement).getBBox();

      let newX = circle.cx.baseVal.value - 45;
      if (newX < 21) {
        newX = 21;
      } else if (newX + bbox.width > this.width) {
        newX = this.width - bbox.width;
      }

      tooltipText.attr('x', newX);
      colorRect.attr('x', newX - 15);
      colorRect.raise();

      bbox = (group.node() as SVGTextElement).getBBox();

      group
        .insert('rect', 'text')
        .attr('x', bbox.x - 5)
        .attr('y', bbox.y - 2)
        .attr('width', bbox.width + 10)
        .attr('height', bbox.height + 4)
        .style('fill', 'white')
        .style('opacity', '1')
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('filter', 'url(#dropshadow)')
        .attr('class', 'tooltip');

      g.raise();
    }
  }

  /**
   * Adds a shadow to the tooltip.
   */
  private addShadow(): void {
    const defs = this.svg.append('defs');
    const filter = defs.append('filter').attr('id', 'dropshadow');

    filter
      .append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 0.5)
      .attr('result', 'blur');

    filter
      .append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('result', 'offsetBlur');

    var feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode').attr('in', 'offsetBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  }

  /**
   * Handles the mouseout event on the line chart.
   */
  private handleOut(): void {
    d3.selectAll("circle[class*='dot']").style('opacity', 1);
    d3.selectAll("path[class*='line']").style('opacity', 1);
    d3.selectAll(`g[class^='legend-item']`).style('opacity', 1);
    d3.selectAll('.tooltip').remove();
  }
}
