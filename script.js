(() => {
  const path = window.location.pathname;

  // Final site-wide polish: keep the full navigation usable before the phone breakpoint
  // and use the approved purple-to-blue-to-cyan gradient treatment consistently.
  const polish = document.createElement('style');
  polish.textContent = `
    .gradient-text{background:linear-gradient(90deg,#b86cff 0%,#7c5cff 38%,#4b8cff 70%,#4dd7ff 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
    .nav-links a{white-space:nowrap}
    @media (min-width:761px){.nav-wrap{gap:16px}.brand-logo{width:190px}.nav-links{gap:14px}.nav-links a{font-size:.84rem}}
    @media (min-width:761px) and (max-width:1120px){.nav-wrap{min-height:68px}.brand-logo{width:180px;max-height:48px}.menu-toggle{display:block}.nav-links{position:absolute;top:68px;left:16px;right:16px;display:none;flex-direction:column;align-items:stretch;gap:0;background:#0d0d14;border:1px solid var(--line);border-radius:16px;padding:8px;box-shadow:var(--shadow)}.nav-links.open{display:flex}.nav-links a{padding:13px 12px;border-radius:10px;font-size:.95rem}.nav-cta{margin-top:5px;text-align:center}}
  `;
  document.head.appendChild(polish);

  // Homepage compatibility helpers. These only add a missing service if an older
  // cached copy of the homepage is ever served; the current homepage already has them.
  if (path === '/' || path === '/index.html') {
    const nav = document.querySelector('.nav-links');
    if (nav && !nav.querySelector('a[href="website-building/"]')) {
      const aiSupport = nav.querySelector('a[href="ai-support/"]');
      const websiteLink = document.createElement('a');
      websiteLink.href = 'website-building/';
      websiteLink.textContent = 'Website Building';
      if (aiSupport) nav.insertBefore(websiteLink, aiSupport); else nav.prepend(websiteLink);
    }
    if (nav && !nav.querySelector('a[href="review-funnel/"]')) {
      const liveDemo = nav.querySelector('a[href="ai-support-demo/"]');
      const reviewLink = document.createElement('a');
      reviewLink.href = 'review-funnel/';
      reviewLink.textContent = 'Review Funnel';
      if (liveDemo) nav.insertBefore(reviewLink, liveDemo); else nav.appendChild(reviewLink);
    }

    const grid = document.querySelector('.solutions-grid');
    if (grid && !grid.querySelector('[data-service="website-building"]')) {
      const card = document.createElement('article');
      card.className = 'solution-card featured reveal visible';
      card.dataset.service = 'website-building';
      card.innerHTML = '<div class="solution-kicker"><span>Website Building</span><span class="solution-number">01</span></div><h3>Give your business a professional website built around what you actually need.</h3><p>A modern, mobile-friendly 4-page business website personalized with your branding, information, and style choices—with a mockup before the final build.</p><ul class="solution-points"><li>Landing/Home page plus 3 additional pages</li><li>Personalized business design and responsive layout</li><li>No required monthly maintenance fee</li></ul><div class="solution-footer"><div class="solution-price"><span>Website build</span><strong>$800 · Intro $500</strong></div><a class="solution-link" href="website-building/">Explore Website Building →</a></div>';
      grid.prepend(card);
      [...grid.querySelectorAll('.solution-card')].forEach((item, i) => {
        const number = item.querySelector('.solution-number');
        if (number) number.textContent = String(i + 1).padStart(2, '0');
      });
    }

    const stack = document.querySelector('.console-stack');
    if (stack && !stack.querySelector('[data-service="website-building"]')) {
      const row = document.createElement('div');
      row.className = 'console-row';
      row.dataset.service = 'website-building';
      row.innerHTML = '<div class="console-icon">01</div><div><strong>Website Building</strong><small>Professional 4-page business websites</small></div><span class="status-chip">READY</span>';
      stack.prepend(row);
      [...stack.querySelectorAll('.console-row')].forEach((item, i) => {
        const icon = item.querySelector('.console-icon');
        if (icon) icon.textContent = String(i + 1).padStart(2, '0');
      });
    }

    const heading = document.querySelector('#solutions .section-heading h2');
    if (heading) heading.textContent = 'Practical solutions for building and growing your business.';
    const footerLinks = document.querySelector('.footer-links');
    if (footerLinks && !footerLinks.querySelector('a[href="website-building/"]')) {
      const first = footerLinks.firstElementChild;
      const link = document.createElement('a');
      link.href = 'website-building/';
      link.textContent = 'Website Building';
      footerLinks.insertBefore(link, first);
    }
  }

  // Mobile/tablet navigation. Do not rewrite page navigation here: each public page
  // now owns the same complete navigation markup.
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }));
  }

  if (path.includes('/ai-support-demo/')) {
    document.addEventListener('click', event => {
      if (!event.target || event.target.id !== 'buildDemo') return;
      const input = document.getElementById('businessUrl');
      if (!input) return;
      const value = input.value.trim();
      if (value && !/^https?:\/\//i.test(value)) input.value = 'https://' + value;
    }, true);
  }

  if (path.includes('/local-visibility-audit/') && !path.includes('/purchase/') && !path.includes('/report/') && !path.includes('/onboarding/') && !path.includes('/demo/')) {
    document.querySelectorAll('.audit-price-card .btn-primary, .audit-hero .hero-actions .btn-primary').forEach(link => {
      link.textContent = link.closest('.audit-price-card') ? 'Choose My Audit & Pay' : 'Start My Audit';
      link.setAttribute('href', 'purchase/');
    });
    const heroActions = document.querySelector('.audit-hero .hero-actions');
    if (heroActions && !heroActions.querySelector('[data-audit-demo]')) {
      const demo = document.createElement('a');
      demo.className = 'btn btn-secondary';
      demo.dataset.auditDemo = '1';
      demo.href = 'demo/';
      demo.textContent = 'View Audit Demo';
      demo.setAttribute('aria-label', 'View the Local Visibility Audit demo');
      heroActions.appendChild(demo);
    }
    const paymentNote = document.querySelector('.payment-note');
    if (paymentNote) paymentNote.innerHTML = '<strong>Payment, then audit intake</strong><span>Choose the $99 founding offer if a qualifying spot remains, or the regular $149 audit. After payment, complete the Audit Intake on this page so RunYourAI can begin. There is no monthly maintenance subscription for this product.</span>';
    document.querySelectorAll('.faq-list details').forEach(item => {
      const summary = item.querySelector('summary');
      if (summary && summary.textContent.trim() === 'Is there a monthly fee?') {
        const p = item.querySelector('p');
        if (p) p.textContent = 'No. The Local Visibility Audit is a one-time purchase. If you want RunYourAI to implement recommended fixes, that work is quoted separately.';
      }
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));
})();