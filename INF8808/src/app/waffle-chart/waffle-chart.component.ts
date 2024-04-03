import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import * as d3 from 'd3';

type AgeData = {
  GROUPE_AGE: string;
  NB_LESION: number;
};

@Component({
  selector: 'app-waffle-chart',
  templateUrl: './waffle-chart.component.html',
  styleUrls: ['./waffle-chart.component.scss'],
})
export class WaffleChartComponent implements AfterViewInit {
  private svg: any;
  private width = 0;
  private height = 0;
  @Input() data!: AgeData;
  @Input() totalValue!: number;
  private marginTop = 25;
  public groupAgeId: string = '';
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.groupAgeId = 'figure-' + this.data.GROUPE_AGE.replace(/ /g, '-');
    this.cdr.detectChanges();
    const container = document.getElementById(
      this.data.GROUPE_AGE
    ) as HTMLElement;

    this.width = container.offsetWidth;
    this.height = container.offsetHeight + this.marginTop;

    this.createSvg();
    this.drawWaffle(this.data);
  }

  private createSvg(): void {
    this.svg = d3
      .select('#' + this.groupAgeId)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', `translate(0,0)`);

    this.addAgeText(this.svg, this.data);
  }

  private addAgeText(chart: any, data: AgeData): void {
    const ageText = data.GROUPE_AGE.replace(/(\d+)/g, '$1 ANS');
    chart
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', this.marginTop / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', `${this.width * 0.1}px`)
      .attr('fill', '#00408B')
      .text(ageText);
  }

  private addValueText(chart: any, data: AgeData): void {
    chart
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', (this.height - this.marginTop) / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', `${this.width * 0.13}px`)
      .attr('fill', '#00408B')
      .text(`${Math.round((100 * data.NB_LESION) / this.totalValue)}%`);
  }

  private drawWaffle(data: AgeData): void {
    const rows = 10;
    const cols = 10;

    const waffle = this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.marginTop})`);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        waffle
          .append('rect')
          .attr('x', j * (this.width / cols))
          .attr('y', (rows - 1 - i) * ((this.height - this.marginTop) / rows))
          .attr('width', this.width / cols)
          .attr('height', this.height / rows)
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

    this.addValueText(waffle, data);
  }
}
