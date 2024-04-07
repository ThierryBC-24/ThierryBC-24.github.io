import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Lesion, data } from './data';

@Component({
  selector: 'app-bubble-bar-chart',
  templateUrl: './bubble-bar-chart.component.html',
  styleUrls: ['./bubble-bar-chart.component.scss']
})
export class BubbleBarChartComponent implements OnInit {
  // private data = data;
  private data: Lesion[] = [];
  private path = "/assets/data/Viz 6/genre_categorie_lesion.csv";

  private svg: any;
  private margin = 150;
  private width = 1500;
  private height = 500;

  private xAxis: d3.ScaleBand<string> | undefined;
  private yAxis: d3.ScaleLinear<number, number> | undefined;
  private radiusScale: d3.ScaleLinear<number, number> | undefined;

  private options = [
    'QUELLES NATURES DE LA LÉSION SURVIENNENT LE PLUS FRÉQUEMMENT?',
    'QUELS GENRES D\'ACCIDENTS SONT LES PLUS FRÉQUENTS?',
  ];
  private currentOptionIndex = 0;

  constructor() { }

  ngOnInit(): void {
    d3.text(this.path).then((data) => {
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

      this.xAxis = this.setXScale();
      this.yAxis = this.setYScale();
      this.radiusScale = this.setLinearRadiusScale();

      this.createSvg();
      this.drawBubble();
      this.drawXAxis();
      // this.drawYAxis();
      const button = this.drawButton();

      button.on('click', () => {
        this.currentOptionIndex = (this.currentOptionIndex === 0 ? 1 : 0)
        // build(data, 1000, currentYear, radiusScale, colorScale, xScale, yScale)
        this.svg.select('.button').select('.button-text').text('VOIR ' + this.options[this.currentOptionIndex])
      })

      const simulation = this.getSimulation()
      this.simulate(simulation)
    });
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")

    // static sizing
    
    // .attr("width", this.width + (this.margin * 2))
    // .attr("height", this.height + (this.margin * 2))

    // dynamic sizing

    .attr("viewBox", `0 0 ${this.width + (this.margin * 2)} ${this.height + (this.margin * 3)}`)

    .append("g")
    .attr("transform", "translate(" + this.margin / 2 + "," + 50 + ")");
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
    .domain([0, d3.max(this.data, d => d.nb_lesion) as number])
    .range([3, 110]);
  }

  private setLogRadiusScale(): d3.ScaleLogarithmic<number, number>{
    return d3.scaleLog()
    .domain([1, d3.max(this.data, d => d.nb_lesion) as number])
    .range([1, 30]);
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
      // (this.yAxis as d3.ScaleLinear<number, number>)(d.nb_lesion) as number
      d.y = (this.yAxis as d3.ScaleLinear<number, number>)(60000) as number
      return (this.yAxis as d3.ScaleLinear<number, number>)(60000) as number
    })
    .attr("r", (d: any) => (this.radiusScale as d3.ScaleLinear<number, number>)(d.nb_lesion))
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
    .style("text-anchor", "end")
    .attr('font-size', '0.8rem');
  }

  private drawYAxis(): void {
    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(this.yAxis as d3.ScaleLinear<number, number>));
  }

  private drawButton(): any {
    const button = this.svg.append('g')
      .attr('class', 'button')

    button.append('rect')
    .attr('width', 400)
    .attr('height', 30)
    .attr('y', -15)
    .attr('fill', '#f4f6f4')
    .on('mouseenter', function (event: any) {
      d3.select(event.target).attr('stroke', '#362023')
    })
    .on('mouseleave', function (event: any) {
      d3.select(event.target).attr('stroke', '#f4f6f4')
    });

    button.append('text')
    .attr('x', 200)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('class', 'button-text')
    .text('VOIR ' + this.options[this.currentOptionIndex])
    .attr('font-size', '0.6rem')
    .attr('fill', '#362023')
    .attr('font-family', 'sans-serif');

    return button
  }

  // Simulation

  private getSimulation() {

    // Base simulation

    // return d3.forceSimulation(this.data as d3.SimulationNodeDatum[])
    //   .alphaDecay(0)
    //   .velocityDecay(0.75)
    //   // .force('collision',
    //   //   d3.forceCollide(20)
    //   //     .strength(1)
    //   // )
    //   .force("collide", d3.forceCollide(20).iterations(10));

    // Link simulation

    // return d3.forceSimulation(this.data as d3.SimulationNodeDatum[])
    //   .force("link", d3.forceLink().id(function(d) { return d.index ? d.index : 0; }).distance(100))
    //   .force("charge", d3.forceManyBody().distanceMax(600/2).strength(1))
    //   .force("collide", d3.forceCollide(30).iterations(10))
    //   // .force("center", d3.forceCenter(860/2, 600/2));

    // center simulation

    // return d3.forceSimulation(this.data as d3.SimulationNodeDatum[])
    //   .force("x", d3.forceX(this.width / 2).strength(0.05))
    //   .force("y", d3.forceY(this.height / 2).strength(0.05))
    //   .force("collide", d3.forceCollide(function(d: any) { return d.nb_lesion / 2000; }).iterations(10))

    // categorie_genre simulation

    return d3.forceSimulation(this.data as d3.SimulationNodeDatum[])
      .force("x", d3.forceX().x((d: any) => (this.xAxis as d3.ScaleBand<string>)(d.categorie_genre) as number + (this.xAxis as d3.ScaleBand<string>).bandwidth() / 2))
      .force("y", d3.forceY().y((d: any) => (this.yAxis as d3.ScaleLinear<number, number>)(60000) as number))
      .force("collide", d3.forceCollide((d: any) => { return (this.radiusScale as d3.ScaleLinear<number, number>)(d.nb_lesion); }).iterations(10))
  }

  private simulate(simulation: any) {
    simulation.on('tick', () => {
        this.svg.selectAll('.bubble')
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
      });
  }
}
