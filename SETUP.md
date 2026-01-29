# Launch Setup – The Story Tree

Before going live, complete these steps so forms and contact details work correctly.

---

## 1. Form submission (EmailJS)

Both the **Contact** and **Booking** forms use a **single EmailJS template**.

1. Go to [https://dashboard.emailjs.com](https://dashboard.emailjs.com) and create an account.
2. Add an **Email Service** (e.g. Gmail) and note your **Service ID**.
3. Create **one email template**. Copy the HTML from **`emailjs-unified-template.html`** into the template **Content** (set type to **HTML**). In the template **Settings**, set **Subject** to: **`{{subject_line}}`** — this makes Booking emails show "New Booking from The Story Tree: [name]" and Contact emails "New Contact from The Story Tree: [name]" so you can tell them apart in your inbox.
4. Copy the template’s **Template ID** and your account **Public Key** (Account → API Keys).
5. In **`script.js`**, find the `EMAILJS_CONFIG` object at the top and set:

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY'
};
```

6. Save and test: submit both the contact form and the booking form and confirm you receive the emails.

**Not receiving emails (form shows “Thank you” but nothing in inbox)?**

- **To Email:** In the EmailJS dashboard, open your **Email Template** and check **Settings**. There must be a **To Email** (recipient) set to the address where you want leads (e.g. `info@pallavisinghoffical.com`). If this is blank or wrong, emails won’t reach you.
- **Email Service:** Open **Email Services** → your service (e.g. Gmail). Ensure the connected account is correct. For Gmail, use **App Password** (not your normal password) if 2FA is on.
- **Spam:** Check your spam/junk folder and “Promotions” (Gmail).
- **Browser console:** Submit the form again, open DevTools (F12) → **Console**. If EmailJS fails, an error will appear there.
- **Template variables:** The template in the EmailJS dashboard must use the same variable names as in **`emailjs-unified-template.html`** (e.g. `{{form_type}}`, `{{name}}`, `{{email}}`, `{{phone}}`, `{{organization}}`, `{{session_type_label}}`, `{{preferred_date}}`, etc.). If names don’t match, emails may not send or may be empty.

---

## 2. Contact email

The site shows **info@pallavisinghoffical.com** for contact. To change it, search for this address in **`index.html`** (Contact section, footer, Privacy Policy modal, and JSON-LD schema) and replace with your preferred email.

---

## 3. Sitemap and robots (if domain changes)

- **`sitemap.xml`** and **`robots.txt`** use `https://storytree.com/`.
- If your live domain is different, replace `https://storytree.com` in:
  - `sitemap.xml`
  - `robots.txt`
  - All canonical and OG meta tags in `index.html`

---

## 4. Optional: WebP and responsive images

For better performance you can:

- Export hero and key images as WebP and use `<picture>` with `<source type="image/webp">` and a fallback `<img>`.
- Add `srcset` and `sizes` on the hero image for different screen widths.

Lazy loading is already applied to non-hero images.

---

After completing steps 1 and 2, test on a real device (especially mobile) and confirm leads arrive in your inbox.
