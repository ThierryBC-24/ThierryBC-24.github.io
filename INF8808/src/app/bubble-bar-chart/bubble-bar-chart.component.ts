import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bubble-bar-chart',
  templateUrl: './bubble-bar-chart.component.html',
  styleUrls: ['./bubble-bar-chart.component.scss']
})
export class BubbleBarChartComponent implements OnInit {
  private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
  private svg: any;
  private margin = 50;
  private width = 1300 - (this.margin * 2);
  private height = 700 - (this.margin * 2);

  private xAxis: d3.ScaleBand<string> | undefined;
  private yAxis: d3.ScaleLinear<number, number> | undefined;

  constructor() { }

  ngOnInit(): void {
    // TODO: Add fetch to data (tp4)

    this.xAxis = this.setXScale();
    this.yAxis = this.setYScale();

    this.createSvg();
    this.drawBubble(this.data);
    this.drawXAxis();
    this.drawYAxis();
    // this.drawBars(this.data);
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
    .domain(this.data.map(d => d.Framework))
    .padding(0.2);
  }

  private setYScale(): d3.ScaleLinear<number, number> {
    return d3.scaleLinear()
    .domain([0, 200000])
    .range([this.height, 0]);
  }

  // Drawings

  private drawBubble(data: any[]): void {
    this.svg.selectAll(".bubble")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("cx", (d: any) => (this.xAxis as d3.ScaleBand<string>)(d.Framework) as number + (this.xAxis as d3.ScaleBand<string>).bandwidth() / 2)
    .attr("cy", (d: any) => (this.yAxis as d3.ScaleLinear<number, number>)(d.Stars) as number)
    .attr("r", (d: any) => d.Stars / 1000)
    .attr("opacity", 0.7)
    .style("fill", "#d04a35")
    .on("mouseenter", function(event: any) {
      d3.select(event.target).attr("opacity", 1);
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

  private drawBars(data: any[]): void {  
    // Create and fill the bars
    this.svg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d: any) => (this.xAxis as d3.ScaleBand<string>)(d.Framework))
    .attr("y", (d: any) => (this.yAxis as d3.ScaleLinear<number, number>)(d.Stars))
    .attr("width", (this.xAxis as d3.ScaleBand<string>).bandwidth())
    .attr("height", (d: any) => this.height - (this.yAxis as d3.ScaleLinear<number, number>)(d.Stars))
    .attr("fill", "#d04a35")
    .on("mouseenter", function(event: any) {
      d3.select(event.target).attr("opacity", 1);
    })
    .on("mouseleave", function(event: any) {
      d3.select(event.target).attr("opacity", 0.7);
    });
  }

}
