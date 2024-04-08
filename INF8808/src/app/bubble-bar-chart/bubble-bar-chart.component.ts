import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Lesion } from './data';

const NATURE_Y_FORCE = 140000;
const GENRE_Y_FORCE = 60000;

const NATURE_TEXT_CUTOFF = 5;
const GENRE_TEXT_CUTOFF = 4;

@Component({
  selector: 'app-bubble-bar-chart',
  templateUrl: './bubble-bar-chart.component.html',
  styleUrls: ['./bubble-bar-chart.component.scss']
})
export class BubbleBarChartComponent implements OnInit {
  private data: Lesion[] = [];
  private dataPaths = [
    "/assets/data/Viz 6/genre_categorie_lesion.csv",
    "/assets/data/Viz 5/nature_categorie_lesion.csv",
  ];

  private svg: any;
  private button: any;
  private tooltip: any;
  private margin = 150;
  private width = 1500;
  private height = 450;

  private xAxis: d3.ScaleBand<string> | undefined;
  private yAxis: d3.ScaleLinear<number, number> | undefined;
  private radiusScale: d3.ScaleLinear<number, number> | undefined;

  private options = [
    'QUELLES NATURES DE LA LÉSION SURVIENNENT LE PLUS FRÉQUEMMENT?',
    'QUELS GENRES D\'ACCIDENTS SONT LES PLUS FRÉQUENTS?',
  ];
  private currentOptionIndex = 0;
  private currentForce = GENRE_Y_FORCE;
  private currentTextCutoff = NATURE_TEXT_CUTOFF;

  constructor() { }

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
      this.drawTitle();
      this.drawLegend();
      this.button = this.drawButton();
      this.tooltip = this.createTooltip();

      const simulation = this.getSimulation()
      this.simulate(simulation)

      this.button.on('click', () => {
        this.currentOptionIndex = (this.currentOptionIndex === 0 ? 1 : 0);
        this.currentForce = (this.currentForce === GENRE_Y_FORCE ? NATURE_Y_FORCE : GENRE_Y_FORCE);
        this.currentTextCutoff = (this.currentTextCutoff === GENRE_TEXT_CUTOFF ? NATURE_TEXT_CUTOFF : GENRE_TEXT_CUTOFF);

        d3.selectAll("figure#bar svg g :not(.button, .button-text, .button-text-first-row, .button-text-second-row").remove();
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
          this.drawTitle();
          this.drawLegend();
          
          const simulation = this.getSimulation()
          this.simulate(simulation)

          const tspan = this.svg.select('.button').select('.button-text').selectAll('tspan')

          tspan.filter('.button-text-first-row')
          .text('VOIR ' + this.options[this.currentOptionIndex].split(" ").slice(0, this.currentTextCutoff).join(" "))

          tspan.filter('.button-text-second-row')
          .text(this.options[this.currentOptionIndex].split(" ").slice(this.currentTextCutoff).join(" "))
        });
      })
    });
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("viewBox", `0 0 ${this.width + (this.margin * 4)} ${this.height + (this.margin * 3)}`)
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + 50 + ")");
  }

  // Scales

  private setXScale(): d3.ScaleBand<string> {
    return d3.scaleBand()
    .range([0, this.width])
    .domain(Array.from(new Set(this.data.map(d => d.categorie_genre))))
    .padding(0.1);
  }

  private setYScale(): d3.ScaleLinear<number, number> {
    return d3.scaleLinear()
    .domain([0, d3.max(this.data, d => d.nb_lesion) as number])
    .range([this.height, 0]);
  }

  private setLinearRadiusScale(): d3.ScaleLinear<number, number>{
    return d3.scaleLinear()
    .domain([0, 264227]) // hard coded max value to max of both datasets
    .range([3, 110]);
  }

  // Drawings

  private drawBubble(): void {
    this.svg.selectAll(".bubble")
    .data(this.data)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("cx", (d: any) => {
      d.x = (this.xAxis as d3.ScaleBand<string>)(d.categorie_genre) as number
      return (this.xAxis as d3.ScaleBand<string>)(d.categorie_genre) as number
    })
    .attr("cy", (d: any) => {
      d.y = (this.yAxis as d3.ScaleLinear<number, number>)(this.currentForce) as number
      return (this.yAxis as d3.ScaleLinear<number, number>)(this.currentForce) as number
    })
    .attr("r", (d: any) => (this.radiusScale as d3.ScaleLinear<number, number>)(d.nb_lesion))
    .attr("opacity", 0.7)
    .style("fill", "#d04a35")
    .on("mouseenter", (event: any) => this.showTooltip(event, event.target.__data__))
    .on("mouseleave", (event: any) => this.hideTooltip(event));
  }

  private drawXAxis(): void {
    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(this.xAxis as d3.ScaleBand<string>))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .attr('font-size', '0.8rem')
    .attr('font-family', 'sans-serif');
  }

  private drawButton(): any {
    const button = this.svg.append('g')
    .attr('class', 'button')
    .attr('transform', "translate(" + 0 + "," + 100 + ")");

    button.append('rect')
    .attr('class', 'button')
    .attr('width', (this.margin * 2) + 55)
    .attr('height', 60)
    .attr('x', this.width)
    .attr('fill', '#f4f6f4')
    .on('mouseenter', function (event: any) {
      d3.select(event.target).attr('stroke', '#362023')
    })
    .on('mouseleave', function (event: any) {
      d3.select(event.target).attr('stroke', '#f4f6f4')
    })

    const text = button.append('text')
    .style("pointer-events", "none")
    .attr('class', 'button-text')
    .on('mouseenter', () => {
      this.svg.select('.button').select('rect').attr('stroke', '#362023')
    })
    .on('mouseleave', () => {
      this.svg.select('.button').select('rect').attr('stroke', '#f4f6f4')
    })

    text.append('tspan')
    .attr('class', 'button-text-first-row')
    .text('VOIR ' + this.options[this.currentOptionIndex].split(" ").slice(0, this.currentTextCutoff).join(" "))
    .style('font-family', 'sans-serif')
    .attr('x', this.width + 15)
    .attr('dy', 25)

    text.append('tspan')
    .attr('class', 'button-text-second-row')
    .text(this.options[this.currentOptionIndex].split(" ").slice(this.currentTextCutoff).join(" "))
    .style('font-family', 'sans-serif')
    .attr('x', this.width + 15)
    .attr('dy', 25)

    return button
  }

  private drawTitle(): void {
    this.svg.append('text')
    .style("pointer-events", "none")
    .attr('x', this.width / 2)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .style('font-size', '2rem')
    .style('font-family', 'sans-serif')
    .text(this.options[this.currentOptionIndex ? 0 : 1]);
  }

  // Simulation

  private getSimulation() {
    return d3.forceSimulation(this.data as d3.SimulationNodeDatum[])
      .force("x", d3.forceX().x((d: any) => (this.xAxis as d3.ScaleBand<string>)(d.categorie_genre) as number + (this.xAxis as d3.ScaleBand<string>).bandwidth() / 2))
      .force("y", d3.forceY().y((d: any) => (this.yAxis as d3.ScaleLinear<number, number>)(this.currentForce) as number))
      .force("collide", d3.forceCollide((d: any) => { return (this.radiusScale as d3.ScaleLinear<number, number>)(d.nb_lesion); }).iterations(10))
  }

  private simulate(simulation: any) {
    simulation.on('tick', () => {
        this.svg.selectAll('.bubble')
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
      });
  }

  // Tooltip

  private createTooltip() {
    return d3.select('figure#bar').append("div")
      .style("opacity", 0)
      .style("background-color", "white");
  }

  private showTooltip(event: any, d: any) {
    d3.select(event.target).attr("opacity", 1)
    this.tooltip.transition()
      .duration(200)
      .style("opacity", 1);

    const html = this.tooltip.html(`${d.genre} - ${d.nb_lesion}`)
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("font-family", "sans-serif")
      .style("font-size", "0.8rem")
      .style('position', 'absolute')
      .style("pointer-events", "none")
      .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)");
      
    html.style("left", event.target.getBoundingClientRect().left + event.target.getBoundingClientRect().width / 2 - html.node().clientWidth / 2 + "px")
    .style("top", event.target.getBoundingClientRect().top + window.scrollY - 25 + "px");
  }

  private hideTooltip(event: any) {
    d3.select(event.target).attr("opacity", 0.7)
    this.tooltip.transition()
      .duration(200)
      .style("opacity", 0);
  }

  // Legend

  private drawLegend() {
    const legend = this.svg.append('g')
    .attr('class', 'legend')
    .attr('transform', "translate(" + (this.width + this.margin) + "," + 300 + ")");

    legend.selectAll(".bubble-legend")
    .data([100, 50000, 100000, 200000])
    .enter()
    .append("circle")
    .attr("class", "bubble-legend")
    .attr("r", (d: any) => (this.radiusScale as d3.ScaleLinear<number, number>)(d))
    .attr("cy", (d: any) => this.height - 300 - (this.radiusScale as d3.ScaleLinear<number, number>)(d))
    .style("fill", "none") // Transparent fill
    .style("stroke", "black") // Border color
    .style("stroke-width", 1)
    .on("mouseenter", (event: any) => this.showTooltip(event, event.target.__data__))
    .on("mouseleave", (event: any) => this.hideTooltip(event));

    legend.selectAll(".size")
    .data([100, 50000, 100000, 200000])
    .enter()
    .append("text")
    .attr("class", "size")
    // .attr("x", this.width + this.margin + 100)
    .attr("y", (d: any) => this.height - 300 - (this.radiusScale as d3.ScaleLinear<number, number>)(d) * 2)
    .attr('transform', "translate(" + 100 + "," + 0 + ")")
    .text((d: any) => d)
    .style("font-family", "sans-serif")
    .style("font-size", "0.8rem")
    .style("fill", "black");
  }
}
