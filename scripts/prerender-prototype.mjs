import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distSsrDir = path.join(rootDir, 'dist-ssr');

async function prerender() {
  console.log('--- Gear Station Stage 3A: Static Prerendering Prototype ---');

  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Client build template not found at ${templatePath}. Run vite build first.`);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Also write dist/404.html for GitHub Pages SPA fallback
  const fallback404Path = path.join(distDir, '404.html');
  fs.writeFileSync(fallback404Path, template, 'utf-8');
  console.log('✓ Created dist/404.html (GitHub Pages SPA fallback)');

  const ssrEntryPath = path.join(distSsrDir, 'entry-server.js');
  if (!fs.existsSync(ssrEntryPath)) {
    throw new Error(`SSR bundle not found at ${ssrEntryPath}. Run vite build --ssr first.`);
  }

  const { render } = await import(pathToFileURL(ssrEntryPath).href);

  const routes = [
    {
      url: '/',
      outFile: path.join(distDir, 'index.html'),
      title: 'Gear Station — Premium Camera & Travel Gear Rentals | Hyderabad',
      description: 'Rent premium action cameras, DJI, Insta360, GoPro, riding gear, and outdoor adventure equipment in Hyderabad. Flexible daily rental plans from Gear Station.',
      canonical: 'https://gearstation.in/',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Gear Station',
        'url': 'https://gearstation.in/',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://gearstation.in/?search={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    },
    {
      url: '/products/dji-action-5',
      outFile: path.join(distDir, 'products', 'dji-action-5', 'index.html'),
      title: 'DJI Action 5 Pro on Rent in Hyderabad | Gear Station',
      description: 'Rent DJI Action 5 Pro in Hyderabad starting at ₹899/day. Flagship next-gen sensor with 4K/120fps, extreme low-light performance. Available with doorstep delivery from Gear Station.',
      canonical: 'https://gearstation.in/products/dji-action-5',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': 'DJI Action 5 Pro',
        'description': 'Flagship next-gen sensor with 4K/120fps, extreme low-light performance, revolutionary 4-hour battery endurance, and dual OLED high-brightness touchscreens.',
        'brand': {
          '@type': 'Brand',
          'name': 'DJI'
        },
        'offers': {
          '@type': 'Offer',
          'price': '899',
          'priceCurrency': 'INR',
          'availability': 'https://schema.org/InStock',
          'url': 'https://gearstation.in/products/dji-action-5'
        }
      }
    },
    {
      url: '/categories/photography',
      outFile: path.join(distDir, 'categories', 'photography', 'index.html'),
      title: 'Photography & Camera Equipment on Rent in Hyderabad | Gear Station',
      description: 'Browse and rent Photography & Camera Equipment in Hyderabad with Gear Station. High-quality equipment, transparent pricing, and flexible rental plans.',
      canonical: 'https://gearstation.in/categories/photography',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Photography & Camera Equipment on Rent in Hyderabad',
        'description': 'Browse and rent Photography & Camera Equipment in Hyderabad with Gear Station. High-quality equipment, transparent pricing, and flexible rental plans.',
        'url': 'https://gearstation.in/categories/photography'
      }
    }
  ];

  for (const route of routes) {
    console.log(`Prerendering route: ${route.url}...`);
    const { html: renderedAppHtml } = render(route.url);

    let html = template;

    // 1. Inject static rendered HTML into #root
    html = html.replace('<div id="root"></div>', `<div id="root">${renderedAppHtml}</div>`);

    // 2. Replace Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);
    html = html.replace(/<meta name="title" content=".*?" \/>/i, `<meta name="title" content="${route.title}" />`);

    // 3. Replace Meta Description
    html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${route.description}" />`);

    // 4. Replace Canonical
    html = html.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${route.canonical}" />`);

    // 5. Replace Open Graph Tags
    html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${route.canonical}" />`);
    html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${route.title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${route.description}" />`);

    // 6. Replace Twitter Card Tags
    html = html.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${route.canonical}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${route.title}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${route.description}" />`);

    // 7. Inject Schema JSON-LD
    const schemaScript = `\n    <script type="application/ld+json">\n${JSON.stringify(route.schema, null, 2)}\n    </script>\n  </head>`;
    html = html.replace('</head>', schemaScript);

    const outDir = path.dirname(route.outFile);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(route.outFile, html, 'utf-8');
    console.log(`✓ Generated ${path.relative(rootDir, route.outFile)} (${(Buffer.byteLength(html) / 1024).toFixed(1)} kB)`);
  }

  // Clean up dist-ssr
  if (fs.existsSync(distSsrDir)) {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
    console.log('✓ Cleaned up temporary SSR build directory (dist-ssr)');
  }

  console.log('--- Stage 3A Prerendering Complete ---');
}

prerender().catch((err) => {
  console.error('Prerender error:', err);
  process.exit(1);
});

