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

export function printOfficialBASTReport(shipment, schoolProfile) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk mencetak Berita Acara (BAST).');
    return;
  }

  const bastNumber = `421.3/BAST-MERATA/${new Date().getFullYear()}/${shipment?.id?.replace('LOG-', '') || '088'}`;
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>BAST - ${shipment?.program || 'Serah Terima Bantuan'}</title>
        <style>
          @page { size: A4 portrait; margin: 18mm; }
          body { font-family: 'Times New Roman', Times, serif; color: #000; margin: 0; padding: 5px; line-height: 1.45; font-size: 11pt; }
          .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 16px; }
          .kop h2 { margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
          .kop h3 { margin: 2px 0; font-size: 11.5pt; text-transform: uppercase; }
          .kop p { margin: 2px 0; font-size: 9.5pt; font-style: italic; color: #222; }
          .doc-title { text-align: center; margin: 16px 0 12px 0; }
          .doc-title h1 { margin: 0; font-size: 13pt; text-decoration: underline; text-transform: uppercase; font-weight: bold; }
          .doc-title .nomor { font-size: 10.5pt; margin-top: 3px; }
          .content-p { text-align: justify; margin: 8px 0; text-indent: 25px; font-size: 11pt; }
          table.parties { width: 100%; border-collapse: collapse; margin: 8px 0 12px 10px; font-size: 10.5pt; }
          table.parties td { padding: 2px 4px; vertical-align: top; }
          table.items { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10.5pt; }
          table.items th, table.items td { border: 1px solid #000; padding: 6px 8px; text-align: left; }
          table.items th { background-color: #f5f5f5; text-align: center; font-weight: bold; }
          .signatures { width: 100%; margin-top: 30px; }
          .signatures td { width: 50%; text-align: center; vertical-align: top; font-size: 11pt; }
          .sig-space { height: 60px; }
          .materai { border: 1px dashed #777; width: 75px; height: 30px; margin: 8px auto; font-size: 7.5pt; line-height: 30px; color: #555; }
          .footer-note { margin-top: 30px; font-size: 8.5pt; font-style: italic; color: #555; border-top: 1px solid #ccc; padding-top: 6px; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="kop">
          <h2>KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</h2>
          <h3>DINAS PENDIDIKAN PROVINSI DKI JAKARTA</h3>
          <p>Gedung Dinas Pendidikan Lt. 4, Jl. Gatot Subroto No. 40, Jakarta Selatan • Telp: (021) 525-5385 • Laman: disdik.jakarta.go.id</p>
        </div>

        <div class="doc-title">
          <h1>BERITA ACARA SERAH TERIMA (BAST)</h1>
          <div class="nomor">Nomor: ${bastNumber}</div>
        </div>

        <p class="content-p">
          Pada hari ini, <strong>${currentDate}</strong>, bertempat di <strong>${schoolProfile?.nama || 'SMP Negeri 1 Merata'}</strong>, kami yang bertanda tangan di bawah ini:
        </p>

        <table class="parties">
          <tr>
            <td style="width: 25px;">1.</td>
            <td style="width: 140px;">Pihak Penyalur / Kurir</td>
            <td style="width: 10px;">:</td>
            <td><strong>${shipment?.ekspedisi || 'PT Pos Logistik Indonesia (Penyalur DAK Fisik 2026)'}</strong></td>
          </tr>
          <tr>
            <td></td>
            <td>Kedudukan</td>
            <td>:</td>
            <td>Selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong> (Yang Menyerahkan).</td>
          </tr>
          <tr>
            <td>2.</td>
            <td>Nama Kepala Sekolah</td>
            <td>:</td>
            <td><strong>${schoolProfile?.kepalaSekolah || 'Dra. Hj. Sri Wahyuni, M.Pd.'}</strong></td>
          </tr>
          <tr>
            <td></td>
            <td>Jabatan / NIP</td>
            <td>:</td>
            <td>Kepala Sekolah / NIP. ${schoolProfile?.nipKepsek || '197405121998032001'}</td>
          </tr>
          <tr>
            <td></td>
            <td>Sekolah Penerima</td>
            <td>:</td>
            <td>${schoolProfile?.nama || 'SMP Negeri 1 Merata'} (NPSN: ${schoolProfile?.npsn || '20108942'})</td>
          </tr>
          <tr>
            <td></td>
            <td>Alamat Lengkap</td>
            <td>:</td>
            <td>${schoolProfile?.alamat || 'Jl. Merata Raya No. 45, Jakarta Selatan'}</td>
          </tr>
          <tr>
            <td></td>
            <td>Kedudukan</td>
            <td>:</td>
            <td>Selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong> (Yang Menerima).</td>
          </tr>
        </table>

        <p class="content-p">
          PIHAK PERTAMA menyerahkan hasil alokasi bantuan sarana prasarana pendidikan kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah memeriksa fisik barang secara seksama serta menerima barang tersebut dalam keadaan lengkap, baru, dan berfungsi baik:
        </p>

        <table class="items">
          <thead>
            <tr>
              <th style="width: 35px;">No.</th>
              <th>Nama Program / Bantuan</th>
              <th>Volume & Spesifikasi</th>
              <th>Sumber Anggaran</th>
              <th>Status Fisik Barang</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center;">1</td>
              <td><strong>${shipment?.program || 'Alokasi Pengadaan Sarana Belajar'}</strong></td>
              <td>${shipment?.jumlahItem || '15 Unit Laptop & Aksesoris TIK'}</td>
              <td>${shipment?.sumberDana || 'DAK Fisik Kemendikbudristek RI'}</td>
              <td style="text-align: center; color: #15803d; font-weight: bold;">Baik & Berfungsi 100%</td>
            </tr>
          </tbody>
        </table>

        <p class="content-p">
          Demikian Berita Acara Serah Terima (BAST) ini dibuat dan ditandatangani kedua belah pihak dalam keadaan sadar tanpa paksaan dari pihak manapun untuk dipergunakan sebagai dokumen pertanggungjawaban resmi pada Sistem Informasi MERATA.
        </p>

        <table class="signatures">
          <tr>
            <td>
              <div>Yang Menyerahkan,</div>
              <div style="font-weight: bold;">PIHAK PERTAMA</div>
              <div class="sig-space"></div>
              <div style="font-weight: bold; text-decoration: underline;">Petugas Ekspedisi / Logistik</div>
              <div style="font-size: 9.5pt;">${shipment?.ekspedisi?.split('(')[0] || 'PT Pos Logistik Indonesia'}</div>
            </td>
            <td>
              <div>Yang Menerima,</div>
              <div style="font-weight: bold;">PIHAK KEDUA</div>
              <div class="materai">MATERAI 10000</div>
              <div style="font-weight: bold; text-decoration: underline;">${schoolProfile?.kepalaSekolah || 'Dra. Hj. Sri Wahyuni, M.Pd.'}</div>
              <div style="font-size: 9.5pt;">NIP. ${schoolProfile?.nipKepsek || '197405121998032001'}</div>
            </td>
          </tr>
        </table>

        <div class="footer-note">
          <span>Dicatat secara elektronik pada Platform MERATA (ID Transaksi: ${shipment?.id || 'LOG-2026-001'})</span>
          <span>Lembar Asli Instansi</span>
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

