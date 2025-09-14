
import type { NoiseRecord } from '../types';

export const exportToCsv = (filename: string, data: NoiseRecord[]): void => {
  const headers = ['Timestamp', 'Noise Level'];
  const rows = data.map(record => [
    record.timestamp.toLocaleString('ko-KR'),
    record.level.toString(),
  ]);

  let csvContent = headers.join(',') + '\n';
  rows.forEach(rowArray => {
    const row = rowArray.join(',');
    csvContent += row + '\n';
  });

  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
