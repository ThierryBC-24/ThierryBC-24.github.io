import { Component, OnInit } from '@angular/core';
import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';
import * as d3 from 'd3';

interface Data {
  bodyPart: string;
  bodySeat: string;
  nLesions: number;
}

@Component({
  selector: 'app-viz2',
  templateUrl: './viz2.component.html',
  styleUrls: ['./viz2.component.scss']
})
export class Viz2Component implements OnInit {
  private svg: any;
  private margin = 50;
  private marginLeft = 200;
  private width = 1200;
  private height = 700 - (this.margin * 2);
  private data = [
    {"BodySeat":"REGION CRANIENNE, Y COMPRIS LE CRANE","NLesions":4203, "BodyPart":"Tête"},
    {"BodySeat":"OREILLE(S)","NLesions":11467, "BodyPart":"Tête"},
    {"BodySeat":"VISAGE","NLesions":2496, "BodyPart":"Tête"},
    {"BodySeat":"TETE NCA,TEMPE","NLesions":70, "BodyPart":"Tête"},
    {"BodySeat":"TETE,NP","NLesions":72, "BodyPart":"Tête"},
    {"BodySeat":"COU,SAUF SIEGE INTERNE","NLesions":37, "BodyPart":"Cou"},
    {"BodySeat":"SIEGE INT. DU COU NP,REG. CERVICALE","NLesions":2089, "BodyPart":"Cou"},
    {"BodySeat":"SIEGES INTERNES DU COU,NCA","NLesions":5, "BodyPart":"Cou"},
    {"BodySeat":"EPAULES","NLesions":6838, "BodyPart":"Tronc"},
    {"BodySeat":"THORAX","NLesions":2035, "BodyPart":"Tronc"},
    {"BodySeat":"DOS,COLONNE VERTEBRALE,MOELLE EPINI.","NLesions":19553, "BodyPart":"Tronc"},
    {"BodySeat":"ABDOMEN","NLesions":224, "BodyPart":"Tronc"},
    {"BodySeat":"REGION PELVIENNE","NLesions":867, "BodyPart":"Tronc"},
    {"BodySeat":"TRONC,NCA","NLesions":12, "BodyPart":"Tronc"},
    {"BodySeat":"TRONC,NP","NLesions":12, "BodyPart":"Tronc"},
    {"BodySeat":"BRAS","NLesions":4164, "BodyPart":"Membres supérieurs"},
    {"BodySeat":"POIGNET(S)","NLesions":3181, "BodyPart":"Membres supérieurs"},
    {"BodySeat":"MAIN(S),SAUF: DOIGT(S) SEULEMENT","NLesions":2919, "BodyPart":"Membres supérieurs"},
    {"BodySeat":"DOIGT(S),ONGLE(S)","NLesions":7931, "BodyPart":"Membres supérieurs"},
    {"BodySeat":"MEMBRES SUPERIEURS,NCA","NLesions":29, "BodyPart":"Membres supérieurs"},
    {"BodySeat":"MEMBRES SUPERIEURS,NP","NLesions":24, "BodyPart":"Membres supérieurs"},
    {"BodySeat":"JAMBE(S)","NLesions":7311, "BodyPart":"Membres inférieurs"},
    {"BodySeat":"CHEVILLE(S)","NLesions":4785, "BodyPart":"Membres inférieurs"},
    {"BodySeat":"PIED(S),SAUF: ORTEIL(S) SEULEMENT","NLesions":2136, "BodyPart":"Membres inférieurs"},
    {"BodySeat":"ORTEIL(S),ONGLE(S) D'ORTEIL(S)","NLesions":383, "BodyPart":"Membres inférieurs"},
    {"BodySeat":"MEMBRES INFERIEURS,NCA","NLesions":22, "BodyPart":"Membres inférieurs"},
    {"BodySeat":"MEMBRES INFERIEURS,NP","NLesions":30, "BodyPart":"Membres inférieurs"},
    {"BodySeat":"SYSTEMES CORPORELS","NLesions":69446, "BodyPart": "Systèmes corporels"},
    {"BodySeat":"SIEGES INTERNES MULTIPLES DU COU","NLesions":1, "BodyPart":"Sièges multiples"},
    {"BodySeat":"SIEGES MULTIPLES","NLesions":6777, "BodyPart":"Sièges multiples"},
    {"BodySeat":"SIEGES MULTIPLES DE LA TETE","NLesions":141, "BodyPart":"Sièges multiples"},
    {"BodySeat":"SIEGES MULTIPLES DU TRONC","NLesions":569, "BodyPart":"Sièges multiples"},
    {"BodySeat":"SIEGES MULTIPLES MEMBRES INFERIEURS","NLesions":652, "BodyPart":"Sièges multiples"},
    {"BodySeat":"SIEGES MULTIPLES MEMBRES SUPERIEURS","NLesions":813, "BodyPart":"Sièges multiples"},
    {"BodySeat":"APPAREILS PROSTHETIQUES (PROTHESES)","NLesions":628, "BodyPart":"Appareils prosthétiques"},
    {"BodySeat":"AUTRES SIEGES,NCA","NLesions":2, "BodyPart":"Autres" },
    {"BodySeat":"LARYNX","NLesions":2, "BodyPart":"Autres" },
    {"BodySeat":"NE PEUT ETRE CLASSE","NLesions":35, "BodyPart":"Autres" },
    {"BodySeat":"PHARYNX","NLesions":1, "BodyPart":"Autres" }
  ]

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    const data: any = this.formatData(this.data);
    this.drawGroupedBars(data.bodySeats, data.bodyParts);
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private formatData(data: any[]): any {
    const lesions = data.map(item => item.NLesions);
    const sum = lesions.reduce((acc, curr) => acc + curr, 0);
    data.forEach(item => {
      item.percent = item.NLesions/sum;
    });

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
    const bodyParts = new Set(data.map(d => d.BodyPart));

    let cummul = 0;
    // TODO: simplifier occurences juste des index
    const occurences = (data.map(d => d.BodyPart)).reduce((acc, curr) => {
      return acc[curr] ? acc[curr] : acc[curr] = cummul++, acc
    }, {});

    const scaleBreak = 0.15;
    const paddingBars = 0.3;
    const paddingBodyParts = 20;

    const x = d3.scaleLinear()
      .domain([0, scaleBreak, scaleBreak, 0.6])
      .range([0, (this.width + this.margin) - 400, (this.width + this.margin) - 400, this.width + this.margin]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.BodySeat))
      .rangeRound([this.margin, this.height - (bodyParts.size - 1) * paddingBodyParts])
      // .rangeRound([this.margin, this.height - this.margin - (bodyParts.size - 3) * paddingBodyParts])
      .padding(paddingBars);

    const paddingBarsLength = ((y.range()[1] - y.range()[0]) * paddingBars)/(data.map(d => d.BodySeat)).length;

    const z = d3.scaleBand()
      .domain(bodyPartsData.map((d: any) => d.BodyPart))
      .rangeRound([this.margin, this.height - (bodyParts.size - 1) * paddingBodyParts])
    // console.log(y(data[1].BodySeat));
    // console.log(z(bodyPartsData[1].BodyPart));

    const color = d3.scaleOrdinal()
      .domain(bodyParts)
      .range(d3.schemeSpectral[bodyParts.size])
      .unknown("#ccc");

    this.svg.append("g")
      .selectAll()
      .data(d3.group(data, d => d.BodyPart))
      .join("g")
        .attr("transform", ([bodyPart,d]: any[]) => {
          return `translate(${this.marginLeft},${(occurences[bodyPart] - 1) * paddingBodyParts})`;
        })
        // .attr("transform", ([bodyPart,d]: any[]) => {
        //   return `translate(${this.marginLeft},${(occurences[bodyPart] - 1) * paddingBodyParts})`;
        // })
      .selectAll()
      .data(([, d]: any) => d)
      .join("rect")
        .attr("x", x(0))
        .attr("y", (d: any) => y(d.BodySeat))
        .attr("height", y.bandwidth())
        .attr("width", (d: any) => x(d.percent))
        .attr("fill", (d: any) => color(d.BodyPart));

    let previousHeight = 0;
    let totalHeights = 0
    this.svg.append("g")
      .selectAll()
      .data(d3.group(bodyPartsData, (d: any) => d.BodyPart))
      .join("g")
        .attr("transform", ([bodyPart, d]: any[]) => {
          let a = y(data[totalHeights].BodySeat);
          if (!a) a = 0;
          const translate = `translate(${this.marginLeft},${a + (occurences[bodyPart] - 1) * paddingBodyParts - paddingBodyParts/4})`;
          totalHeights += d[0].height;
          return translate;
        })
      .selectAll()
      .data(([, d]: any) => d)
      .join("rect")
        .style('opacity', 0.5)
        .attr("x", (d: any) => x(0))
        .attr("y", (d: any) => 0)
        .attr("height", (d: any) => (y.bandwidth() + paddingBarsLength) * d.height + paddingBodyParts/2)
        .attr("width", (d: any) => x(d.percent))
        .attr("fill", (d: any) => color(d.BodyPart));

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
          return `translate(0,${(occurences[d.BodyPart] - 1) * paddingBodyParts + a})`;
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
  
  private drawLegend(bodyParts: Set<any>, color: d3.ScaleOrdinal<string, unknown, string>) {
    const size = 15;
    const spacingLegend = 15;
    this.svg.selectAll("mydots")
      .data(bodyParts)
      .enter()
      .append("rect")
        .attr("x", this.width - this.margin - 100)
        .attr("y", (d: any, i: number) => this.margin + i * (size + spacingLegend))
        .attr("width", size)
        .attr("height", size)
        .style("fill", (d: any) => color(d));
  
    this.svg.selectAll("mylabels")
      .data(bodyParts)
      .enter()
      .append("text")
        .attr("x", this.width - this.margin + size * 1.2 - 100)
        .attr("y", (d: any, i: number) => this.margin + i * (size + spacingLegend) + (size/1.5))
        .text((d: any) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
  }

}
