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
  private marginLeft = 200;
  private width = 1200;
  private barHeight = 20;
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

  // private drawGroupedBars(data: any[]): void {
  //   const barPadding = 100;

  //   // Cumulative
  //   var cummulative = 0;
  //   data.forEach(function(val, i) {
  //     val.cummulative = cummulative;
  //     cummulative += 1;
  //   });
    
  //   const y_bodyParts = d3.scaleLinear()
  //     .range([this.marginLeft, this.width - this.margin]);

  //   const y_bodySeats = d3.scaleBand().domain(data.map(d => d.BodySeat))
  //     .rangeRound([0, this.width])
  //     .padding(0.1);

  //   const y_bodyParts_domain = y_bodySeats.bandwidth() * data.length;
  //   y_bodyParts.domain([0, y_bodyParts_domain]);

  //   const x = d3.scaleLinear()
  //     .domain([0, Math.max(...data.map(item => item.NLesions))])
  //     .range([this.marginLeft, this.width - this.margin]);

  //   const bodyParts = new Set(data.map(d => d.BodyPart));
  //   const color = d3.scaleOrdinal()
  //     .domain(bodyParts)
  //     .range(d3.schemeSpectral[bodyParts.size])
  //     .unknown("#ccc");

  //   const bodyPart_g = this.svg.selectAll(".bodypart")
  //     .data(data)
  //     .enter().append("g")
  //     .attr("class", function(d: any) {
  //       return 'bodypart bodypart-' + d.BodyPart;
  //     })
  //     .attr("transform", function(d: any) { // offset by inner group size
  //       var y_group = y_bodyParts((d.cummulative * y_bodySeats.bandwidth()));
  //       return "translate(" + y_group + ",0)";
  //     })
  //     .attr("fill", function(d: any) { // make child elements of group "inherit" this fill
  //       return color(d.BodyPart);
  //     });

  //   const bodySeat_g = bodyPart_g.selectAll(".bodyseat")
  //     .data(d3.group(data, d => d.NLesions))
  //     .enter().append("g")
  //     .attr("class", function(d: any) {
  //       return 'bodyseat bodyseat-' + d.BodySeat;
  //     })
  //     .attr("transform", function(d: any, i: any) { // offset by index
  //       return "translate(" + y_bodyParts((i * y_bodySeats.bandwidth())) + ",0)";
  //     });

  //   const bodyPart_label = bodyPart_g.selectAll(".bodypart-label")
  //     .data(d3.group(data, d => d.BodyPart))
  //     .enter().append("text")
  //     .attr("class", function(d: any) {
  //       // console.log(d)
  //       return 'bodypart-label bodypart-label-' + d.BodyPart;
  //     })
  //     .attr("transform", (d: any) => {
  //       var x_label = y_bodyParts((d.length * y_bodySeats.bandwidth() + barPadding) / 2);
  //       var y_label = this.height + 30;
  //       return "translate(" + x_label + "," + y_label + ")";
  //     })
  //     .text(function(d: any) {
  //       return d.BodyPart;
  //     })
  //     .attr('text-anchor', 'middle');
    
  //    var bodySeat_label = bodySeat_g.selectAll(".bodyseat-label")
  //      .data(d3.group(data, d => d.BodySeat))
  //      .enter().append("text")
  //      .attr("class", function(d: any) {
  //       //  console.log(d)
  //        return 'bodyseat-label bodyseat-label-' + d.key;
  //      })
  //      .attr("transform", (d: any) => {
  //        var x_label = y_bodyParts((y_bodySeats.bandwidth() + barPadding) / 2);
  //        var y_label = this.height + 10;
  //        return "translate(" + x_label + "," + y_label + ")";
  //      })
  //      .text(function(d: any) {
  //        return d.BodySeat;
  //       })
  //       .attr('text-anchor', 'middle');

  //   // const rects = bodySeat_g.selectAll('.rect')
  //   //   .data(data)
  //   //   .enter().append("rect")
  //   //   .attr("class", "rect")
  //   //   .attr("height", y_bodyParts(y_bodySeats.bandwidth() - barPadding))
  //   //   .attr("y", (d: any) => y_bodyParts(barPadding))
  //   //   .attr("x", (d: any) => x(d.NLesions))
  //   //   .attr("width", (d: any) => this.width - x(d.NLesions));
  // }

  private drawGroupedBars(data: any[]): void {
    const bodyParts = new Set(data.map(d => d.BodyPart));
    const onlyBodyParts = data.map(d => d.BodyPart);
    let cummul = 0;
    const occurences = onlyBodyParts.reduce((acc, curr) => {
      return acc[curr] ? acc[curr] : acc[curr] = cummul++, acc
    }, {});

    const padding = 20;
    // console.log(data.map(item => item.NLesions));
    const x = d3.scaleLinear()
      .domain([0, Math.max(...data.map(item => item.NLesions)) + 10000])
      .range([0, this.width - this.margin]);
    
    const y = d3.scaleBand()
      .domain(data.map(d => d.BodySeat))
      .rangeRound([this.margin, this.height - this.margin])
      .padding(0.3);

    // const fx = d3.scaleBand()
    //   .domain(bodyParts)
    //   .rangeRound([this.margin, this.height - this.margin - bodyParts.size * padding])

    const color = d3.scaleOrdinal()
      .domain(bodyParts)
      .range(d3.schemeSpectral[bodyParts.size])
      .unknown("#ccc");

    // console.log(d3.group(data, d => d.BodyPart));

    this.svg.append("g")
      .selectAll()
      .data(d3.group(data, d => d.BodyPart))
      .join("g")
        .attr("transform", ([bodyPart]: string[]) => {
          return `translate(${this.marginLeft},${(occurences[bodyPart] - 1) * y.bandwidth()})`;
        })
      .selectAll()
      .data(([, d]: any) => d)
      .join("rect")
        .attr("x", (d: any) => x(0))
        .attr("y", (d: any) => y(d.BodySeat))
        .attr("height", y.bandwidth())
        // .attr("height", this.barHeight)
        .attr("width", (d: any) => {
          console.log(x(d.NLesions));
          return x(d.NLesions);
        })
        .attr("fill", (d: any) => color(d.BodyPart));

    // x-axis
    this.svg.append("g")
      .attr("transform", `translate(${this.marginLeft},${this.height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
    
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
          return `translate(0,${(occurences[d.BodyPart] - 1) * y.bandwidth() + a})`;
        }
    );
  }

}
