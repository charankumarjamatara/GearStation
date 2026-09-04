const fs = require('fs');
const path = require('path');

const tsxFilePath = path.join(__dirname, 'src', 'components', 'CategoryCatalog.tsx');
let tsxContent = fs.readFileSync(tsxFilePath, 'utf8');

const baseDir = path.join(__dirname, 'src', 'assets', 'outdoor category');
const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

const productRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'(?:.|\n)*?imageUrl:\s*'([^']+)'/g;

let match;
const products = [];
while ((match = productRegex.exec(tsxContent)) !== null) {
  if (/^(tg|rg|cg|wj|rl|bp)-/.test(match[1])) {
    products.push({
      id: match[1],
      name: match[2],
      imageUrl: match[3]
    });
  }
}

const allImages = [];
for (const folder of folders) {
  const folderPath = path.join(baseDir, folder);
  const images = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  for (const img of images) {
    allImages.push({
      folder,
      name: img,
      fullPath: `../assets/outdoor category/${folder}/${img}`
    });
  }
}

function stringSimilarity(s1, s2) {
  const words1 = s1.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
  const words2 = s2.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
  let matches = 0;
  for(const w1 of words1) {
    for (const w2 of words2) {
      if (w1 === w2) {
        matches++;
        break; // Count each word match once
      }
    }
  }
  return matches / Math.max(words1.length, words2.length);
}

const mapping = {};
for (const product of products) {
  let bestMatch = null;
  let maxScore = 0;
  for (const img of allImages) {
    const score = stringSimilarity(product.name, img.name.replace(/\.[^/.]+$/, ""));
    if (score > maxScore) {
      maxScore = score;
      bestMatch = img;
    }
  }
  
  mapping[product.id] = {
    productName: product.name,
    imagePath: bestMatch ? bestMatch.fullPath : null,
    score: maxScore,
    suggestedImage: bestMatch ? `${bestMatch.folder}/${bestMatch.name}` : null
  };
}

fs.writeFileSync(path.join(__dirname, 'mapping.json'), JSON.stringify(mapping, null, 2));
console.log('mapping.json created.');
