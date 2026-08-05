import fs from 'fs';
const files = ['src/components/Header.tsx', 'src/components/Footer.tsx', 'src/components/About.tsx', 'src/components/LatestAdditions.tsx', 'src/components/PopularRentals.tsx'];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // First, safely convert literal backticks inside src= to curly braces
  content = content.replace(/src=`(\$\{import\.meta\.env\.BASE_URL\}[^`]+)`/g, 'src={`$1`}');
  fs.writeFileSync(f, content);
});
console.log('Fixed JSX curly braces via Node properly');
