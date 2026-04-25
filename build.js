// Switchr component build script
// Usage: node build.js
// Edit files in _components/, then run this to push changes to all pages.

const fs = require('fs');

const staticPages = [
  { file: 'index.html',                nav: 'nav-home',    footer: 'footer-home' },
  { file: 'how-it-works.html',         nav: 'nav',         footer: 'footer'      },
  { file: 'contact.html',              nav: 'nav',         footer: 'footer'      },
  { file: 'privacy-policy.html',       nav: 'nav-lang',    footer: 'footer'      },
  { file: 'terms-and-conditions.html', nav: 'nav-lang',    footer: 'footer'      },
  { file: 'blog/index.html',           nav: 'nav-blog',    footer: 'footer-blog'    },
  // Spanish pages
  { file: 'es/index.html',             nav: 'nav-home-es', footer: 'footer-home-es'    },
  { file: 'es/how-it-works.html',      nav: 'nav-es',      footer: 'footer-es'         },
  { file: 'es/contact.html',           nav: 'nav-es',      footer: 'footer-es'         },
  { file: 'es/sample-report.html',     nav: 'nav-es',      footer: 'footer-es'         },
  { file: 'es/blog/index.html',        nav: 'nav-blog-es', footer: 'footer-blog-es'    },
];

// Dynamic: discover blog post pages from posts.json
let blogPostPages = [];
let blogPostPagesEs = [];
try {
  const posts = JSON.parse(fs.readFileSync('blog/posts.json', 'utf8'));
  blogPostPages = posts
    .map(p => ({ file: `blog/${p.slug}.html`, nav: 'nav-blog', footer: 'footer-blog' }))
    .filter(p => fs.existsSync(p.file));
  blogPostPagesEs = posts
    .map(p => ({ file: `es/blog/${p.slug}.html`, nav: 'nav-blog-es', footer: 'footer-blog-es' }))
    .filter(p => fs.existsSync(p.file));
} catch (e) {
  console.warn('  ⚠️  Could not read blog/posts.json — skipping blog post pages');
}

const pages = [...staticPages, ...blogPostPages, ...blogPostPagesEs];

function inject(html, tag, content) {
  const re = new RegExp(`<!-- ${tag}:START -->[\\s\\S]*?<!-- ${tag}:END -->`, 'g');
  const replacement = `<!-- ${tag}:START -->\n${content}\n<!-- ${tag}:END -->`;
  if (!re.test(html)) {
    console.warn(`  ⚠️  No ${tag}:START/END markers found`);
    return html;
  }
  return html.replace(new RegExp(`<!-- ${tag}:START -->[\\s\\S]*?<!-- ${tag}:END -->`, 'g'), replacement);
}

pages.forEach(({ file, nav, footer }) => {
  if (!fs.existsSync(file)) {
    console.warn(`  ⚠️  Skipping missing file: ${file}`);
    return;
  }
  const navContent    = fs.readFileSync(`_components/${nav}.html`, 'utf8').trim();
  const footerContent = fs.readFileSync(`_components/${footer}.html`, 'utf8').trim();
  let html = fs.readFileSync(file, 'utf8');
  html = inject(html, 'NAV', navContent);
  html = inject(html, 'FOOTER', footerContent);
  fs.writeFileSync(file, html);
  console.log(`✓ ${file}`);
});

console.log('\nDone! All pages updated.');
