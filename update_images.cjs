const fs = require('fs');
const path = require('path');

const tsxFilePath = path.join(__dirname, 'src', 'components', 'CategoryCatalog.tsx');
let tsxContent = fs.readFileSync(tsxFilePath, 'utf8');

const baseDir = path.join(__dirname, 'src', 'assets', 'outdoor category');
const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

// Normalize string for better matching
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const productRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'(?:.|\n)*?imageUrl:\s*'([^']+)'/g;

let match;
const products = [];
while ((match = productRegex.exec(tsxContent)) !== null) {
  products.push({
    fullMatch: match[0],
    id: match[1],
    name: match[2],
    imageUrl: match[3],
    index: match.index
  });
}

const outdoorCategories = [
  'trekking-gear', 'riding-gear', 'camping-gear', 
  'winter-jackets', 'riding-luggage', 'backpacks'
];

let updatedContent = tsxContent;
let importStatements = [];

// Get all images in all subdirectories of outdoor category
const allImages = [];
for (const folder of folders) {
  const folderPath = path.join(baseDir, folder);
  const images = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  for (const img of images) {
    allImages.push({
      folder,
      name: img,
      normalized: normalize(img.replace(/\.[^/.]+$/, "")),
      fullPath: `../assets/outdoor category/${folder}/${img}`
    });
  }
}

// Find matches for each product in outdoor categories
for (const product of products) {
  // Only target products that are in the outdoor categories
  // We can check if the product id starts with prefixes for outdoor categories:
  // tg- (trekking), rg- (riding), cg- (camping), wj- (winter), rl- (riding lug), bp- (backpacks)
  if (/^(tg|rg|cg|wj|rl|bp)-/.test(product.id)) {
    const prodNormalized = normalize(product.name);
    
    // Find best match image
    let bestMatch = null;
    let maxLen = 0;
    
    for (const img of allImages) {
      if (prodNormalized.includes(img.normalized) || img.normalized.includes(prodNormalized)) {
         bestMatch = img;
         break;
      }
    }
    
    if (!bestMatch) {
        // Try fallback with similarity
        for (const img of allImages) {
          // simple substring match or partial word match
          const words = img.name.replace(/\.[^/.]+$/, "").split(/[^a-zA-Z0-9]/).filter(w=>w.length > 2);
          const nameWords = product.name.split(/[^a-zA-Z0-9]/).filter(w=>w.length > 2);
          let matches = 0;
          for(const w of words) {
             if(nameWords.some(nw => nw.toLowerCase() === w.toLowerCase())) matches++;
          }
          if(matches > 0 && matches > maxLen) {
             maxLen = matches;
             bestMatch = img;
          }
        }
    }

    if (bestMatch) {
      console.log(`Matched: ${product.name} -> ${bestMatch.folder}/${bestMatch.name}`);
      const importName = `img_${product.id.replace(/-/g, '_')}`;
      importStatements.push(`import ${importName} from '${bestMatch.fullPath}';`);
      
      // Replace imageUrl in the specific product
      const newProductString = product.fullMatch.replace(
        /imageUrl:\s*'[^']+'/,
        `imageUrl: ${importName}`
      );
      updatedContent = updatedContent.replace(product.fullMatch, newProductString);
    } else {
      console.log(`No match found for: ${product.name}`);
    }
  }
}

// Add imports after the last import statement
const lastImportIndex = updatedContent.lastIndexOf('import ');
const nextLineIndex = updatedContent.indexOf('\n', lastImportIndex);
updatedContent = updatedContent.slice(0, nextLineIndex + 1) + importStatements.join('\n') + '\n' + updatedContent.slice(nextLineIndex + 1);

fs.writeFileSync(tsxFilePath, updatedContent);
console.log('Update complete.');
