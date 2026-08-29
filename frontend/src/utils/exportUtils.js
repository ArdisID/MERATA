/**
 * Utility functions for exporting data to CSV and generating formatted print documents
 */

export function exportToCSV(filename, rows, headers) {
  if (!rows || !rows.length) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  const separator = ',';
  const keys = headers ? headers.map(h => h.key) : Object.keys(rows[0]);
  const headerTitles = headers ? headers.map(h => `"${h.label}"`).join(separator) : keys.map(k => `"${k}"`).join(separator);

  const csvRows = rows.map(row => {
    return keys.map(key => {
      let cell = row[key] === null || row[key] === undefined ? '' : row[key];
      cell = String(cell).replace(/"/g, '""');
      return `"${cell}"`;
    }).join(separator);
  });

  const csvContent = '\uFEFF' + [headerTitles, ...csvRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printFormattedReport(title, subtitle, headers, rows, notes = '') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk mencetak dokumen.');
    return;
  }

  const tableHeaderHtml = headers.map(h => `<th style="border: 1px solid #cbd5e1; padding: 8px 12px; background: #f1f5f9; text-align: left; font-size: 11px; font-weight: 700; color: #1e293b;">${h.label}</th>`).join('');
  
  const tableRowsHtml = rows.map((row, idx) => {
    const cells = headers.map(h => `<td style="border: 1px solid #e2e8f0; padding: 8px 12px; font-size: 11px; color: #334155;">${row[h.key] ?? '-'}</td>`).join('');
    return `<tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">${cells}</tr>`;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 0; padding: 10px; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 18px; font-weight: 800; color: #1e3a8a; margin: 0; }
          .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
          .meta { text-align: right; font-size: 10px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          .footer { margin-top: 24px; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px; }
          .stamp { margin-top: 30px; text-align: right; font-size: 11px; }
          .stamp-name { margin-top: 50px; font-weight: bold; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div style="font-size: 10px; font-weight: bold; color: #2563eb; letter-spacing: 1px; text-transform: uppercase;">MERATA • SISTEM PEMERATAAN PENDIDIKAN</div>
            <h1 class="title">${title}</h1>
            <div class="subtitle">${subtitle}</div>
          </div>
          <div class="meta">
            <div>Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            <div>Status Dokumen: <strong>Resmi & Tervalidasi</strong></div>
          </div>
        </div>

        <table>
          <thead>
            <tr>${tableHeaderHtml}</tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        ${notes ? `<div style="margin-top: 14px; font-size: 10px; color: #475569; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0;"><strong>Catatan Resmi:</strong> ${notes}</div>` : ''}

        <div class="stamp">
          <div>Mengetahui & Mengesahkan,</div>
          <div style="font-weight: bold; margin-top: 4px;">Penanggung Jawab Wilayah / Sekolah</div>
          <div class="stamp-name">Dra. Hj. Sri Wahyuni, M.Pd.</div>
          <div style="font-size: 10px; color: #64748b;">NIP. 197405121998032001</div>
        </div>

        <div class="footer">
          <span>Dokumen dicetak secara otomatis dari Platform MERATA (Media Edukasi dan Pemerataan Pendidikan)</span>
          <span>Halaman 1 dari 1</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
