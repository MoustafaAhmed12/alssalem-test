import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  public exportTableToExcel(
    data: any[],
    filename: string,
    ignoreCols: string[]
  ): void {
    // Remove columns to be ignored
    const filteredData = data.map((item) => {
      const newItem = { ...item };
      ignoreCols.forEach((col) => delete newItem[col]);
      return newItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  // public exportTableToExcel(tableId: string, filename: string): void {
  //   const element = document.getElementById(tableId);
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, `${filename}.xlsx`);
  // }
}
