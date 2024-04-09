import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { data_viz2 } from 'data/Viz 2/data_complete';

@Component({
  selector: 'app-viz2',
  templateUrl: './viz2.component.html',
  styleUrls: ['./viz2.component.scss']
})
export class Viz2Component implements OnInit {
  private svg: any;
  private margin = 50;
  private marginLeft = 200;
  private legendWidth = 350;
  private width = 1400 - this.margin * 2;
  private height = 700 - this.margin * 2;
  private data = data_viz2;

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    const data: any = this.formatData(this.data);
    this.drawGroupedBars(data.bodySeats, data.bodyParts);
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + this.margin * 2)
    .attr("height", this.height + this.margin * 2)
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private formatData(data: any[]): any {
    const lesions = data.map(item => item.NLesions);
    const sum = lesions.reduce((acc, curr) => acc + curr, 0);
    data.forEach(item => item.percent = item.NLesions/sum);

    const grouped = data.reduce((groups, item) => {
      (groups[item.BodyPart] ||= []).push(item);
      return groups;
    }, {});
    const bodyParts: any[] = [];
    for (const g in grouped) {
      const lesionsSeat = grouped[g].map((item: any) => item.NLesions);
      const sumSeat = lesionsSeat.reduce((acc: any, curr: any) => acc + curr, 0);
      bodyParts.push({ BodyPart: g, percent: sumSeat/sum, height: grouped[g].length });
    };
    return { bodySeats: data, bodyParts: bodyParts };
  }

  private drawGroupedBars(data: any[], bodyPartsData: any): void {
    const bodyParts = Array.from(new Set(data.map(d => d.BodyPart)));

    const scaleBreak = 0.15;
    const paddingBars = 0.3;
    const paddingBodyParts = 20;
    const opacityBigBars = 0.5;

    const x = d3.scaleLinear()
      .domain([0, scaleBreak, scaleBreak, 0.5])
      .range([0, this.width - 400 - this.legendWidth, this.width - 400 - this.legendWidth, this.width - this.legendWidth]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.BodySeat))
      .rangeRound([this.margin, this.height - (bodyParts.length - 1) * paddingBodyParts])
      .padding(paddingBars);

    const paddingBarsLength = ((y.range()[1] - y.range()[0]) * paddingBars)/(data.map(d => d.BodySeat)).length;

    const color = d3.scaleOrdinal()
      .domain(bodyParts)
      .range(d3.schemeSet2)
      // .range(d3.schemeSpectral[bodyParts.length])
      .unknown("#ccc");

    this.svg.append("g")
      .selectAll()
      .data(d3.group(data, d => d.BodyPart))
      .join("g")
        .attr("transform", ([bodyPart,]: any[]) => {
          return `translate(${this.marginLeft},${bodyParts.indexOf(bodyPart) * paddingBodyParts})`;
        })
      .selectAll()
      .data(([, d]: any) => d)
      .join("rect")
        .attr("class", (d: any) => "small-bars " + d.BodyPart)
        .attr("x", x(0))
        .attr("y", (d: any) => y(d.BodySeat))
        .attr("height", y.bandwidth())
        .attr("width", (d: any) => x(d.percent))
        .attr("fill", (d: any) => color(d.BodyPart));

    let totalHeights = 0
    this.svg.append("g")
      .selectAll()
      .data(d3.group(bodyPartsData, (d: any) => d.BodyPart))
      .join("g")
        .attr("transform", ([bodyPart, d]: any[]) => {
          let a = y(data[totalHeights].BodySeat);
          if (!a) a = 0;
          const translate = `translate(${this.marginLeft},${a + bodyParts.indexOf(bodyPart) * paddingBodyParts - paddingBodyParts/4})`;
          totalHeights += d[0].height;
          return translate;
        })
      .selectAll()
      .data(([, d]: any) => d)
      .join("rect")
        .style('opacity', opacityBigBars)
        .attr("class", "big-bars")
        .attr("x", (d: any) => x(0))
        .attr("y", (d: any) => 0)
        .attr("height", (d: any) => (y.bandwidth() + paddingBarsLength) * d.height + paddingBodyParts/2)
        .attr("width", (d: any) => x(d.percent))
        .attr("fill", (d: any) => color(d.BodyPart))
      .on("mouseover", (event: Event, d: any) => {
        const target = event.currentTarget as SVGElement;
        d3.selectAll(".big-bars").transition().duration(200).style("opacity", 0.2);
        d3.selectAll(".small-bars").transition().duration(200).style("opacity", 0.4);
        d3.selectAll(".legend-element").transition().duration(200).style("opacity", 0.4);
    
        d3.selectAll(".legend-element." + d.BodyPart.replace(' ', '.')).transition().duration(200).style("opacity", 1);
        d3.selectAll(".small-bars." + d.BodyPart.replace(' ', '.')).transition().duration(200).style("opacity", 1);
        d3.select(target).transition().duration(200).style('opacity', opacityBigBars);
      })
      .on("mouseleave", (event: Event, d: any) => {
        d3.selectAll(".big-bars").transition().duration(100).style("opacity", opacityBigBars);
        d3.selectAll(".small-bars").transition().duration(100).style("opacity", 1);
        d3.selectAll(".legend-element").transition().duration(100).style("opacity", 1);
      });

    // x-axis
    this.svg.append("g")
      .attr("transform", `translate(${this.marginLeft},${this.height})`)
      .call(d3.axisBottom(x)
              .tickValues([0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45])
              .tickFormat(d3.format(".0%")));
    
    this.svg.append("text")
      .attr("class", "x label")
      .attr("x", this.width/2)
      .attr("y", this.height + 35)
      .text("Répartition relative (en %)");
    
    // y-axis
    const y_axis = this.svg.append("g")
        .attr("transform", `translate(${this.marginLeft},5)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call((g: any) => g.select(".domain").remove());

    y_axis.selectAll(".tick")
      .data(data)
      .join("g")
        .attr("transform", (d: any) => {
          let a = y(d.BodySeat);
          if (!a) a = 0;
          return `translate(0,${bodyParts.indexOf(d.BodyPart) * paddingBodyParts + a})`;
        }
    );

    this.svg.append('line')
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr("x1", this.marginLeft)
      .attr("y1", this.margin)
      .attr("x2", this.marginLeft)
      .attr("y2", this.height);

    // Première option
    this.svg.append('line')
      .style("stroke", "black")
      .style("stroke-width", 2)
      .attr('stroke-dasharray', ('3,3'))
      .attr("x1", x(scaleBreak) + this.marginLeft)
      .attr("y1", this.margin)
      .attr("x2", x(scaleBreak) + this.marginLeft)
      .attr("y2", this.height);  

    // Deuxième option
    //   this.svg.append("rect")
    //     .style('opacity', 0.5)
    //     .attr("x", x(scaleBreak) + this.marginLeft)
    //     .attr("y", this.margin)
    //     .attr("height", this.height - this.margin)
    //     .attr("width", x(scaleBreak + 0.1) - x(scaleBreak));  

    // Legend
    this.drawLegend(bodyParts, color);
  }
  
  private drawLegend(bodyParts: Array<any>, color: d3.ScaleOrdinal<string, unknown, string>) {
    const size = 15;
    const spacingLegend = 15;
    this.svg.selectAll("mydots")
      .data(bodyParts)
      .enter()
      .append("rect")
        .attr("class", (d: any) => "legend-element " + d)
        .attr("x", this.width - this.margin - 100)
        .attr("y", (d: any, i: number) => this.margin + i * (size + spacingLegend))
        .attr("width", size)
        .attr("height", size)
        .style("fill", (d: any) => color(d));
  
    this.svg.selectAll("mylabels")
      .data(bodyParts)
      .enter()
      .append("text")
        .attr("class", (d: any) => "legend-element " + d)
        .attr("x", this.width - this.margin + size * 1.2 - 100)
        .attr("y", (d: any, i: number) => this.margin + i * (size + spacingLegend) + (size/1.5))
        .text((d: any) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
  }
}
