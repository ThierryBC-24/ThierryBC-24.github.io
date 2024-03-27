import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { data } from './data';

@Component({
  selector: 'app-bubble-bar-chart',
  templateUrl: './bubble-bar-chart.component.html',
  styleUrls: ['./bubble-bar-chart.component.scss']
})
export class BubbleBarChartComponent implements OnInit {
  private data = data;
  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  private xAxis: d3.ScaleBand<string> | undefined;
  private yAxis: d3.ScaleLinear<number, number> | undefined;
  // TODO: Add xSubGroup (tp1)

  constructor() { }

  ngOnInit(): void {
    // TODO: Add fetch to data (tp4)

    this.xAxis = this.setXScale();
    this.yAxis = this.setYScale();

    this.createSvg();
    this.drawBubble();
    this.drawXAxis();
    this.drawYAxis();

    const simulation = this.getSimulation()
    this.simulate(simulation)
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  // Scales

  private setXScale(): d3.ScaleBand<string> {
    return d3.scaleBand()
    .range([0, this.width])
    .domain(this.data.map(d => d.category))
    .padding(0.2);
  }

  private setYScale(): d3.ScaleLinear<number, number> {
    return d3.scaleLinear()
    .domain([0, d3.max(this.data, d => d.count) as number])
    .range([this.height, 0]);
  }

  // Drawings

  private drawBubble(): void {
    this.svg.selectAll(".bubble")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("cx", (d: any) => {
      d.x = (this.xAxis as d3.ScaleBand<string>)(d.category) as number + (this.xAxis as d3.ScaleBand<string>).bandwidth() / 2
      return (this.xAxis as d3.ScaleBand<string>)(d.category) as number + (this.xAxis as d3.ScaleBand<string>).bandwidth() / 2
    })
    .attr("cy", (d: any) => {
      // (this.yAxis as d3.ScaleLinear<number, number>)(d.count) as number
      d.y = (this.yAxis as d3.ScaleLinear<number, number>)(400) as number
      return (this.yAxis as d3.ScaleLinear<number, number>)(400) as number
    })
    .attr("r", (d: any) => d.count / 30)
    .attr("opacity", 0.7)
    .style("fill", "#d04a35")
    .on("mouseenter", function(event: any) {
      d3.select(event.target).attr("opacity", 1);
      console.log(event.target.__data__)
    })
    .on("mouseleave", function(event: any) {
      d3.select(event.target).attr("opacity", 0.7);
    });
  }

  private drawXAxis(): void {
    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(this.xAxis as d3.ScaleBand<string>))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
  }

  private drawYAxis(): void {
    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(this.yAxis as d3.ScaleLinear<number, number>));
  }

  // Simulation
  private getSimulation() {
    return d3.forceSimulation(this.data as d3.SimulationNodeDatum[])
      .alphaDecay(0)
      .velocityDecay(0.75)
      .force('collision',
        d3.forceCollide(20)
          .strength(1)
      );
  }

  private simulate(simulation: any) {
    simulation.on('tick', () => {
        this.svg.selectAll('.bubble')
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
      });
  }
}
