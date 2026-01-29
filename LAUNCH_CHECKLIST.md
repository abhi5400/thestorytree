# Pre-Launch Checklist – The Story Tree

All critical and high-impact issues from the audit have been addressed. Use this checklist to confirm before going live.

---

## Critical (must complete before launch)

| # | Item | Status | Notes |
|---|------|--------|--------|
| 1 | **Forms send to real email** | ⬜ | Replace `EMAILJS_CONFIG` in `script.js` with your EmailJS Service ID, single Template ID, and Public Key. Use `emailjs-unified-template.html`. See `SETUP.md`. |
| 2 | **Test form submissions** | ⬜ | Submit Contact and Booking forms and confirm emails arrive. |
| 3 | **Test on mobile** | ⬜ | Open site on phone; test nav, forms, and lightbox. |

---

## Implemented fixes (no action needed)

### Forms
- ✅ Contact and Booking forms submit via EmailJS using one template (config in `script.js`; HTML in `emailjs-unified-template.html`).
- ✅ Success: thank-you overlay; failure: error notification.
- ✅ Honeypot field `_gotcha` on both forms for anti-spam.
- ✅ Client-side validation and error messages.
- ✅ `inputmode` and `autocomplete` on form fields.

### Contact & trust
- ✅ Email only: clickable `mailto:` link (info@pallavisinghoffical.com). Phone and WhatsApp removed per request.

### Broken assets
- ✅ Replaced missing `speech-drama-boy.jpg`, `girl-with-books.jpg`, `girl-pointing.jpg` with existing images: `School event .jpg`, `ngo and community.jpg`, `image 5.jpg`, and reused where appropriate.

### Lightbox
- ✅ Duplicate lightbox index fixed: collage indices 19–48 are unique; prev/next and counter work for all 49 images.

### SEO
- ✅ `sitemap.xml` added.
- ✅ `robots.txt` added (references sitemap).
- ✅ OG/Twitter image URL uses encoded filename (`Store%20tree%20banner.png`).
- ✅ Schema `image` URL encoded.
- ✅ Descriptive alt text on Media Coverage and collage images.

### AEO (FAQ + schema)
- ✅ FAQ section with 6 questions (What is The Story Tree, Who is Pallavi Singh, How to book, Age groups, Schools/NGOs, Where based).
- ✅ FAQPage JSON-LD schema in `<head>`.
- ✅ ContactPoint schema includes `telephone`.

### Accessibility & UX
- ✅ `:focus-visible` styles (green outline) for keyboard users.
- ✅ Modal and lightbox focus trapping (existing + Escape to close).
- ✅ Minimum tap targets (44px) for buttons and nav links.
- ✅ `inputmode` and `autocomplete` on form inputs.

### Trust & legal
- ✅ Privacy Policy modal (how we use form data, no sharing, email only).
- ✅ Privacy link in footer and near Contact and Booking forms.
- ✅ Footer year set to 2025.

### Performance
- ✅ Lazy loading on non-hero images (unchanged).
- ✅ Hero image preload (unchanged).
- ⏭ WebP and `srcset` left optional; see `SETUP.md` if you want to add them.

---

## After you complete the critical items

1. Replace Formspree IDs and phone number (see `SETUP.md`).
2. Run through the critical checklist above.
3. Optionally run Lighthouse (Performance, Accessibility, Best Practices) and fix any remaining issues.
4. Deploy and re-test forms and links on the live URL.

---

**Launch readiness (after config):** Forms, trust elements, assets, lightbox, SEO, AEO, accessibility, and privacy are in place. Once Formspree and phone number are set and tested, the site is ready for launch with an estimated **8/10** launch-readiness score.
