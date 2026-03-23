// Switchr component build script
// Usage: node build.js
// Edit files in _components/, then run this to push changes to all pages.

const fs = require('fs');

const pages = [
  { file: 'index.html',                nav: 'nav-home',    footer: 'footer-home' },
  { file: 'how-it-works.html',         nav: 'nav',         footer: 'footer'      },
  { file: 'contact.html',              nav: 'nav',         footer: 'footer'      },
  { file: 'privacy-policy.html',       nav: 'nav-lang',    footer: 'footer'      },
  { file: 'terms-and-conditions.html', nav: 'nav-lang',    footer: 'footer'      },
  // Spanish pages
  { file: 'es/index.html',             nav: 'nav-home-es', footer: 'footer-home-es' },
  { file: 'es/how-it-works.html',      nav: 'nav-es',      footer: 'footer-es'      },
  { file: 'es/contact.html',           nav: 'nav-es',      footer: 'footer-es'      },
  { file: 'es/sample-report.html',     nav: 'nav-es',      footer: 'footer-es'      },
];

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
  const navContent    = fs.readFileSync(`_components/${nav}.html`, 'utf8').trim();
  const footerContent = fs.readFileSync(`_components/${footer}.html`, 'utf8').trim();
  let html = fs.readFileSync(file, 'utf8');
  html = inject(html, 'NAV', navContent);
  html = inject(html, 'FOOTER', footerContent);
  fs.writeFileSync(file, html);
  console.log(`✓ ${file}`);
});

console.log('\nDone! All pages updated.');
