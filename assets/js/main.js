const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

// Load Bootstrap Icons globally so all pages can use consistent iconography.
const bootstrapIconsHref = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
if (!document.querySelector(`link[href="${bootstrapIconsHref}"]`)) {
  const iconStylesheet = document.createElement('link');
  iconStylesheet.rel = 'stylesheet';
  iconStylesheet.href = bootstrapIconsHref;
  document.head.appendChild(iconStylesheet);
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
  });
}

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((item) => observer.observe(item));

const forms = document.querySelectorAll('[data-demo-form]');

const successModal = document.createElement('div');
successModal.className = 'success-modal';
successModal.innerHTML = `
  <div class="success-modal-card" role="dialog" aria-modal="true" aria-labelledby="success-modal-title">
    <div class="success-icon-wrap" aria-hidden="true">
      <i class="bi bi-check2-circle success-icon"></i>
      <div class="success-particles">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>
    <h3 id="success-modal-title">Request Submitted</h3>
    <p id="success-modal-message">Thank you. Our team will get back to you shortly.</p>
    <button type="button" class="btn btn-primary" id="success-modal-ok">Great</button>
  </div>
`;
document.body.appendChild(successModal);

const successMessageEl = successModal.querySelector('#success-modal-message');
const successOkBtn = successModal.querySelector('#success-modal-ok');

function showSuccessModal(message) {
  if (successMessageEl) {
    successMessageEl.textContent = message;
  }
  successModal.classList.add('open');
}

function closeSuccessModal() {
  successModal.classList.remove('open');
}

successOkBtn.addEventListener('click', closeSuccessModal);
successModal.addEventListener('click', (event) => {
  if (event.target === successModal) closeSuccessModal();
});

async function submitLead(payload) {
  try {
    const response = await fetch('lead-handler.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

forms.forEach((form) => {
  const notice = form.querySelector('.notice');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    const ok = await submitLead({
      type: 'contact_inquiry',
      page: window.location.pathname,
      data: formData
    });

    if (notice) {
      notice.classList.add('show');
      notice.textContent = ok
        ? 'Thank you. Your request has been recorded. Our export team will reply within 24 hours.'
        : 'Thank you. Your request is captured locally. Please also contact us by email for faster response.';
    }

    showSuccessModal(
      ok
        ? 'Thank you. Your request has been submitted successfully. Our export team will contact you within 24 hours.'
        : 'Thanks. We captured your request, but mail delivery may be delayed. Please also reach us by email for immediate support.'
    );

    form.reset();
  });
});

const downloadLinks = Array.from(document.querySelectorAll('a[download]'));
let pendingDownloadHref = '';
let pendingDownloadName = '';

if (downloadLinks.length) {
  const modal = document.createElement('div');
  modal.className = 'lead-modal';
  modal.innerHTML = `
    <div class="lead-modal-card" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
      <h3 id="lead-modal-title">Get Product Catalog</h3>
      <p>Please share your contact details to receive the requested catalog.</p>
      <form id="download-lead-form">
        <div class="form-grid">
          <div><label for="dl-name">Name</label><input id="dl-name" name="name" required /></div>
          <div><label for="dl-company">Company</label><input id="dl-company" name="company" required /></div>
          <div><label for="dl-email">Email</label><input id="dl-email" name="email" type="email" required /></div>
          <div><label for="dl-phone">Phone</label><input id="dl-phone" name="phone" required /></div>
        </div>
        <div class="lead-modal-actions">
          <button type="submit" class="btn btn-primary">Submit & Download</button>
          <button type="button" class="btn btn-secondary" id="lead-cancel">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const downloadForm = modal.querySelector('#download-lead-form');
  const cancelBtn = modal.querySelector('#lead-cancel');

  function closeModal() {
    modal.classList.remove('open');
    pendingDownloadHref = '';
    pendingDownloadName = '';
  }

  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  downloadLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      pendingDownloadHref = link.getAttribute('href') || '';
      pendingDownloadName = link.textContent.trim();
      modal.classList.add('open');
    });
  });

  downloadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(downloadForm).entries());
    const downloadTarget = pendingDownloadHref;
    await submitLead({
      type: 'catalog_download_request',
      page: window.location.pathname,
      requestedAsset: pendingDownloadName,
      requestedUrl: downloadTarget,
      data
    });

    showSuccessModal('Thanks for sharing your details. Your download will begin now.');
    closeModal();
    if (downloadTarget) {
      window.location.href = downloadTarget;
    }
  });
}

const iconRules = [
  { test: (a) => a.getAttribute('href') === 'index.html' || /home/i.test(a.textContent), icon: 'house-door' },
  { test: (a) => a.getAttribute('href') === 'about.html' || /about/i.test(a.textContent), icon: 'people' },
  { test: (a) => a.getAttribute('href') === 'products.html' || /product/i.test(a.textContent), icon: 'box-seam' },
  { test: (a) => a.getAttribute('href') === 'export-services.html' || /service/i.test(a.textContent), icon: 'globe2' },
  { test: (a) => a.getAttribute('href') === 'quality-assurance.html' || /quality/i.test(a.textContent), icon: 'patch-check' },
  { test: (a) => a.getAttribute('href') === 'markets.html' || /market/i.test(a.textContent), icon: 'geo-alt' },
  { test: (a) => a.getAttribute('href') === 'blog.html' || /blog/i.test(a.textContent), icon: 'journal-text' },
  { test: (a) => a.getAttribute('href') === 'contact.html' || /contact/i.test(a.textContent), icon: 'envelope' },
  { test: (a) => /catalog|download/i.test(a.textContent), icon: 'download' },
  { test: (a) => /quote|inquire|inquiry|requirement/i.test(a.textContent), icon: 'send-check' },
  { test: (a) => /privacy/i.test(a.textContent), icon: 'shield-lock' },
  { test: (a) => /terms/i.test(a.textContent), icon: 'file-earmark-text' }
];

function decorateLinkWithIcon(anchor, iconName) {
  if (!anchor || anchor.querySelector('.bi') || anchor.classList.contains('brand')) {
    return;
  }

  const icon = document.createElement('i');
  icon.className = `bi bi-${iconName}`;
  icon.setAttribute('aria-hidden', 'true');
  anchor.prepend(icon);
  anchor.classList.add('link-with-icon');
}

document.querySelectorAll('a').forEach((anchor) => {
  const rule = iconRules.find((candidate) => candidate.test(anchor));
  if (rule) {
    decorateLinkWithIcon(anchor, rule.icon);
  }
});

const floatingCta = document.createElement('a');
floatingCta.href = 'contact.html';
floatingCta.className = 'floating-quote-cta';
floatingCta.setAttribute('aria-label', 'Request a quote');
floatingCta.innerHTML = '<i class="bi bi-send-check" aria-hidden="true"></i>Request Quote';
floatingCta.classList.add('link-with-icon');
document.body.appendChild(floatingCta);
