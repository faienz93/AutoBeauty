// import { ColumnOption, parse } from 'csv-parse';
// import { stringify } from 'csv-stringify/sync';
// import {stringify} from 'csv-stringify/browser/esm/sync';
import Papa from "papaparse";
import { Maintenance } from '../models/Maintenance';



export class CsvService<T> {


  async importCsv(file: File, columnHeader: boolean = true): Promise<T[]> {

    try {
      const text = await file.text();

      return new Promise((resolve, reject) => {
        if (!file) {
          reject(new Error('No file provided'));
          return;
        }

        Papa.parse(text, {
          header: columnHeader,
          skipEmptyLines: true,
          error: (error: any) => {
            reject(new Error(`CSV parsing error: ${error.message}`));
          },
          complete: (results: any) => {
            if (results.errors.length > 0) {
              const msg = `Error parsing CSV: ${results.errors.map((err: any) => err.message).join(', ')}`;
              reject(msg);
              return;
            }
            
            try {
              const parsedData = results.data as T[];
              console.log("Parsed Data:");
              console.log(parsedData);
              resolve(parsedData);
            } catch (error) {
              reject(new Error(`Error converting data: ${error}`));
            }
          }
        });
        // console.log(csv);
        // console.log("------------")
        // const parsedData = csv?.data as never[];
        // console.log(parsedData);

        // resolve(parsedData);

      });

    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error(`Error reading file: ${error}`);
    }

  }

  // async exportCsv(headers: []): Promise<string> {
  //   try {
  //     const result = await this.db.allDocs({
  //       include_docs: true
  //     });

  //     const manutenzioni = result.rows
  //       .map(row => row.doc)
  //       .map(doc => ({
  //         data: doc?.data,
  //         km: doc?.km,
  //         tipo: doc?.tipo,
  //         costo: doc?.costo,
  //         note: doc.note || ''
  //       }));

  //     // Usa csv-stringify per l'export
  //     return stringify(manutenzioni, {
  //       delimiter: '|',
  //       header: true,
  //       columns: headers
  //     });
  //   } catch (error) {
  //     console.error('Errore esportazione:', error);
  //     throw error;
  //   }
  // }

  // Metodo di utility per validare il formato
  // private isValidFormat(record: any): boolean {
  //   return (
  //     record.data &&
  //     !isNaN(record.km) &&
  //     record.tipo &&
  //     record.costo
  //   );
  // }
}
