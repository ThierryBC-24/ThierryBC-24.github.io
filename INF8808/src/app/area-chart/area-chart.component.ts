import { viz1_data } from 'data/Viz 1/lesions_secteur_annee.constants';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

interface DataPoint {
  ANNEE: number;
  NB_LESION: number;
}

enum Colors {
  INCREASING = '#D92C2C',
  STABLE = '#E68004',
  DECREASING = '#14B8A6',
}

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent {
  originalData: {
    ANNEE: number;
    SECTEUR_SCIAN: string;
    NB_LESION: number;
  }[];
  color: Colors = Colors.DECREASING;
  data!: DataPoint[];
  maxY: number = 0;
  private svg: any;
  private margin = 5;
  private width = 100 - this.margin * 2;
  private height = 50 - this.margin * 2;
  constructor() {
    this.originalData = viz1_data;
  }

  ngOnInit(): void {
    const groupedData = this.groupDataBySecteur();
    const preparedData = this.prepareDataForD3(groupedData);
    this.data = preparedData[0].data;
    this.maxY = Math.max(...this.data.map((d) => d.NB_LESION));
    this.createSvg();
    this.drawPlot();
  }

  private groupDataBySecteur(): Map<
    string,
    { ANNEE: number; NB_LESION: number }[]
  > {
    const groupedData = new Map<
      string,
      { ANNEE: number; NB_LESION: number }[]
    >();

    this.originalData.forEach((item) => {
      if (!groupedData.has(item.SECTEUR_SCIAN)) {
        groupedData.set(item.SECTEUR_SCIAN, []);
      }
      groupedData
        .get(item.SECTEUR_SCIAN)!
        .push({ ANNEE: item.ANNEE, NB_LESION: item.NB_LESION });
    });

    return groupedData;
  }

  private prepareDataForD3(
    groupedData: Map<string, { ANNEE: number; NB_LESION: number }[]>
  ): { SECTEUR_SCIAN: string; data: { ANNEE: number; NB_LESION: number }[] }[] {
    const preparedData: any = [];

    groupedData.forEach((values, key) => {
      const sortedValues = values.sort((a, b) => a.ANNEE - b.ANNEE);
      preparedData.push({ SECTEUR_SCIAN: key, data: sortedValues });
    });

    return preparedData;
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#area')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawPlot(): void {
    const x = d3.scaleLinear().domain([2016, 2022]).range([0, this.width]);
    const y = d3.scaleLinear().domain([0, this.maxY]).range([this.height, 0]);

    const area = d3
      .area()
      .x((d: any) => x(d.ANNEE))
      .y0(this.height)
      .y1((d: any) => y(d.NB_LESION))
      .curve(d3.curveCatmullRom);

    // Add area
    this.svg
      .append('path')
      .datum(this.data)
      .attr('fill', this.color)
      .attr('opacity', 0.3)
      .attr('d', area);

    // // Add labels
    // const dots = this.svg.append('g');
    // dots
    //   .selectAll('text')
    //   .data(this.data)
    //   .enter()
    //   .append('text')
    //   .attr('x', (d: any) => x(d.ANNEE))
    //   .attr('y', (d: any) => y(d.NB_LESION));

    const line = d3
      .line()
      .x((d: any) => x(d.ANNEE))
      .y((d: any) => y(d.NB_LESION))
      .curve(d3.curveCatmullRom);

    // Add outline
    this.svg
      .append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', this.color) // Outline color
      .attr('stroke-width', 2) // Outline width
      .attr('d', line);
  }
}
