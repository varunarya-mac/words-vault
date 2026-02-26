// Simple icon generator for WordVault PWA
// Run: node generate-icons.js

const fs = require('fs');
const path = require('path');

console.log('🎨 WordVault Icon Generator\n');
console.log('This script will help you generate PWA icons.\n');
console.log('📝 Instructions:\n');
console.log('Option 1 - Use Online Tool (Recommended):');
console.log('1. Visit: https://realfavicongenerator.net');
console.log('2. Upload any 512x512 image with "WV" text or WordVault logo');
console.log('3. Download the generated icons');
console.log('4. Place them in the public/ folder\n');

console.log('Option 2 - Use the HTML Generator:');
console.log('1. Open public/icon-generator.html in your browser');
console.log('2. Click the download buttons');
console.log('3. Rename and save files as instructed\n');

console.log('Option 3 - Quick Placeholder (for testing):');
console.log('I\'ll create simple SVG placeholders you can use temporarily...\n');

// Create a simple favicon.ico placeholder (SVG)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#8b5cf6"/>
  <text x="16" y="23" font-family="Arial" font-size="18" font-weight="bold" fill="white" text-anchor="middle">W</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSvg);
console.log('✅ Created: public/favicon.svg');

// Create README
const readme = `# PWA Icons for WordVault

## Current Status
Placeholder SVG icons have been created for development.

## To Generate Production Icons:

### Method 1: Online Tool (Best Quality)
1. Go to https://realfavicongenerator.net
2. Create a 512x512 image with:
   - Purple/indigo gradient background (#8b5cf6 to #6366f1)
   - White "WV" text in bold font
3. Upload to the website
4. Download generated icons
5. Place in public/ folder

### Method 2: Use Included HTML Generator
1. Open \`public/icon-generator.html\` in a browser
2. Download all three icons
3. Rename and place in public/ folder:
   - pwa-192x192.png
   - pwa-512x512.png
   - apple-touch-icon.png

### Method 3: Design Your Own
Use any image editor (Figma, Canva, Photoshop) to create:
- 192x192 PNG
- 512x512 PNG
- 180x180 PNG (apple-touch-icon)
- favicon.ico (32x32)

## Required Files:
- [ ] public/pwa-192x192.png
- [ ] public/pwa-512x512.png
- [ ] public/apple-touch-icon.png
- [ ] public/favicon.ico (or favicon.svg)

## Notes:
- SVG placeholders work for development
- PNG files are required for production PWA
- Icons should be simple and recognizable at small sizes
- Use consistent branding (purple/indigo gradient + "WV")
`;

fs.writeFileSync(path.join(__dirname, 'public', 'ICONS-README.md'), readme);
console.log('✅ Created: public/ICONS-README.md\n');

console.log('📋 Next Steps:');
console.log('1. Choose one of the three methods above');
console.log('2. Generate/download the PNG icons');
console.log('3. Place them in the public/ folder');
console.log('4. Run: npm run build');
console.log('5. Test PWA installation\n');

console.log('✨ For now, you can continue development with the SVG placeholders!');
console.log('   The app will still work, just with basic icons.\n');
