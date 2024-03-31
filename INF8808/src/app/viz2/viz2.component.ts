import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-viz2',
  templateUrl: './viz2.component.html',
  styleUrls: ['./viz2.component.scss']
})
export class Viz2Component implements OnInit {
  private svg: any;
  private margin = 50;
  private marginLeft = 300;
  private width = 1200;
  private barHeight = 5;
  private height = 900 - (this.margin * 2);
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
    // this.drawBars(this.data);
    this.drawGroupedBars(this.data);
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
    const x = d3.scaleLinear()
      .domain([0, Math.max(...data.map(item => item.NLesions))])
      .range([this.marginLeft, this.width - this.margin]);
  
    const y = d3.scaleBand()
      .domain(data.map(d => d.BodySeat))
      .rangeRound([this.margin, this.height - this.margin])
      .padding(0.1);

    // Rectangle for each bar
    this.svg.append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(data)
      .join("rect")
        .attr("x", x(0))
        .attr("y", (d: any) => y(d.BodySeat))
        .attr("width", (d: any) => x(d.NLesions) - x(0))
        .attr("height", y.bandwidth());

    // x-axis
    this.svg.append("g")
      .attr("transform", `translate(0,${this.height - this.margin})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
  
    // y-axis
    this.svg.append("g")
        .attr("transform", `translate(${this.marginLeft},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0));
  }

  private drawGroupedBars(data: any[]): void {
    const x = d3.scaleLinear()
      .domain([0, Math.max(...data.map(item => item.NLesions))])
      .range([this.marginLeft, this.width - this.margin]);
  
    const y = d3.scaleBand()
      .domain(data.map(d => d.BodySeat))
      .rangeRound([this.margin, this.height - this.margin])
      .padding(0.1);

    const bodyParts = new Set(data.map(d => d.BodyPart));
    const fx = d3.scaleBand()
      .domain(bodyParts)
      .rangeRound([this.margin, this.width - this.margin]);
      // .paddingInner(0.1);

    const color = d3.scaleOrdinal()
      .domain(bodyParts)
      .range(d3.schemeSpectral[bodyParts.size])
      .unknown("#ccc");

    // Append a group for each state, and a rect for each age.
    this.svg.append("g")
      .selectAll()
      .data(d3.group(data, d => d.BodyPart))
      .join("g")
        .attr("transform", ([bodyPart]: any[]) => `translate(0,${fx(bodyPart)})`)
      .selectAll()
      .data(([, d]: any) => d)
      .join("rect")
        // .attr("x", (d: any) => x(d.NLesions))
        .attr("x", (d: any) => x(0))
        .attr("y", (d: any) => y(d.BodySeat))
        .attr("height", y.bandwidth())
        .attr("width", (d: any) => x(0) + x(d.NLesions))
        .attr("fill", (d: any) => color(d.BodyPart));

    // x-axis
    this.svg.append("g")
      .attr("transform", `translate(0,${this.height - this.margin})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
  
    // y-axis
    this.svg.append("g")
        .attr("transform", `translate(${this.marginLeft},0)`)
        // .call(d3.axisLeft(fx).tickSizeOuter(0));
        .call(d3.axisLeft(y).tickSizeOuter(0));

        this.svg.append("g")
        .attr("transform", `translate(0,0)`)
        // .call(d3.axisLeft(fx).tickSizeOuter(0));
        .call(d3.axisLeft(fx).tickSizeOuter(0))
        .call((g: any) => g.selectAll(".domain").remove());
  }

}
