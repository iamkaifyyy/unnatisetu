import PDFDocument from 'pdfkit';

export class PDFService {
  /**
   * Generates a printable PDF Acknowledgment Slip or Selection Letter.
   */
  public static createApplicationSlip(appData: {
    applicationNo: string;
    applicantName: string;
    schemeName: string;
    schemeCode: string;
    status: string;
    submittedAt: string;
    state: string;
    category: string;
    annualIncome: string;
    institutionName: string;
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Header
        doc.fillColor('#0f172a').fontSize(18).text('GOVERNMENT OF INDIA', { align: 'center' });
        doc.fontSize(14).text('MINISTRY OF TRIBAL AFFAIRS', { align: 'center' });
        doc.fontSize(10).fillColor('#475569').text('National Fellowship & Scholarship Portal for ST Students', { align: 'center' });
        doc.moveDown(1.5);

        // Divider
        doc.moveTo(40, doc.y).lineTo(570, doc.y).strokeColor('#2563eb').lineWidth(2).stroke();
        doc.moveDown(1);

        // Title
        doc.fontSize(14).fillColor('#1e293b').text(`OFFICIAL ACKNOWLEDGMENT SLIP`, { align: 'center' });
        doc.fontSize(10).fillColor('#0284c7').text(`Application No: ${appData.applicationNo}`, { align: 'center' });
        doc.moveDown(1.5);

        // Table Content
        const fields = [
          ['Applicant Name', appData.applicantName],
          ['Scheme Name', `${appData.schemeName} (${appData.schemeCode})`],
          ['Application Status', appData.status],
          ['Submission Date', appData.submittedAt],
          ['Domicile State', appData.state],
          ['Category / Tribe', appData.category],
          ['Annual Family Income', appData.annualIncome],
          ['Verified Institution', appData.institutionName],
        ];

        fields.forEach(([label, value]) => {
          doc.fontSize(10).fillColor('#64748b').text(`${label}: `, { continued: true });
          doc.fillColor('#0f172a').text(value);
          doc.moveDown(0.5);
        });

        doc.moveDown(2);
        doc.fillColor('#047857').fontSize(11).text('Digitally verified by Ministry of Tribal Affairs (MoTA)', { align: 'center' });
        doc.moveDown(1);
        doc.fillColor('#94a3b8').fontSize(9).text('Note: This is a system-generated document. For official queries, reference your Application No.', { align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
