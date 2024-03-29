import { Component, OnInit } from '@angular/core';
import { viz1_data } from 'data/Viz 1/lesions_secteur_annee.constants';

@Component({
  selector: 'app-area-chart-container',
  templateUrl: './area-chart-container.component.html',
  styleUrls: ['./area-chart-container.component.scss'],
})
export class AreaChartContainerComponent implements OnInit {
  originalData: {
    ANNEE: number;
    SECTEUR_SCIAN: string;
    NB_LESION: number;
  }[];
  data: {
    SECTEUR_SCIAN: string;
    data: {
      ANNEE: number;
      NB_LESION: number;
    }[];
  }[] = [];
  constructor() {
    this.originalData = viz1_data;
  }

  ngOnInit(): void {
    const groupedData = this.groupDataBySecteur();
    this.data = this.prepareDataForD3(groupedData);
  }

  private groupDataBySecteur(): Map<
    string,
    { ANNEE: number; NB_LESION: number }[]
  > {
    const groupedData = new Map<
      string,
      { ANNEE: number; NB_LESION: number }[]
    >();

    this.originalData.forEach((item) => {
      if (!groupedData.has(item.SECTEUR_SCIAN)) {
        groupedData.set(item.SECTEUR_SCIAN, []);
      }
      groupedData
        .get(item.SECTEUR_SCIAN)!
        .push({ ANNEE: item.ANNEE, NB_LESION: item.NB_LESION });
    });

    return groupedData;
  }

  private prepareDataForD3(
    groupedData: Map<string, { ANNEE: number; NB_LESION: number }[]>
  ): { SECTEUR_SCIAN: string; data: { ANNEE: number; NB_LESION: number }[] }[] {
    const preparedData: any = [];

    groupedData.forEach((values, key) => {
      const sortedValues = values.sort((a, b) => a.ANNEE - b.ANNEE);
      preparedData.push({ SECTEUR_SCIAN: key, data: sortedValues });
    });

    return preparedData;
  }
}
