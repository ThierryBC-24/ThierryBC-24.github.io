import { viz1_data } from 'data/Viz 1/lesions_secteur_annee.constants';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { sectorNameMapping } from 'src/constants';

interface DataPoint {
  ANNEE: number;
  NB_LESION: number;
}

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements AfterViewInit {
  @Input() color!: string;
  @Input() data!: DataPoint[];
  @Input() sector!: string;
  @Input() id!: number;

  maxY: number = 0;
  private svg: any;
  private margin = 5;
  private width = 120 - this.margin * 2;
  private height = 50 - this.margin * 2;
  constructor() {}

  ngAfterViewInit(): void {
    this.maxY = Math.max(...this.data.map((d) => d.NB_LESION));
    this.createSvg();
    this.drawPlot();
  }

  shortenSectorName() {
    return sectorNameMapping[this.sector] ?? this.sector;
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#area-' + this.id)
      .append('svg')
      .style('position', 'relative')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .style('overflow', 'visible')
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

    const last = this.data[this.data.length - 1];
    const first = this.data[0];
    const ratio = (last.NB_LESION - first.NB_LESION) / first.NB_LESION;

    // Add text over the last data point
    this.svg
      .append('text')
      .text(`${Math.round(ratio * 100)}%`)
      .attr('x', x(last.ANNEE))
      .attr('y', y(last.NB_LESION) - 10)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '12px')
      .style('fill', this.color)
      .style('z-index', 0)
      .style('pointer-events', 'none')
      .style('font-weight', 'bold');

    const tooltip = d3
      .select('figure#area-' + this.id)
      .style('position', 'relative')
      .append('div')
      .style('opacity', 0);
    const color = this.color;
    this.svg
      .selectAll('circle')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => x(d.ANNEE))
      .attr('cy', (d: any) => y(d.NB_LESION))
      .attr('r', 6)
      .attr('fill', 'transparent')
      .style('z-index', 999)
      .style('padding', '10px')
      .on('mouseover', function (event: Event, d: any) {
        const circle = event.currentTarget as SVGElement;
        circle.setAttribute('fill', color);

        const [xPos, yPos] = d3.pointer(event);
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip
          .html(
            `<div style='background: ${color}'></div>${d.ANNEE} - ${d.NB_LESION}`
          )
          .style('position', 'absolute')
          .style('left', xPos + 'px')
          .style('top', -35 + 'px')
          .classed('tooltip-area', true);
      })
      .on('mouseout', function (event: Event, d: any) {
        tooltip.transition().duration(100).style('opacity', 0);
        const circle = event.currentTarget as SVGElement;
        circle.setAttribute('fill', 'transparent');
      });
  }
}
