# AVIRAN GLOBAL Website Manual (Beginner Friendly)

This guide explains how to manually update the website without advanced coding knowledge.

Use this guide for:
- changing images
- changing product catalog PDFs
- changing email and phone numbers
- updating blog posts

## 1) Before You Start

1. Open the project folder in VS Code.
2. Always keep a backup copy before editing.
3. After each change, save and refresh the browser.

Main folders you will use:
- `assets/img/` -> image files (logo/favicon/local images)
- `catalogs/` -> product catalog PDF files
- `public/blogs.json` -> blog post content
- `.html` files -> website page text and links
- `lead-handler.php` -> where inquiry emails are sent

## 2) Change Images

You can use:
- online image URLs (current site mostly uses Unsplash URLs), or
- local files inside `assets/img/`

### A) Replace image URL in HTML

Edit image `src` values in:
- `index.html`
- `products.html`

Example:
```html
<img class="product-thumb" src="https://your-new-image-url.jpg" alt="Coffee" />
```

### B) Use local image files instead of URL

1. Put your image file in `assets/img/` (example: `coffee.jpg`).
2. Update HTML:

```html
<img class="product-thumb" src="assets/img/coffee.jpg" alt="Coffee" />
```

### C) Update blog images

Blog images are controlled in `public/blogs.json` using the `image` field for each post.

Example:
```json
"image": "assets/img/blog-coffee.jpg"
```

### D) Change browser icon (favicon)

Replace file:
- `assets/img/favicon.svg`

Keep same file name to avoid updating all pages.

## 3) Recommended Image Sizes (Important)

These sizes match current design and avoid stretched/cropped visuals.

- Hero main image (`.hero-photo`): use around `1400 x 900`
- Hero small images (`.hero-photo-sm`): use around `900 x 600`
- Home product cards (`.product-thumb`): use around `1200 x 800`
- Product page cards (`.product-page-thumb`): use around `1400 x 900`
- Blog images (`.blog-image`): use around `1400 x 900`

Rules:
- Keep landscape ratio (wider than tall).
- Use JPG/WebP for photos.
- Try to keep image file size under 300 KB to load faster.

## 4) Change Product Catalog PDFs

Catalog files are inside `catalogs/`.

Current files:
- `catalogs/coffee-catalog.pdf`
- `catalogs/cardamom-catalog.pdf`
- `catalogs/handloom-catalog.pdf`
- `catalogs/dehydrated-catalog.pdf`
- `catalogs/company-profile.pdf`

### Option 1 (easiest, recommended)

Keep same filename and replace the PDF file content.
No HTML changes needed.

### Option 2 (if filename changes)

If you rename a PDF, update all links in:
- `index.html`
- `products.html`

Example:
```html
<a href="catalogs/new-coffee-catalog.pdf" download>Download Coffee Catalog</a>
```

## 5) Change Email and Phone Number

There are two different things:
- text shown on website
- email address that receives inquiry form submissions

### A) Change visible email/phone on pages

Update values in these files:
- `index.html`
- `contact.html`
- `about.html`
- `privacy-policy.html`
- `terms-conditions.html`

Important in `contact.html`:
- `mailto:...` email link
- `tel:...` phone link
- WhatsApp link `https://wa.me/...`

Example format:
- `mailto:sales@yourdomain.com`
- `tel:+911234567890`
- `https://wa.me/911234567890`

### B) Change form receiver email (very important)

When a user submits inquiry forms, email is sent to the address in:
- `lead-handler.php`

Edit this line:
```php
$to = 'your-inbox@example.com';
```

If this is not changed, inquiries will still go to old inbox.

## 6) Update Blog Posts

Blog list and blog detail page are driven by:
- `public/blogs.json`

### A) Add a new blog post

Inside `posts` array, add one more object with this structure:

```json
{
	"id": 4,
	"slug": "your-blog-slug",
	"title": "Your Blog Title",
	"summary": "Short summary text",
	"category": "Coffee",
	"date": "2026-06-28",
	"readTime": "5 min read",
	"author": "AVIRAN GLOBAL Team",
	"image": "assets/img/your-blog-image.jpg",
	"content": [
		"Paragraph 1 text.",
		"Paragraph 2 text.",
		"Paragraph 3 text."
	]
}
```

### B) Blog rules

- `id` should be unique (no duplicate number)
- `slug` should be unique and URL-safe (`lowercase-with-dashes`)
- `date` format must be `YYYY-MM-DD`
- keep valid JSON (commas and brackets must be correct)

If JSON is invalid, blog page will show load error.

## 7) Quick Testing Checklist After Changes

1. Open `index.html`, `products.html`, `contact.html`, `blog.html`.
2. Check all changed images are visible.
3. Click each catalog download button.
4. Click email, phone, and WhatsApp links on contact page.
5. Open a blog detail page and verify image/text.
6. Submit contact form once and confirm mail is received at updated inbox.

## 8) Useful Tip (Search and Replace)

For changing old email/phone everywhere:
1. Press `Ctrl + Shift + F` in VS Code.
2. Search old value (example: `info@aviranglobal.com`).
3. Replace all carefully.
4. Review every file before saving.

## 9) Common Mistakes to Avoid

- Renaming a catalog PDF but forgetting to update HTML link
- Putting very large image files (slow website)
- Editing `public/blogs.json` with invalid JSON format
- Updating visible email in HTML but not updating `lead-handler.php`

---

If you want, this README can also be split into separate mini-guides:
- `IMAGE-UPDATE.md`
- `CATALOG-UPDATE.md`
- `BLOG-UPDATE.md`
- `CONTACT-UPDATE.md`