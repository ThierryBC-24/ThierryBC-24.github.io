import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-connected-plot',
  templateUrl: './connected-plot.component.html',
  styleUrls: ['./connected-plot.component.scss']
})
export class ConnectedPlotComponent implements OnInit {

  constructor() { }
  private svg: any;
  private margin = {top: 90, right: 15, bottom: 50, left: 550};
  private width = window.innerWidth - this.margin.left - this.margin.right;
  private height = window.innerHeight - this.margin.top - this.margin.bottom;
  private y = d3.scaleBand().range([0, this.height])
  private xRange = [50, this.width-100];
  private x = d3.scaleLinear().range(this.xRange);
  private axisLinePath = (d:any) => {
    return d3.line()([[this.x(d) + 0.5, 0], [this.x(d) + 0.5, this.height]]);
  };
  private axisLinePathHorizontal = (d:any) => {
    return d3.line()([[this.xRange[0], d], [this.xRange[1], d]]);
  };

  private lollipopLinePath = (d:any) =>  {
    return d3.line()([[this.x(d.homme), 0], [this.x(d.femme), 0]]);
  };
// -----------------------------------------------------------------
  
  ngOnInit(): void {
    this.createSvg();
    this.drawChart();
  }
// -----------------------------------------------------------------
  private drawChart(): void{
    d3.text('/assets/data/Viz 4/sexe_secteur_lesion.csv')
      .then((data) => {
        let processedData = this.preprocess(data.split("\n"))
        this.setAxes(processedData);
        this.createGrid(processedData);
        this.makeLollipops(this.x, this.y, processedData);
      })
      .catch((error) => {
        console.log('Error loading the data: ' + error);
      });
  }

  private preprocess(data:any) : any{
    let tmpData : any[]= []
    let processedData : any[]= [];
    let namelist: any[] = [];

    data.forEach((element:any) => {
      if (element.includes("HOMME") || element.includes("FEMME")){
        if (! element.includes("AUTRES OU NON CODES")){
        tmpData.push(element)
        namelist.push(element.split(";")[1]);}
      }
    });
    namelist = [...new Set(namelist)];

    namelist.forEach((element:any) => {
      processedData.push({"name":element,"femme":'',"homme":''})
    })
    
    processedData.forEach((element:any) => {
      element.homme = tmpData.find((ele:any) => ele.includes("HOMME") && ele.includes(element.name)).split(";")[2]
      element.femme = tmpData.find((ele:any) => ele.includes("FEMME") && ele.includes(element.name)).split(";")[2]
    })

    processedData.sort((a, b) => {
      let AmaxData : any = d3.max([Number(a.femme), Number(a.homme)]);
      let BmaxData : any = d3.max([Number(b.femme), Number(b.homme)]);

    if (AmaxData < BmaxData) {return 1;}
    else {return -1;}
  });
    
    return processedData;
  }


  private createSvg(): void {
    this.svg = d3
      .select('figure#connectedPlot')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");
  }
// // -----------------------------------------------------------------

  private setAxes(data:any): void{
    let maxData : any[]= []
    data.forEach((element:any) => {
      maxData.push(Number(element.femme));
      maxData.push(Number(element.homme));
    })

    this.y.domain(data.map(function(d:any) { return d.name }));
    this.x.domain([0, d3.max(maxData)]);
    this.x.nice();

    let yAxis = d3.axisLeft(this.y).tickSize(0);
    let yAxisGroup = this.svg.append("g").attr("class", "y-axis-group");
    yAxisGroup.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(-20, 0)")
    .call(yAxis)
    .select(".domain")
    .attr("opacity", 0);

    let xAxis = d3.axisBottom(this.x)
    .tickFormat(function(d,i) {
    if (i == 0) {
      return "0"
    } else {
      return d3.format(",")(d);
    }
    });
    let xAxisGroup = this.svg.append("g")
    .attr("class", "x-axis-group");

    xAxisGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0.5," + this.height + ")")
      .call(xAxis)
      .attr("opacity", 0.3);

  }

//   // -----------------------------------------------------------------
  private createGrid(data:any): void {
    let axisLines = this.svg.append("g")
    .attr("class", "grid-lines");
    axisLines.selectAll("path")
      .data(this.x.ticks())
      .enter().append("path")
      .attr("class", "grid-ligne")
      .attr("d", this.axisLinePath)
      .attr("opacity", 0.2)
      .attr("stroke", "rgb(77, 76, 76)");

    let yPosData : any[]= []
    let numberOfHorizontalLines = data.length
    for (let i = 0; i < numberOfHorizontalLines; i++) {
      yPosData.push((i+0.5)*this.height/numberOfHorizontalLines)
    }
      
    let axisLines2 = this.svg.append("g")
      .attr("class", "grid-lines-horizontal");
    axisLines2.selectAll("path")
      .data(yPosData)
      .enter().append("path")
      .attr("class", "grid-ligne-horizontal")
      .attr("d", this.axisLinePathHorizontal)
      .attr("opacity", 0.2)
      .attr("stroke", "rgb(77, 76, 76)");
  }
// // -----------------------------------------------------------------
  private makeLollipops(x:any, y:any, data:any): void {
    let lollipopsGroup = this.svg.append("g").attr("class", "lollipops");
    let lollipops = lollipopsGroup.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "lollipop")
        .attr("transform", function(d:any) {
          return "translate(0," + (y(d.name) + (y.bandwidth() / 2)) + ")";
      })
    lollipops.append("path")
    .attr("class", "lollipop-line")
    .attr("d", this.lollipopLinePath)
    .attr("stroke", "rgb(184, 181, 181)")
    .attr("opacity", 0.5)
    .attr("stroke-width", "6px")
    .on('mouseover', () => {
      this.handleHover();
    })
    .on('mouseout', () => {
      this.handleOut();
    });
    

    let startCircles = lollipops.append("circle")
        .attr("class", "lollipop-homme")
        .attr("r", 5)
        .attr("cx", function(d:any) {
        return x(d.homme)})
        .attr("fill", "#ef8606")
        .on('mouseover', () => {
          this.handleHover();
        })
        .on('mouseout', () => {
          this.handleOut();
        });
    
      let endCircles = lollipops.append("circle")
        .attr("class", "lollipop-femme")
        .attr("r", 5)
        .attr("cx", function(d:any) {
        return x(d.femme);
      }).attr("fill", "#41a1ef")
      .on('mouseover', () => {
        this.handleHover();
      })
      .on('mouseout', () => {
        this.handleOut();
      });

      this.svg.append("text")
      .text("Homme")
      .attr("x", x(data[0].homme)-60)
      .attr("y", y(data[0].name)+10);

      this.svg.append("text")
      .text("Femme")
      .attr("x", x(data[0].femme)+15)
      .attr("y", y(data[0].name)+10);
  }

    

//   private hideLabel(): void{
//     this.div.transition()
//       .duration(200)
//       .style("opacity", 0);
//     }



//     private moveLabel(event:any, d:any): void {
//       this.div.style("left", (event.pageX - 30) + "px")
//       .style("top", (event.pageY - 40) + "px")
//     }

private handleHover(this :any, circle?: SVGCircleElement): void {
  d3.selectAll("circle[class*='lollipop-femme']").style('opacity', 0.3);
  d3.selectAll("circle[class*='lollipop-homme']").style('opacity', 0.3);
  d3.selectAll("path[class*='lollipop-line']").style('opacity', 0.3);
  console.log(d3.select(this).datum())
  }

private handleOut(circle?: SVGCircleElement): void {
  d3.selectAll("circle[class*='lollipop-femme']").style('opacity', 1);
  d3.selectAll("circle[class*='lollipop-homme']").style('opacity', 1);
  d3.selectAll("path[class*='lollipop-line']").style('opacity', 0.5);
  d3.selectAll('.tooltip').remove();
  }
}



