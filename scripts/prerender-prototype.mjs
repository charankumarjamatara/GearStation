import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distSsrDir = path.join(rootDir, 'dist-ssr');
const publicDir = path.join(rootDir, 'public');

async function prerender() {
  console.log('=== Gear Station Stage 3B: Full Website Static Prerendering ===\n');

  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Client build template not found at ${templatePath}. Run vite build first.`);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Write dist/404.html for GitHub Pages SPA fallback
  const fallback404Path = path.join(distDir, '404.html');
  fs.writeFileSync(fallback404Path, template, 'utf-8');
  console.log('✓ Created dist/404.html (GitHub Pages SPA fallback)');

  const ssrEntryPath = path.join(distSsrDir, 'entry-server.js');
  if (!fs.existsSync(ssrEntryPath)) {
    throw new Error(`SSR bundle not found at ${ssrEntryPath}. Run vite build --ssr first.`);
  }

  const { render, ALL_PRODUCTS_LIST } = await import(pathToFileURL(ssrEntryPath).href);

  // 1. Validate Product Slugs & Check Uniqueness
  console.log(`\nValidating ${ALL_PRODUCTS_LIST.length} products...`);
  const uniqueSlugs = new Set();
  const slugDuplicates = [];
  const invalidSlugs = [];

  for (const p of ALL_PRODUCTS_LIST) {
    if (!p.slug || typeof p.slug !== 'string' || p.slug.trim() === '') {
      invalidSlugs.push({ id: p.id, name: p.name, reason: 'empty or missing' });
    } else {
      const slug = p.slug.trim().toLowerCase();
      if (!/^[a-z0-9-]+$/.test(slug)) {
        invalidSlugs.push({ id: p.id, name: p.name, slug: p.slug, reason: 'invalid characters' });
      }
      if (uniqueSlugs.has(slug)) {
        slugDuplicates.push(slug);
      } else {
        uniqueSlugs.add(slug);
      }
    }
  }

  if (invalidSlugs.length > 0) {
    console.error('CRITICAL: Invalid slugs detected:', invalidSlugs);
    throw new Error(`Found ${invalidSlugs.length} invalid slugs`);
  }
  if (slugDuplicates.length > 0) {
    console.error('CRITICAL: Duplicate slugs detected:', slugDuplicates);
    throw new Error(`Found ${slugDuplicates.length} duplicate slugs`);
  }

  console.log(`✓ All ${uniqueSlugs.size} product slugs are valid and 100% unique.`);

  // 2. Build Routes List
  const routes = [
    // Homepage
    {
      type: 'homepage',
      url: '/',
      outFile: path.join(distDir, 'index.html'),
      title: 'Gear Station — Premium Camera & Travel Gear Rentals | Hyderabad',
      description: 'Rent premium action cameras, DJI, Insta360, GoPro, riding gear, and outdoor adventure equipment in Hyderabad. Flexible daily rental plans from Gear Station.',
      canonical: 'https://gearstation.in/',
      ogImage: 'https://gearstation.in/gearstation_new_logo.png',
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
    // Category: Photography
    {
      type: 'category',
      url: '/categories/photography',
      outFile: path.join(distDir, 'categories', 'photography', 'index.html'),
      title: 'Photography & Camera Equipment on Rent in Hyderabad | Gear Station',
      description: 'Browse and rent Photography & Camera Equipment in Hyderabad with Gear Station. High-quality equipment, transparent pricing, and flexible rental plans.',
      canonical: 'https://gearstation.in/categories/photography',
      ogImage: 'https://gearstation.in/gearstation_new_logo.png',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Photography & Camera Equipment on Rent in Hyderabad',
        'description': 'Browse and rent Photography & Camera Equipment in Hyderabad with Gear Station. High-quality equipment, transparent pricing, and flexible rental plans.',
        'url': 'https://gearstation.in/categories/photography'
      }
    },
    // Category: Outdoor
    {
      type: 'category',
      url: '/categories/outdoor',
      outFile: path.join(distDir, 'categories', 'outdoor', 'index.html'),
      title: 'Outdoor & Adventure Gear on Rent in Hyderabad | Gear Station',
      description: 'Browse and rent Outdoor & Adventure Gear in Hyderabad with Gear Station. High-quality equipment, transparent pricing, and flexible rental plans.',
      canonical: 'https://gearstation.in/categories/outdoor',
      ogImage: 'https://gearstation.in/gearstation_new_logo.png',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Outdoor & Adventure Gear on Rent in Hyderabad',
        'description': 'Browse and rent Outdoor & Adventure Gear in Hyderabad with Gear Station. High-quality equipment, transparent pricing, and flexible rental plans.',
        'url': 'https://gearstation.in/categories/outdoor'
      }
    }
  ];

  // Add all 122 Products
  for (const p of ALL_PRODUCTS_LIST) {
    const slug = p.slug.trim().toLowerCase();
    const snippet = p.description ? p.description.slice(0, 95) : 'High quality rental equipment';
    const numericPrice = (p.price || '').replace(/[^0-9]/g, '') || '0';
    const cleanImageUrl = p.imageUrl
      ? (p.imageUrl.startsWith('http') ? p.imageUrl : `https://gearstation.in${p.imageUrl.startsWith('/') ? p.imageUrl : '/' + p.imageUrl}`)
      : 'https://gearstation.in/gearstation_new_logo.png';

    routes.push({
      type: 'product',
      slug,
      url: `/products/${slug}`,
      outFile: path.join(distDir, 'products', slug, 'index.html'),
      title: `${p.name} on Rent in Hyderabad | Gear Station`,
      description: `Rent ${p.name} in Hyderabad starting at ${p.price}/day. ${snippet}. Available with doorstep delivery from Gear Station.`,
      canonical: `https://gearstation.in/products/${slug}`,
      ogImage: cleanImageUrl,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': p.name,
        'description': p.description || `Rent ${p.name} in Hyderabad starting at ${p.price}/day from Gear Station.`,
        'image': cleanImageUrl,
        ...(p.brand ? { 'brand': { '@type': 'Brand', 'name': p.brand } } : {}),
        'offers': {
          '@type': 'Offer',
          'price': numericPrice,
          'priceCurrency': 'INR',
          'availability': 'https://schema.org/InStock',
          'url': `https://gearstation.in/products/${slug}`,
          'priceValidUntil': '2026-12-31'
        }
      }
    });
  }

  console.log(`Total routes queued for prerendering: ${routes.length}`);

  // 3. Render Each Route
  let successCount = 0;
  let failCount = 0;
  const failedRoutes = [];
  const sitemapUrls = [];

  const startTime = Date.now();

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    try {
      const { html: renderedAppHtml } = render(route.url);

      if (!renderedAppHtml || renderedAppHtml.length < 500) {
        throw new Error(`Rendered HTML suspiciously short (${renderedAppHtml?.length || 0} chars)`);
      }

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
      html = html.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${route.ogImage}" />`);

      // 6. Replace Twitter Card Tags
      html = html.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${route.canonical}" />`);
      html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${route.title}" />`);
      html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${route.description}" />`);
      html = html.replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="${route.ogImage}" />`);

      // 7. Inject Schema JSON-LD
      const schemaScript = `\n    <script type="application/ld+json">\n${JSON.stringify(route.schema, null, 2)}\n    </script>\n  </head>`;
      html = html.replace('</head>', schemaScript);

      const outDir = path.dirname(route.outFile);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      fs.writeFileSync(route.outFile, html, 'utf-8');

      successCount++;
      sitemapUrls.push({
        loc: route.canonical,
        priority: route.type === 'homepage' ? '1.0' : route.type === 'category' ? '0.9' : '0.8',
        changefreq: 'weekly'
      });

      if (i % 25 === 0 || i === routes.length - 1) {
        console.log(`[${i + 1}/${routes.length}] Prerendered ${route.url} (${(Buffer.byteLength(html) / 1024).toFixed(1)} kB)`);
      }
    } catch (err) {
      failCount++;
      failedRoutes.push({ url: route.url, error: err.message });
      console.error(`✗ FAILED: ${route.url} - ${err.message}`);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\nPrerendering finished in ${durationSec}s. Success: ${successCount}, Failures: ${failCount}`);

  if (failCount > 0) {
    console.error('Prerender failures detected:', failedRoutes);
    throw new Error(`${failCount} routes failed to prerender`);
  }

  // 4. Generate Production Sitemap
  console.log(`\nGenerating sitemap with ${sitemapUrls.length} entries...`);
  const today = new Date().toISOString().split('T')[0];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  // Write to dist/sitemap.xml
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log(`✓ Generated dist/sitemap.xml (${sitemapUrls.length} URLs)`);

  // Also update public/sitemap.xml so repository stays in sync
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
    console.log(`✓ Synchronized public/sitemap.xml (${sitemapUrls.length} URLs)`);
  }

  // Clean up dist-ssr
  if (fs.existsSync(distSsrDir)) {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
    console.log('✓ Cleaned up temporary SSR build directory (dist-ssr)');
  }

  console.log('\n=== Stage 3B Prerendering Complete ===');
}

prerender().catch((err) => {
  console.error('Prerender error:', err);
  process.exit(1);
});
