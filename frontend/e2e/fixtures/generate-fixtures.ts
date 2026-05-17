import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib';

async function generateFixtures(): Promise<void> {
  const outputDir = __dirname;

  // Multi-page sample (3 pages)
  const sampleDoc = await PDFDocument.create();
  const sampleFont = await sampleDoc.embedFont(StandardFonts.Helvetica);
  for (let pageNumber = 1; pageNumber <= 3; pageNumber += 1) {
    const page = sampleDoc.addPage([595, 842]);
    page.drawText(`Test Page ${pageNumber}`, {
      x: 50,
      y: 750,
      size: 24,
      font: sampleFont,
    });
    page.drawText('This is a test PDF for Papyr E2E testing.', {
      x: 50,
      y: 700,
      size: 12,
      font: sampleFont,
    });
  }
  const sampleBytes = await sampleDoc.save();
  fs.writeFileSync(path.join(outputDir, 'sample.pdf'), sampleBytes);

  // Single page sample
  const singleDoc = await PDFDocument.create();
  const singleFont = await singleDoc.embedFont(StandardFonts.Helvetica);
  const singlePage = singleDoc.addPage([595, 842]);
  singlePage.drawText('Single Page Test', {
    x: 50,
    y: 750,
    size: 24,
    font: singleFont,
  });
  const singleBytes = await singleDoc.save();
  fs.writeFileSync(path.join(outputDir, 'single-page.pdf'), singleBytes);

  // eslint-disable-next-line no-console
  console.log('Fixtures generated successfully.');
}

generateFixtures().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to generate fixtures:', error);
  process.exit(1);
});
