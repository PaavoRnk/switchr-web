# Add Blog Post

Creates a new bilingual (EN + ES) blog post for Switchr.es, updating all required files.

## What you need from the user

Ask the user to provide (or infer from context):
- **Title** (English) — will generate the slug automatically
- **Description** — 150–160 char SEO meta description (English)
- **Content** — full article body (markdown or structured text). Include h2/h3 subheadings, paragraphs, bullet lists. Mention where inline images should go using `[IMAGE: filename.jpg "alt text"]` markers.
- **Header image filename** — e.g. `my-post-hero.jpg` (user should place it in `blog/images/` first)
- **Image alt text** — descriptive alt for the hero image
- **Category** — e.g. "Guides", "Tips", "News"
- **Tags** — comma-separated, e.g. "electricity bills, expat guide, Spain"
- **CTA type** — `whatsapp`, `upload`, or `general`
- **Related slugs** — up to 3 slugs of existing posts (optional, can be empty)
- **Reading time** — estimated minutes (count ~200 words/min)

## Steps to execute

### Step 1 — Generate slug

Lowercase the title, replace spaces and special chars with hyphens, strip accents and punctuation:
- "How to Read Your Spanish Electricity Bill" → `how-to-read-your-spanish-electricity-bill`

### Step 2 — Create English post: `blog/[SLUG].html`

Use the EN POST TEMPLATE below. Replace all `[TOKEN]` placeholders.

**[SLUG]** = generated slug  
**[EN_TITLE]** = English title  
**[EN_DESCRIPTION]** = English meta description  
**[DATE]** = today's date in YYYY-MM-DD format  
**[DATE_FORMATTED]** = e.g. "24 April 2026"  
**[IMAGE_ALT]** = hero image alt text  
**[CATEGORY]** = category  
**[TAGS_HTML]** = tags as `<span class="post-tag-chip">tag</span>` elements  
**[READING_TIME]** = number of minutes  
**[EN_CONTENT]** = full article HTML (convert markdown: `##` → `<h2>`, `###` → `<h3>`, paragraphs → `<p>`, `**bold**` → `<strong>`, bullet lists → `<ul><li>`, `[IMAGE: file.jpg "alt"]` → `<img src="/blog/images/file.jpg" alt="alt" class="post-img">`)  
**[CTA_BLOCK]** = one of the three CTA HTML blocks below  
**[RELATED_SLUGS_JSON]** = JSON array string, e.g. `["slug-one","slug-two"]` or `[]`

---

### Step 3 — Translate to Spanish

Translate the following to natural Spanish (not literal, use expat-friendly tone):
- Title → **[ES_TITLE]**
- Description → **[ES_DESCRIPTION]**
- Category → **[ES_CATEGORY]** (e.g. "Guides" → "Guías")
- Tags → **[ES_TAGS]** (translate each tag)
- Excerpt (first 1–2 sentences of content) → **[ES_EXCERPT]**
- Full content body → **[ES_CONTENT]** (same HTML structure, translated text, same image tags)
- CTA headings/copy → use the ES CTA block variants below

### Step 4 — Create Spanish post: `es/blog/[SLUG].html`

Use the ES POST TEMPLATE below with translated tokens. Same slug, `lang="es"`.

### Step 5 — Update `blog/posts.json`

Read the current file. Prepend this entry (newest first):
```json
{
  "slug": "[SLUG]",
  "title": "[EN_TITLE]",
  "description": "[EN_DESCRIPTION]",
  "excerpt": "[First 1–2 sentences of EN content, max 180 chars]",
  "date": "[DATE]",
  "image": "/blog/images/[IMAGE_FILENAME]",
  "imageAlt": "[IMAGE_ALT]",
  "category": "[CATEGORY]",
  "tags": [TAGS_AS_JSON_ARRAY],
  "readingTime": [READING_TIME],
  "cta": "[CTA_TYPE]",
  "relatedSlugs": [RELATED_SLUGS_JSON]
}
```

### Step 6 — Update `es/blog/posts.json`

Prepend the Spanish equivalent (same slug, translated fields).

### Step 7 — Update footer Blog columns

Read `blog/posts.json`. Take the 3 most recent entries (index 0–2). Update the `<div id="footer-blog-col">` in all 4 English footer components:

**`_components/footer.html`** and **`_components/footer-home.html`** — replace the entire `<div id="footer-blog-col">...</div>` with:
```html
<div class="footer-col" id="footer-blog-col">
  <h4>Blog</h4>
  <a href="/blog/[SLUG-1].html">[TITLE-1]</a>
  <a href="/blog/[SLUG-2].html">[TITLE-2]</a>
  <a href="/blog/[SLUG-3].html">[TITLE-3]</a>
  <a href="/blog/" style="color:rgba(255,255,255,0.55);font-weight:500;">View all →</a>
</div>
```
(Use as many entries as exist — if only 1 post, show only that one link + "View all →")

**`_components/footer-es.html`** and **`_components/footer-home-es.html`** — use ES titles from `es/blog/posts.json` and link to `/es/blog/[slug].html`:
```html
<div class="footer-col" id="footer-blog-col">
  <h4>Blog</h4>
  <a href="/es/blog/[SLUG-1].html">[ES_TITLE-1]</a>
  ...
  <a href="/es/blog/" style="color:rgba(255,255,255,0.55);font-weight:500;">Ver todos →</a>
</div>
```

Also update **`_components/footer-blog.html`** and **`_components/footer-blog-es.html`** with the same content.

### Step 8 — Update `sitemap.xml`

Insert before `</urlset>` (the closing tag):
```xml
  <url>
    <loc>https://switchr.es/blog/[SLUG].html</loc>
    <lastmod>[DATE]</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://switchr.es/blog/[SLUG].html"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://switchr.es/es/blog/[SLUG].html"/>
  </url>
  <url>
    <loc>https://switchr.es/es/blog/[SLUG].html</loc>
    <lastmod>[DATE]</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://switchr.es/blog/[SLUG].html"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://switchr.es/es/blog/[SLUG].html"/>
  </url>
```

### Step 9 — Run build.js

```
node build.js
```

This injects nav/footer into the new post pages and propagates footer changes to all existing pages.

### Step 10 — Ask about git push

Ask: **"Commit and push to GitHub? (yes/no)"**

If yes:
```
git add blog/[SLUG].html es/blog/[SLUG].html blog/posts.json es/blog/posts.json _components/footer.html _components/footer-home.html _components/footer-es.html _components/footer-home-es.html _components/footer-blog.html _components/footer-blog-es.html sitemap.xml
git commit -m "Add blog post: [EN_TITLE]"
git push origin master
```

---

## EN POST TEMPLATE

```html
<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google tag (gtag.js) — Consent Mode v2 -->
<script async data-cfasync="false" src="https://www.googletagmanager.com/gtag/js?id=G-ZF2VXXL0FP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','wait_for_update':500});
  if(localStorage.getItem('sw_cookie_consent')==='accepted'){gtag('consent','update',{'analytics_storage':'granted'})}
  gtag('js', new Date());
  gtag('config', 'G-ZF2VXXL0FP');
</script>
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","w0sc1rn5r8");
</script>
<script src="/language.js"></script>
<script defer src="/cookie-consent.js"></script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="canonical" href="https://switchr.es/blog/[SLUG].html">
<link rel="alternate" hreflang="en" href="https://switchr.es/blog/[SLUG].html">
<link rel="alternate" hreflang="es" href="https://switchr.es/es/blog/[SLUG].html">
<link rel="alternate" hreflang="x-default" href="https://switchr.es/blog/[SLUG].html">
<title>[EN_TITLE] — Switchr Blog</title>
<meta name="description" content="[EN_DESCRIPTION]">
<meta property="og:type" content="article">
<meta property="og:title" content="[EN_TITLE]">
<meta property="og:description" content="[EN_DESCRIPTION]">
<meta property="og:image" content="https://switchr.es/blog/images/[IMAGE_FILENAME]">
<meta property="og:url" content="https://switchr.es/blog/[SLUG].html">
<meta property="article:published_time" content="[DATE]T00:00:00Z">
<meta property="article:author" content="Paavo Raenk">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"[EN_TITLE]","description":"[EN_DESCRIPTION]","image":"https://switchr.es/blog/images/[IMAGE_FILENAME]","datePublished":"[DATE]","author":{"@type":"Person","name":"Paavo Raenk","url":"https://switchr.es/about.html"},"publisher":{"@type":"Organization","name":"Switchr","url":"https://switchr.es"}}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--g:#25D366;--gd:#128C7E;--sw:#0f7a45;--gp:#f0fdf4;--ink:#0a1a15;--ink2:#253d35;--ink3:#4e7265;--ink4:#8aada3;--bg:#f8fdfb;--white:#fff;--border:rgba(37,211,102,0.18);--border2:rgba(0,0,0,0.07);--r:12px;--r2:20px;}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--ink);overflow-x:hidden;}
nav{position:sticky;top:0;z-index:100;background:rgba(248,253,251,0.93);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:0 40px;height:60px;display:flex;align-items:center;justify-content:space-between;}
.logo{font-family:Sora,sans-serif;font-weight:700;font-size:20px;color:var(--ink);display:flex;align-items:center;gap:8px;text-decoration:none;}
.nav-links{display:flex;align-items:center;gap:28px;}
.nav-links a{font-size:14px;color:var(--ink2);text-decoration:none;transition:color .15s;}
.nav-links a:hover{color:var(--ink);}
.nav-cta{display:inline-flex;align-items:center;gap:6px;background:var(--g);color:#fff;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;font-family:'Sora',sans-serif;text-decoration:none;transition:background .2s;}
.nav-cta:hover{background:var(--gd);color:#fff;}
.hamburger{display:none;flex-direction:column;justify-content:center;gap:5px;background:none;border:none;cursor:pointer;padding:6px;z-index:101;flex-shrink:0;}
.hamburger span{display:block;width:22px;height:2px;border-radius:2px;background:var(--ink);}
.post-hero{width:100%;max-height:480px;overflow:hidden;background:var(--gp);}
.post-hero img{width:100%;height:480px;object-fit:cover;display:block;}
.post-header{background:var(--bg);padding:48px 40px 32px;border-bottom:1px solid var(--border2);}
.post-header-inner{max-width:720px;margin:0 auto;}
.blog-tag{display:inline-block;background:var(--gp);color:var(--sw);font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:16px;}
.post-header h1{font-family:'Sora',sans-serif;font-size:clamp(24px,3.5vw,42px);font-weight:800;color:var(--ink);line-height:1.15;letter-spacing:-.02em;margin-bottom:20px;}
.post-meta{display:flex;align-items:center;flex-wrap:wrap;gap:8px;font-size:13px;color:var(--ink4);}
.post-meta-sep{opacity:.4;}
.post-tag-chip{background:var(--gp);color:var(--sw);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600;}
.post-body{padding:48px 40px 80px;}
.post-content{max-width:720px;margin:0 auto;}
.post-content p{font-size:17px;color:var(--ink2);line-height:1.75;margin-bottom:24px;}
.post-content h2{font-family:'Sora',sans-serif;font-size:24px;font-weight:700;color:var(--ink);margin:40px 0 16px;letter-spacing:-.01em;}
.post-content h3{font-family:'Sora',sans-serif;font-size:19px;font-weight:600;color:var(--ink);margin:28px 0 12px;}
.post-content blockquote{border-left:3px solid var(--g);padding:16px 20px;margin:28px 0;background:var(--gp);border-radius:0 var(--r) var(--r) 0;}
.post-content blockquote p{color:var(--sw);font-weight:500;margin-bottom:0;}
.post-img{max-width:100%;border-radius:var(--r);margin:32px 0;display:block;box-shadow:0 2px 16px rgba(0,0,0,0.08);}
.post-content ul,.post-content ol{padding-left:24px;margin-bottom:24px;}
.post-content li{font-size:17px;color:var(--ink2);line-height:1.7;margin-bottom:8px;}
.post-content a{color:var(--sw);text-decoration:underline;text-underline-offset:3px;}
.post-content a:hover{color:var(--gd);}
.post-cta{max-width:720px;margin:48px auto;background:var(--ink);border-radius:var(--r2);padding:40px;text-align:center;}
.post-cta h3{font-family:'Sora',sans-serif;font-size:22px;font-weight:700;color:#fff;margin-bottom:12px;}
.post-cta p{font-size:15px;color:rgba(255,255,255,0.5);line-height:1.6;margin-bottom:28px;}
.cta-btn-wa{display:inline-flex;align-items:center;gap:8px;background:var(--g);color:#fff;padding:13px 28px;border-radius:10px;font-size:15px;font-weight:600;font-family:'Sora',sans-serif;text-decoration:none;transition:background .2s;}
.cta-btn-wa:hover{background:var(--gd);}
.cta-btn-upload,.cta-btn-general{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:13px 28px;border-radius:10px;font-size:15px;font-weight:600;font-family:'Sora',sans-serif;text-decoration:none;transition:background .2s;}
.cta-btn-upload:hover,.cta-btn-general:hover{background:rgba(255,255,255,0.18);}
.post-related{max-width:720px;margin:48px auto 0;padding-top:40px;border-top:1px solid var(--border2);}
.post-related h3{font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:var(--ink);margin-bottom:20px;text-transform:uppercase;letter-spacing:.05em;font-size:12px;}
.post-related-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;}
.related-card{background:#fff;border:1px solid var(--border2);border-radius:var(--r2);overflow:hidden;text-decoration:none;display:flex;flex-direction:column;transition:box-shadow .2s;}
.related-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.08);}
.related-card img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:var(--gp);}
.related-card-body{padding:16px;}
.related-card-body .blog-tag{margin-bottom:8px;}
.related-card-body h4{font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:var(--ink);line-height:1.35;}
footer{background:var(--ink);padding:56px 40px 32px;border-top:1px solid rgba(37,211,102,0.15);}
.footer-inner{max-width:1040px;margin:0 auto;}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:40px;margin-bottom:36px;}
.footer-brand p{font-size:13px;color:rgba(255,255,255,0.35);line-height:1.65;max-width:240px;margin-top:4px;}
.footer-col h4{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:12px;}
.footer-col a{display:block;font-size:13px;color:rgba(255,255,255,0.4);text-decoration:none;margin-bottom:7px;}
.footer-col a:hover{color:rgba(255,255,255,0.75);}
.footer-bottom{border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;text-align:center;}
.footer-bottom p{font-size:12px;color:rgba(255,255,255,0.2);margin-bottom:6px;}
@media(max-width:900px){.post-related-grid{grid-template-columns:1fr;}.footer-top{grid-template-columns:repeat(2,1fr);}}
@media(max-width:600px){nav{padding:0 20px;}.nav-links{display:none;}.hamburger{display:flex;}nav.menu-open .nav-links{display:flex;flex-direction:column;position:absolute;top:60px;left:0;right:0;background:rgba(248,253,251,0.97);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:12px 20px 18px;gap:2px;z-index:99;}nav.menu-open .nav-links a{color:var(--ink2)!important;padding:11px 10px;border-radius:8px;display:flex;font-size:15px;}nav.menu-open .nav-cta{background:var(--g)!important;color:#fff!important;justify-content:center;margin-top:6px;border-radius:9px;padding:12px 20px;}.post-hero img{height:260px;}.post-header{padding:32px 20px 24px;}.post-body{padding:32px 20px 60px;}.post-cta{padding:28px 20px;}.footer-top{grid-template-columns:1fr;}footer{padding:40px 20px 24px;}}
</style>
</head>
<body>

<!-- NAV:START -->
<!-- NAV:END -->

<div class="post-hero">
  <img src="/blog/images/[IMAGE_FILENAME]" alt="[IMAGE_ALT]">
</div>

<header class="post-header">
  <div class="post-header-inner">
    <span class="blog-tag">[CATEGORY]</span>
    <h1>[EN_TITLE]</h1>
    <div class="post-meta">
      <time datetime="[DATE]">[DATE_FORMATTED]</time>
      <span class="post-meta-sep">·</span>
      <span>[READING_TIME] min read</span>
      <span class="post-meta-sep">·</span>
      [TAGS_HTML]
    </div>
  </div>
</header>

<div class="post-body">
  <div class="post-content">
    [EN_CONTENT]
  </div>

  [CTA_BLOCK]

  <aside class="post-related" id="post-related" hidden>
    <h3>Related articles</h3>
    <div class="post-related-grid" id="related-grid"></div>
  </aside>
</div>

<!-- FOOTER:START -->
<!-- FOOTER:END -->

<script>
function toggleMenu(){var n=document.querySelector('nav');n.classList.toggle('menu-open');}
document.addEventListener('click',function(e){var n=document.querySelector('nav');if(n&&n.classList.contains('menu-open')&&!n.contains(e.target))n.classList.remove('menu-open');});

(function(){
  var related=[RELATED_SLUGS_JSON];
  if(!related.length)return;
  fetch('/blog/posts.json')
    .then(function(r){return r.json();})
    .then(function(posts){
      var cards=posts.filter(function(p){return related.indexOf(p.slug)!==-1;});
      if(!cards.length)return;
      var grid=document.getElementById('related-grid');
      grid.innerHTML=cards.map(function(p){
        var href='/blog/'+p.slug+'.html';
        return '<a href="'+href+'" class="related-card">'+
          '<img src="'+esc(p.image)+'" alt="'+esc(p.imageAlt||p.title)+'" loading="lazy" onerror="this.style.display=\'none\'">'+
          '<div class="related-card-body"><span class="blog-tag">'+esc(p.category)+'</span><h4>'+esc(p.title)+'</h4></div>'+
          '</a>';
      }).join('');
      document.getElementById('post-related').hidden=false;
    }).catch(function(){});
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
}());
</script>
</body>
</html>
```

---

## ES POST TEMPLATE

Same as EN template but:
- `<html lang="es">`
- All meta tags use ES equivalents (`[ES_TITLE]`, `[ES_DESCRIPTION]`)
- `canonical` → `https://switchr.es/es/blog/[SLUG].html`
- hreflang reversed (es canonical, en alternate)
- `<h1>[ES_TITLE]</h1>`
- `[DATE_FORMATTED]` in Spanish format (e.g. "24 de abril de 2026")
- `[READING_TIME] min de lectura`
- `[ES_CONTENT]` (translated content)
- ES CTA block (translated)
- `"Related articles"` → `"Artículos relacionados"`
- Related posts fetch from `/es/blog/posts.json`, links to `/es/blog/[slug].html`
- JSON-LD uses `[ES_TITLE]` and `[ES_DESCRIPTION]`

---

## CTA Block Variants

### whatsapp (EN)
```html
<div class="post-cta">
  <h3>Ready to cut your electricity bill?</h3>
  <p>Send your bill via WhatsApp — free comparison, no commitment, English spoken.</p>
  <a href="https://wa.me/34662403660" class="cta-btn-wa">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.526 5.526 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    Chat on WhatsApp
  </a>
</div>
```

### whatsapp (ES)
```html
<div class="post-cta">
  <h3>¿Listo para reducir tu factura de luz?</h3>
  <p>Envíanos tu factura por WhatsApp — comparación gratuita, sin compromiso, en español o inglés.</p>
  <a href="https://wa.me/34662403660" class="cta-btn-wa">
    [same SVG]
    Chatear por WhatsApp
  </a>
</div>
```

### upload (EN)
```html
<div class="post-cta">
  <h3>See exactly how much you could save</h3>
  <p>Upload your electricity bill and get a personalised comparison in minutes — free.</p>
  <a href="/" class="cta-btn-upload">Upload your bill →</a>
</div>
```

### upload (ES)
```html
<div class="post-cta">
  <h3>Descubre cuánto podrías ahorrar</h3>
  <p>Sube tu factura de luz y obtén una comparativa personalizada en minutos — gratis.</p>
  <a href="/es/" class="cta-btn-upload">Subir mi factura →</a>
</div>
```

### general (EN)
```html
<div class="post-cta">
  <h3>Switchr makes switching electricity simple</h3>
  <p>WhatsApp, email, or web — choose your channel and we handle everything else.</p>
  <a href="/" class="cta-btn-general">See how it works →</a>
</div>
```

### general (ES)
```html
<div class="post-cta">
  <h3>Switchr hace el cambio de luz sencillo</h3>
  <p>WhatsApp, email o web — elige tu canal y nosotros nos encargamos del resto.</p>
  <a href="/es/" class="cta-btn-general">Ver cómo funciona →</a>
</div>
```
