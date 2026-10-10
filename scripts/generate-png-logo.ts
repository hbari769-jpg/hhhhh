import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generatePngLogo() {
  const svgPath = path.resolve(process.cwd(), 'public/aestific-logo.svg');
  const pngPath = path.resolve(process.cwd(), 'public/aestific-logo.png');

  if (!fs.existsSync(svgPath)) {
    console.error('aestific-logo.svg not found at', svgPath);
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(svgPath);

  // Convert SVG to high-res transparent PNG (800x640)
  await sharp(svgBuffer, { density: 300 })
    .resize(800, 640, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100 })
    .toFile(pngPath);

  console.log('✅ Generated public/aestific-logo.png successfully!');
}

generatePngLogo().catch(console.error);
