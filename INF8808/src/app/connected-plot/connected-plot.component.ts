import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-connected-plot',
  templateUrl: './connected-plot.component.html',
  styleUrls: ['./connected-plot.component.scss'],
})
export class ConnectedPlotComponent implements OnInit {
  constructor() {}

  private hommeColor = '#674FFA';
  private femmeColor = '#EF26C9';

  private svg: any;
  private margin = { top: 90, right: 15, bottom: 50, left: 550 };
  private width = 0;
  private height = 0;

  private y = d3.scaleBand().range([0, this.height]);
  private xRange = [50, this.width - 100];
  private x = d3.scaleLinear().range(this.xRange);

  private axisLinePathVertical = (d: any) => {
    return d3.line()([
      [this.x(d) + 0.5, 0],
      [this.x(d) + 0.5, this.height],
    ]);
  };
  private axisLinePathHorizontal = (d: any) => {
    return d3.line()([
      [this.xRange[0], d],
      [this.xRange[1], d],
    ]);
  };

  private lollipopLinePath = (d: any) => {
    return d3.line()([
      [this.x(d.homme), 0],
      [this.x(d.femme), 0],
    ]);
  };

  // Initialization
  ngOnInit(): void {
    this.createSvg();
    this.drawChart();
  }

  // Read CSV + Preprocess + Draw chart
  private drawChart(): void {
    d3.text('/assets/data/Viz 4/sexe_secteur_lesion.csv')
      .then((data) => {
        let processedData = this.preprocess(data.split('\n'));
        this.setAxes(processedData);
        this.createGrid(processedData);
        this.makeLollipops(this.x, this.y, processedData);
        this.addText(this.x, this.y, processedData);
      })
      .catch((error) => {
        console.log('Error loading the data: ' + error);
      });
  }

  private trimString = (str: string) => {
    return str.replace("'", '').replace(',', '') + '-labelname';
  };

  private preprocess(data: any): any {
    let tmpData: any[] = [];
    let processedData: any[] = [];
    let sectorList: any[] = [];

    data.forEach((element: any) => {
      if (element.includes('HOMME') || element.includes('FEMME')) {
        if (!element.includes('AUTRES OU NON CODES')) {
          tmpData.push(element);
          sectorList.push(element.split(';')[1]);
        }
      }
    });
    sectorList = [...new Set(sectorList)];

    sectorList.forEach((element: any) => {
      processedData.push({ name: element, femme: '', homme: '' });
    });

    processedData.forEach((element: any) => {
      element.homme = tmpData
        .find((ele: any) => ele.includes('HOMME') && ele.includes(element.name))
        .split(';')[2];
      element.femme = tmpData
        .find((ele: any) => ele.includes('FEMME') && ele.includes(element.name))
        .split(';')[2];
    });

    processedData.sort((a, b) => {
      let AmaxData: any = d3.max([Number(a.femme), Number(a.homme)]);
      let BmaxData: any = d3.max([Number(b.femme), Number(b.homme)]);

      if (AmaxData < BmaxData) {
        return 1;
      } else {
        return -1;
      }
    });

    return processedData;
  }

  // Create Svg
  private createSvg(): void {
    const container = document.getElementById('connected-plot') as HTMLElement;
    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = container.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3
      .select('figure#connectedPlot')
      .append('svg')
      .attr('width', container.offsetWidth)
      .attr('height', container.offsetHeight)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.y = d3.scaleBand().range([0, this.height]);
    this.xRange = [50, this.width - 100];
    this.x = d3.scaleLinear().range(this.xRange);
  }

  // Set axes (x and y)
  private setAxes(data: any): void {
    let maxData: any[] = [];
    data.forEach((element: any) => {
      maxData.push(Number(element.femme));
      maxData.push(Number(element.homme));
    });

    this.y.domain(
      data.map(function (d: any) {
        return d.name;
      })
    );
    this.x.domain([0, d3.max(maxData)]);
    this.x.nice();

    // Create yAxis
    let yAxis = d3.axisLeft(this.y).tickSize(0);
    let yAxisGroup = this.svg
      .append('g')
      .attr('class', 'y-axis-group-connected-plot');
    yAxisGroup
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(-20, 0)')
      .call(yAxis)
      .select('.domain')
      .attr('opacity', 0);

    // Change the class of each y tick
    let self = this;
    d3.selectAll('.y-axis-group-connected-plot .y-axis .tick').each(function (
      d,
      i
    ) {
      d3.select(this).attr(
        'class',
        'tick-y-secteur-' + self.trimString(`${d}`)
      );
    });

    // Create xAxis
    let xAxis = d3.axisBottom(this.x).tickFormat(function (d, i) {
      if (i == 0) {
        return '0';
      } else {
        return d3.format(',')(d);
      }
    });

    let xAxisGroup = this.svg
      .append('g')
      .attr('class', 'x-axis-group-connected-plot');
    xAxisGroup
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0.5,' + this.height + ')')
      .call(xAxis)
      .attr('opacity', 0.3);
  }

  // Create grid (x and y)
  private createGrid(data: any): void {
    let axisLinesVertical = this.svg
      .append('g')
      .attr('class', 'grid-lines-vertical-connected-plot');
    axisLinesVertical
      .selectAll('path')
      .data(this.x.ticks())
      .enter()
      .append('path')
      .attr('class', 'vertical-ligne')
      .attr('d', this.axisLinePathVertical)
      .attr('opacity', 0.2)
      .attr('stroke', 'rgb(77, 76, 76)');

    let yPosData: any[] = [];
    let numberOfHorizontalLines = data.length;
    for (let i = -0.5; i < numberOfHorizontalLines; i++) {
      yPosData.push(((i + 0.5) * this.height) / numberOfHorizontalLines);
    }

    let axisLinesHorizontal = this.svg
      .append('g')
      .attr('class', 'grid-lines-horizontal-connected-plot');
    axisLinesHorizontal
      .selectAll('path')
      .data(yPosData)
      .enter()
      .append('path')
      .attr('class', 'horizontal-ligne')
      .attr('d', this.axisLinePathHorizontal)
      .attr('opacity', 0.2)
      .attr('stroke', 'rgb(77, 76, 76)');
  }

  // Create lollipops
  private makeLollipops(x: any, y: any, data: any): void {
    let lollipopsGroup = this.svg.append('g').attr('class', 'lollipops');
    let lollipops = lollipopsGroup
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'lollipop')
      .attr('transform', function (d: any) {
        return 'translate(0,' + (y(d.name) + y.bandwidth() / 2) + ')';
      });

    // Create connected lines
    lollipops
      .append('path')
      .attr('class', (d: any) => {
        return 'lollipop-line-' + this.trimString(`${d.name}`);
      })
      .attr('d', this.lollipopLinePath)
      .attr('stroke', 'rgb(184, 181, 181)')
      .attr('opacity', 0.5)
      .attr('stroke-width', '6px')
      .on('mouseover', (d: any) => {
        this.handleHover(d);
      })
      .on('mouseout', () => {
        this.handleOut();
      });

    // Create homme circles
    lollipops
      .append('circle')
      .attr('class', (d: any) => {
        return 'lollipop-homme-' + this.trimString(`${d.name}`);
      })
      .attr('r', 5)
      .attr('cx', function (d: any) {
        return x(d.homme);
      })
      .attr('fill', this.hommeColor)
      .on('mouseover', (d: any) => {
        this.handleHover(d);
      })
      .on('mouseout', () => {
        this.handleOut();
      });

    // Create femme circles
    lollipops
      .append('circle')
      .attr('class', (d: any) => {
        return 'lollipop-femme-' + this.trimString(`${d.name}`);
      })
      .attr('r', 5)
      .attr('cx', function (d: any) {
        return x(d.femme);
      })
      .attr('fill', this.femmeColor)
      .on('mouseover', (d: any) => {
        this.handleHover(d);
      })
      .on('mouseout', () => {
        this.handleOut();
      });
  }

  // Text and data (homme et femme)
  private addText(x: any, y: any, data: any): void {
    this.svg
      .append('text')
      .text('Homme')
      .attr('x', x(data[0].homme) - 60)
      .attr('y', y(data[0].name) + 10)
      .attr('class', 'initial-text-connected-plot-homme')
      .attr('fill', this.hommeColor);

    this.svg
      .append('text')
      .text('Femme')
      .attr('x', x(data[0].femme) + 15)
      .attr('y', y(data[0].name) + 10)
      .attr('class', 'initial-text-connected-plot-femme')
      .attr('fill', this.femmeColor);

    let self = this;
    d3.selectAll("circle[class*='lollipop-homme']").each(function (d: any) {
      self.svg
        .append('text')
        .text('Homme')
        .attr('x', x(d.homme) < x(d.femme) ? x(d.homme) - 60 : x(d.homme) + 15)
        .attr('y', y(d.name) + 10)
        .attr(
          'class',
          'sector-text-connected-plot-homme-' + self.trimString(`${d.name}`)
        )
        .attr('fill', self.hommeColor)
        .attr('opacity', 0);
    });

    d3.selectAll("circle[class*='lollipop-homme']").each(function (d: any) {
      self.svg
        .append('text')
        .text(`${d.homme}`)
        .attr('x', x(d.homme) < x(d.femme) ? x(d.homme) - 60 : x(d.homme) + 15)
        .attr('y', y(d.name) + 25)
        .attr(
          'class',
          'sector-text-connected-plot-homme-number' +
            self.trimString(`${d.name}`)
        )
        .attr('fill', self.hommeColor)
        .attr('opacity', 0);
    });

    d3.selectAll("circle[class*='lollipop-femme']").each(function (d: any) {
      self.svg
        .append('text')
        .text('Femme')
        .attr('x', x(d.homme) > x(d.femme) ? x(d.femme) - 60 : x(d.femme) + 15)
        .attr('y', y(d.name) + 10)
        .attr(
          'class',
          'sector-text-connected-plot-femme-' + self.trimString(`${d.name}`)
        )
        .attr('fill', self.femmeColor)
        .attr('opacity', 0);
    });

    d3.selectAll("circle[class*='lollipop-femme']").each(function (d: any) {
      self.svg
        .append('text')
        .text(`${d.femme}`)
        .attr('x', x(d.homme) > x(d.femme) ? x(d.femme) - 60 : x(d.femme) + 15)
        .attr('y', y(d.name) + 25)
        .attr(
          'class',
          'sector-text-connected-plot-femme-number' +
            self.trimString(`${d.name}`)
        )
        .attr('fill', self.femmeColor)
        .attr('opacity', 0);
    });
  }

  private handleHover(d: any): void {
    let reducedOpacity = 0.3;
    d3.selectAll("circle[class*='lollipop-femme']").style(
      'opacity',
      reducedOpacity
    );
    d3.selectAll("circle[class*='lollipop-homme']").style(
      'opacity',
      reducedOpacity
    );
    d3.selectAll("path[class*='lollipop-line']").style(
      'opacity',
      reducedOpacity
    );
    d3.selectAll("[class*='tick-y-secteur-']").style('opacity', reducedOpacity);
    d3.selectAll("[class*='initial-text-connected-plot-']").style('opacity', 0);
    d3.selectAll(
      `[class*='${this.trimString(`${d.target.__data__.name}`)}']`
    ).style('opacity', 1);
  }

  private handleOut(): void {
    d3.selectAll("circle[class*='lollipop-femme']").style('opacity', 1);
    d3.selectAll("circle[class*='lollipop-homme']").style('opacity', 1);
    d3.selectAll("path[class*='lollipop-line']").style('opacity', 0.5);
    d3.selectAll("[class*='tick-y-secteur-']").style('opacity', 1);
    d3.selectAll("[class*='initial-text-connected-plot-']").style('opacity', 1);
    d3.selectAll(`[class*=sector-text-connected-plot-]`).style('opacity', 0);
    d3.selectAll('.tooltip').remove();
  }
}
