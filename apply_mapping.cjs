const fs = require('fs');
const path = require('path');

const tsxFilePath = path.join(__dirname, 'src', 'components', 'CategoryCatalog.tsx');
let tsxContent = fs.readFileSync(tsxFilePath, 'utf8');

const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, 'mapping.json'), 'utf8'));

// Manual overrides
mapping['tg-2'].imagePath = '../assets/outdoor category/trekking gear/50 L back pack.jpg';
mapping['tg-4'].imagePath = '../assets/outdoor category/trekking gear/rain roncho.jpg';
mapping['tg-7'].imagePath = '../assets/outdoor category/trekking gear/70 l back pack.jpg';
mapping['tg-10'].imagePath = '../assets/outdoor category/trekking gear/60 L back pack.jpg';

mapping['wj-4'].imagePath = '../assets/outdoor category/winter jackets/men down jacket 18 deg cel.jpg';
mapping['wj-6'].imagePath = '../assets/outdoor category/winter jackets/womens snoe hiking jacket.jpg';
mapping['wj-7'].imagePath = '../assets/outdoor category/winter jackets/women 3x1 jacket 0 deg cel.jpg';
mapping['wj-8'].imagePath = '../assets/outdoor category/winter jackets/fleece jacket.jpg';
mapping['wj-9'].imagePath = '../assets/outdoor category/winter jackets/women down jacket 18 deg cel.jpg';
mapping['wj-10'].imagePath = '../assets/outdoor category/winter jackets/rain jacket.jpg';

mapping['rl-1'].imagePath = '../assets/outdoor category/ridng luggage on rent/saddle bag sports.jpg';
mapping['rl-2'].imagePath = '../assets/outdoor category/ridng luggage on rent/riding tank bag.jpg';
mapping['rl-3'].imagePath = '../assets/outdoor category/ridng luggage on rent/rynox riding tail bag.jpg';
mapping['rl-4'].imagePath = '../assets/outdoor category/ridng luggage on rent/saddle bag classic.jpg';

mapping['bp-1'].imagePath = '../assets/outdoor category/back packs/backpack rain cover/backpack rain cover.jpg';
mapping['bp-2'].imagePath = '../assets/outdoor category/back packs/60L backpack/60L backpack.jpg';
mapping['bp-3'].imagePath = '../assets/outdoor category/back packs/70L backpack/70 L backpack.jpg';

const productRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'(?:.|\n)*?imageUrl:\s*'([^']+)'/g;

let match;
const products = [];
while ((match = productRegex.exec(tsxContent)) !== null) {
  products.push({
    fullMatch: match[0],
    id: match[1]
  });
}

let updatedContent = tsxContent;
let importStatements = [];
const imagePathToVarName = new Map();

for (const product of products) {
  const mapData = mapping[product.id];
  if (mapData && mapData.imagePath) {
    let importName;
    if (imagePathToVarName.has(mapData.imagePath)) {
      importName = imagePathToVarName.get(mapData.imagePath);
    } else {
      importName = `img_${product.id.replace(/-/g, '_')}`;
      imagePathToVarName.set(mapData.imagePath, importName);
      importStatements.push(`import ${importName} from '${mapData.imagePath}';`);
    }
    
    // Replace in content
    const newProductString = product.fullMatch.replace(
      /imageUrl:\s*'[^']+'/,
      `imageUrl: ${importName}`
    );
    updatedContent = updatedContent.replace(product.fullMatch, newProductString);
  }
}

const lastImportIndex = updatedContent.lastIndexOf('import ');
const nextLineIndex = updatedContent.indexOf('\n', lastImportIndex);
updatedContent = updatedContent.slice(0, nextLineIndex + 1) + importStatements.join('\n') + '\n' + updatedContent.slice(nextLineIndex + 1);

fs.writeFileSync(tsxFilePath, updatedContent);
console.log('CategoryCatalog.tsx updated successfully.');
