import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Lesion } from './data';

const NATURE_Y_FORCE = 140000;
const GENRE_Y_FORCE = 60000;
const LABEL_CUTOFF = 200;

@Component({
  selector: 'app-bubble-bar-chart',
  templateUrl: './bubble-bar-chart.component.html',
  styleUrls: ['./bubble-bar-chart.component.scss'],
})
export class BubbleBarChartComponent implements OnInit {
  private data: Lesion[] = [];
  private dataPaths = [
    '/assets/data/Viz 6/genre_categorie_lesion.csv',
    '/assets/data/Viz 5/nature_categorie_lesion.csv',
  ];

  private svg: any;
  private button: any;
  private tooltip: any;
  private margin = 150;
  private width = 2250;
  private height = 450;

  private xAxis: d3.ScaleBand<string> | undefined;
  private yAxis: d3.ScaleLinear<number, number> | undefined;
  private radiusScale: d3.ScaleLinear<number, number> | undefined;

  private currentOptionIndex = 0;
  private currentForce = GENRE_Y_FORCE;

  constructor() {}

  ngOnInit(): void {
    d3.text(this.dataPaths[this.currentOptionIndex]).then((data) => {
      let rowIndex = 0;
      for (const row of data.split('\n')) {
        rowIndex++;
        if (rowIndex === 1 || row === '') {
          continue;
        }
        const columns = row.split(';');
        this.data.push({
          genre: columns[0],
          categorie_genre: columns[1],
          nb_lesion: +columns[2],
        });
      }

      this.data.sort((a, b) => b.nb_lesion - a.nb_lesion);

      this.xAxis = this.setXScale();
      this.yAxis = this.setYScale();
      this.radiusScale = this.setLinearRadiusScale();

      this.createSvg();
      this.drawBubble();
      this.drawXAxis();
      this.drawLegend();
      this.button = this.drawButton();
      this.tooltip = this.createTooltip();

      const simulation = this.getSimulation();
      this.simulate(simulation);
    });
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#bubble-bar-chart')
      .style('margin', 0)
      .append('svg')
      .attr(
        'viewBox',
        `0 0 ${this.width + this.margin * 2} ${this.height + this.margin * 3}`
      )
      .append('g')
      .attr('transform', 'translate(' + 0 + ',' + 50 + ')');
  }

  // Scales

  private setXScale(): d3.ScaleBand<string> {
    return d3
      .scaleBand()
      .range([0, this.width])
      .domain(Array.from(new Set(this.data.map((d) => d.categorie_genre))))
      .padding(0.5);
  }

  private setYScale(): d3.ScaleLinear<number, number> {
    return d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.nb_lesion) as number])
      .range([this.height, 0]);
  }

  private setLinearRadiusScale(): d3.ScaleLinear<number, number> {
    return d3
      .scaleLinear()
      .domain([0, 264227]) // Hard coded max value to max of both datasets
      .range([10, 150]);
  }

  // Drawings

  private drawBubble(): void {
    this.svg
      .selectAll('.bubble')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', (d: any) => {
        d.x = (this.xAxis as d3.ScaleBand<string>)(d.categorie_genre) as number;
        return (this.xAxis as d3.ScaleBand<string>)(
          d.categorie_genre
        ) as number;
      })
      .attr('cy', (d: any) => {
        d.y = (this.yAxis as d3.ScaleLinear<number, number>)(
          this.currentForce
        ) as number;
        return (this.yAxis as d3.ScaleLinear<number, number>)(
          this.currentForce
        ) as number;
      })
      .attr('r', (d: any) =>
        (this.radiusScale as d3.ScaleLinear<number, number>)(d.nb_lesion)
      )
      .attr('opacity', 0.7)
      .style('fill', '#674FFA')
      .on('mouseenter', (event: any) =>
        this.showTooltip(event, event.target.__data__)
      )
      .on('mouseleave', (event: any) => this.hideTooltip(event));
  }

  private drawXAxis(): void {
    // Draw the X-axis on the DOM
    this.svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(this.xAxis as d3.ScaleBand<string>).tickSize(0))
      .selectAll('g')
      .attr('font-size', '1.5rem')
      .attr('font-family', 'sans-serif');

    // Iterate over each element in the x axis
    this.svg.selectAll('.x.axis g')._groups[0].forEach((element: any) => {
      const text = d3.select(element);

      // Split the text into an array of words
      const words = text.text().split(/\s+/).reverse();

      let word;
      let line = [] as any[];
      let lineHeight = 1;

      // Create a new tspan element and set its attributes
      let text2 = text.text(null).append('text');
      let tspan = text2
        .append('tspan')
        .attr('font-size', 1.5 + 'em')
        .attr('x', 0)
        .attr('y', 3)
        .attr('fill', '#070032');

      let firstRow = true;

      // Iterate over each word in the words array
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));

        // If the length of the tspan exceeds a certain threshold, create a new line
        if (tspan.node()!.getComputedTextLength() > LABEL_CUTOFF || firstRow) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text2
            .append('tspan')
            .attr('font-size', 1.3 + 'em')
            .attr('x', 0)
            .attr('y', 3)
            .attr('dy', lineHeight + 'em')
            .attr('fill', '#070032')
            .text(word);
          lineHeight += 1;
        }
        firstRow = false;
      }
    });

    // Remove the X-axis line
    this.svg.selectAll('.x.axis .domain').remove();
  }

  private drawButton(): any {
    const toggleButton = this.svg
      .append('g')
      .attr('class', 'toggle-button')
      .attr('transform', 'translate(' + (this.width - 100) + ',' + 100 + ')')
      .style('cursor', 'pointer');

    const buttons = toggleButton
      .selectAll('.button')
      .data(["Genres d'accidents", 'Natures de lésions'])
      .enter()
      .append('g')
      .attr('class', 'button')
      .attr(
        'transform',
        (d: any, i: any) => `translate(${i * (this.margin + 40)}, 0)`
      );

    buttons
      .append('rect')
      .attr('class', 'button')
      .attr('width', this.margin + 30)
      .attr('height', 80)
      .attr('fill', (d: any, i: any) => (i === 0 ? '#aba1f6' : '#f4f3fd'))
      .attr('x', (d: any, i: any) => (i === 0 ? 2 : -2))
      .attr('rx', 0)
      .on('click', this.toggleSelection);

    buttons
      .append('text')
      .attr('pointer-events', 'none')
      .attr('class', 'button-text')
      .append('tspan')
      .attr('class', 'button-text-first-row')
      .attr('fill', (d: any, i: any) => (i === 0 ? '#6350f1' : '#aba1f6'))
      .attr('x', 30) // Adjust x position to center text
      .attr('y', 37) // Adjust y position to vertically center text
      .text((d: any) => d.split(' ').slice(0, 1))
      .attr('font-size', '35px')
      .append('tspan')
      .attr('class', 'button-text-second-row')
      .attr('fill', (d: any, i: any) => (i === 0 ? '#6350f1' : '#aba1f6'))
      .attr('x', 7) // Adjust x position to center text
      .attr('y', 70) // Adjust y position to vertically center text
      .text((d: any) => d.split(' ').slice(1).join(' '))
      .attr('font-size', '35px');

    toggleButton
      .append('line')
      .attr('class', 'separator-line')
      .attr('x1', this.margin + 35)
      .attr('x2', this.margin + 35)
      .attr('y1', 0)
      .attr('y2', 80)
      .attr('stroke', '#d5d5d5')
      .attr('stroke-width', 8);

    return toggleButton;
  }

  private toggleSelection = (event: any, d: any) => {
    if (
      (d === "Genres d'accidents" && this.currentOptionIndex === 0) ||
      (d === 'Natures de lésions' && this.currentOptionIndex === 1)
    )
      return;

    if (d === "Genres d'accidents") {
      this.currentOptionIndex = 0;
      this.currentForce = GENRE_Y_FORCE;

      const genre_button = this.button
        .selectAll('.button')
        .filter((d: any) => d === "Genres d'accidents");
      genre_button.select('rect').attr('fill', '#aba1f6');
      genre_button.selectAll('tspan').attr('fill', '#6350f1');

      const nature_button = this.button
        .selectAll('.button')
        .filter((d: any) => d === 'Natures de lésions');
      nature_button.select('rect').attr('fill', '#f4f3fd');
      nature_button.selectAll('tspan').attr('fill', '#aba1f6');
    } else {
      this.currentOptionIndex = 1;
      this.currentForce = NATURE_Y_FORCE;

      const nature_button = this.button
        .selectAll('.button')
        .filter((d: any) => d === 'Natures de lésions');
      nature_button.select('rect').attr('fill', '#aba1f6');
      nature_button.selectAll('tspan').attr('fill', '#6350f1');

      const genre_button = this.button
        .selectAll('.button')
        .filter((d: any) => d === "Genres d'accidents");
      genre_button.select('rect').attr('fill', '#f4f3fd');
      genre_button.selectAll('tspan').attr('fill', '#aba1f6');
    }

    d3.selectAll(
      'figure#bubble-bar-chart svg g :not(.toggle-button, .button, .button-text, .separator-line, .button-text-first-row, .button-text-second-row'
    ).remove();
    d3.text(this.dataPaths[this.currentOptionIndex]).then((data) => {
      this.data = [];
      let rowIndex = 0;
      for (const row of data.split('\n')) {
        rowIndex++;
        if (rowIndex === 1 || row === '') {
          continue;
        }
        const columns = row.split(';');
        this.data.push({
          genre: columns[0],
          categorie_genre: columns[1],
          nb_lesion: +columns[2],
        });
      }

      this.data.sort((a, b) => b.nb_lesion - a.nb_lesion);

      this.xAxis = this.setXScale();
      this.yAxis = this.setYScale();
      this.radiusScale = this.setLinearRadiusScale();

      this.drawBubble();
      this.drawXAxis();
      this.drawLegend();

      const simulation = this.getSimulation();
      this.simulate(simulation);
    });
  };

  // Simulation

  private getSimulation() {
    return d3
      .forceSimulation(this.data as d3.SimulationNodeDatum[])
      .force(
        'x',
        d3
          .forceX()
          .x(
            (d: any) =>
              ((this.xAxis as d3.ScaleBand<string>)(
                d.categorie_genre
              ) as number) +
              (this.xAxis as d3.ScaleBand<string>).bandwidth() / 2
          )
      )
      .force(
        'y',
        d3
          .forceY()
          .y(
            (d: any) =>
              (this.yAxis as d3.ScaleLinear<number, number>)(
                this.currentForce
              ) as number
          )
      )
      .force(
        'collide',
        d3
          .forceCollide((d: any) => {
            return (this.radiusScale as d3.ScaleLinear<number, number>)(
              d.nb_lesion
            );
          })
          .iterations(10)
      );
  }

  private simulate(simulation: any) {
    simulation.on('tick', () => {
      this.svg
        .selectAll('.bubble')
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });
  }

  // Tooltip

  private createTooltip() {
    return d3
      .select('figure#bubble-bar-chart')
      .append('div')
      .style('opacity', 0)
      .style('background-color', 'white');
  }

  private showTooltip(event: any, d: any) {
    d3.select(event.target).attr('opacity', 1);
    this.tooltip.transition().duration(200).style('opacity', 1);

    const html = this.tooltip
      .html(`${d.genre} - ${d.nb_lesion}`)
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('font-family', 'sans-serif')
      .style('font-size', '0.8rem')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');

    html
      .style(
        'left',
        event.target.getBoundingClientRect().left +
          event.target.getBoundingClientRect().width / 2 -
          html.node().clientWidth / 2 +
          'px'
      )
      .style(
        'top',
        event.target.getBoundingClientRect().top + window.scrollY - 25 + 'px'
      );
  }

  private hideTooltip(event: any) {
    d3.select(event.target).attr('opacity', 0.7);
    this.tooltip.transition().duration(200).style('opacity', 0);
  }

  // Legend

  private drawLegend() {
    const legend = this.svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (this.width + 50) + ',' + 300 + ')');

    legend
      .selectAll('.bubble-legend')
      .data([500, 50000, 100000, 200000])
      .enter()
      .append('circle')
      .attr('class', 'bubble-legend')
      .attr('r', (d: any) =>
        (this.radiusScale as d3.ScaleLinear<number, number>)(d)
      )
      .attr(
        'cy',
        (d: any) =>
          this.height -
          300 -
          (this.radiusScale as d3.ScaleLinear<number, number>)(d)
      )
      .style('fill', 'none') // Transparent fill
      .style('stroke', '#070032') // Border color
      .style('stroke-width', 1);

    legend
      .selectAll('.size')
      .data([500, 50000, 100000, 200000])
      .enter()
      .append('text')
      .attr('class', 'size')
      .attr(
        'y',
        (d: any) =>
          this.height -
          300 -
          (this.radiusScale as d3.ScaleLinear<number, number>)(d) * 2
      )
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
      .text((d: any) => (d === 500 ? '<' + d : d))
      .style('font-family', 'sans-serif')
      .style('font-size', '1.5rem')
      .style('fill', '#070032');
  }
}
