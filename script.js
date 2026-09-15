(() => {
  const path = window.location.pathname;

  if (path === '/' || path.endsWith('/index.html')) {
    const nav = document.querySelector('.nav-links');
    if (nav && !nav.querySelector('a[href="website-building/"]')) {
      const aiSupport = nav.querySelector('a[href="ai-support/"]');
      const websiteLink = document.createElement('a');
      websiteLink.href = 'website-building/';
      websiteLink.textContent = 'Website Building';
      if (aiSupport) nav.insertBefore(websiteLink, aiSupport); else nav.prepend(websiteLink);
    }

    const grid = document.querySelector('.solutions-grid');
    if (grid && !grid.querySelector('[data-service="website-building"]')) {
      const card = document.createElement('article');
      card.className = 'solution-card featured reveal visible';
      card.dataset.service = 'website-building';
      card.innerHTML = '<div class="solution-kicker"><span>Website Building</span><span class="solution-number">01</span></div><h3>Give your business a professional website built around what you actually need.</h3><p>A modern, mobile-friendly 4-page business website personalized with your branding, information, and style choices—with a mockup before the final build.</p><ul class="solution-points"><li>Landing/Home page plus 3 additional pages</li><li>Personalized business design and responsive layout</li><li>No required monthly maintenance fee</li></ul><div class="solution-footer"><div class="solution-price"><span>Website build</span><strong>$800 · Intro $500</strong></div><a class="solution-link" href="website-building/">Explore Website Building →</a></div>';
      grid.prepend(card);
      [...grid.querySelectorAll('.solution-card')].forEach((item, i) => { const number = item.querySelector('.solution-number'); if (number) number.textContent = String(i + 1).padStart(2, '0'); });
    }

    const stack = document.querySelector('.console-stack');
    if (stack && !stack.querySelector('[data-service="website-building"]')) {
      const row = document.createElement('div');
      row.className = 'console-row'; row.dataset.service = 'website-building';
      row.innerHTML = '<div class="console-icon">01</div><div><strong>Website Building</strong><small>Professional 4-page business websites</small></div><span class="status-chip">READY</span>';
      stack.prepend(row);
      [...stack.querySelectorAll('.console-row')].forEach((item, i) => { const icon = item.querySelector('.console-icon'); if (icon) icon.textContent = String(i + 1).padStart(2, '0'); });
    }

    const heading = document.querySelector('#solutions .section-heading h2');
    if (heading) heading.textContent = 'Practical solutions for building and growing your business.';
    const footerLinks = document.querySelector('.footer-links');
    if (footerLinks && !footerLinks.querySelector('a[href="website-building/"]')) {
      const link = document.createElement('a'); link.href='website-building/'; link.textContent='Website Building'; footerLinks.insertBefore(link, footerLinks.firstElementChild);
    }
  }

  const servicePages = ['/website-building/', '/ai-support/', '/appointment-scheduler/', '/local-visibility-audit/', '/review-funnel/'];
  if (servicePages.some(page => path.includes(page)) && !path.includes('/onboarding/')) {
    const serviceNav = document.querySelector('.nav-links');
    if (serviceNav) {
      serviceNav.innerHTML = [
        ['/', 'Home'], ['/website-building/', 'Website Building'], ['/ai-support/', 'Your AI Support Agent'], ['/appointment-scheduler/', 'Scheduler'], ['/visibility-check/', 'Visibility Audit'], ['/review-funnel/', 'Review Funnel']
      ].map(([href, label]) => `<a href="${href}">${label}</a>`).join('');
    }
  }

  const menuButton = document.querySelector('.menu-toggle'); const nav = document.querySelector('.nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => { const isOpen = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(isOpen)); menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation'); });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); }));
  }

  if (path.includes('/ai-support-demo/')) {
    document.addEventListener('click', event => { if (!event.target || event.target.id !== 'buildDemo') return; const input = document.getElementById('businessUrl'); if (!input) return; const value = input.value.trim(); if (value && !/^https?:\/\//i.test(value)) input.value = 'https://' + value; }, true);
  }

  const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.12}); revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));
})();