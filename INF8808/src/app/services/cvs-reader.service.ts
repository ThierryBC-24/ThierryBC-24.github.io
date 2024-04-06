// import { Injectable } from '@angular/core';
// import { Papa } from 'ngx-papaparse';
// import * as fs from 'fs';

// interface Row {
//   ANNEE: number;
//   SECTEUR_SCIAN: string;
//   NB_LESION: number;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class CvsReaderService {
//   constructor() {}

//   public readCSVFile(filename: string): void {
//     fs.readFile(filename, 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error reading file:', err);
//         return;
//       }

//       this.parseCSV(data);
//     });
//   }

//   private parseCSV(csvData: string): void {
//     const papa = new Papa();
//     papa.parse(csvData, {
//       complete: (result) => {
//         console.log('Parsed: ', result);
//         return result;
//       },
//     });
//   }
// }
