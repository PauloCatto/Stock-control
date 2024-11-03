import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class DashboardPdfService {
  private chartElement: HTMLElement | null = null;

  constructor() {}

  setChartElement(chartElement: HTMLElement) {
    this.chartElement = chartElement;
  }

  generatePdf(): void {
    if (this.chartElement) {
      html2canvas(this.chartElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = doc.internal.pageSize.getWidth() - 20;
        const scaleFactor = 1.5;
        const originalHeight = (canvas.height * pdfWidth) / canvas.width;
        const adjustedHeight = originalHeight * scaleFactor;

        doc.addImage(imgData, 'PNG', 10, 10, pdfWidth, adjustedHeight);
        doc.save('chart.pdf');
      });
    }
  }
}
