(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
      });
    });
  }

  const path = window.location.pathname;
  const onHomepage = !path.includes('/local-visibility-audit/') && !path.includes('/ai-support-onboarding/');

  if (onHomepage) {
    document.querySelectorAll('a[href="#visibility-audit"], a[href^="mailto:leighh@runyourai.pro?subject=RunYourAI%20Local%20Visibility%20Audit"]').forEach(link => {
      link.setAttribute('href', 'local-visibility-audit/');
    });

    const supportActions = document.querySelector('#support-bot .card-actions');
    if (supportActions) {
      const existingStart = supportActions.querySelector('.btn-primary');
      if (existingStart) {
        existingStart.textContent = 'Start Your Project';
        existingStart.setAttribute('href', 'ai-support-onboarding/');
      }
      const requestDemo = supportActions.querySelector('.btn-secondary');
      if (requestDemo) {
        requestDemo.textContent = 'Try the Live Demo';
        requestDemo.setAttribute('href', 'ai-support-demo/');
      }
    }

    const visibilityActions = document.querySelector('#visibility-audit .card-actions');
    if (visibilityActions) {
      const primary = visibilityActions.querySelector('.btn-primary');
      if (primary) {
        primary.textContent = 'Start My Visibility Audit';
        primary.setAttribute('href', 'local-visibility-audit/onboarding/');
      }
    }
  }

  if (path.includes('/local-visibility-audit/') && !path.includes('/onboarding/')) {
    document.querySelectorAll('.audit-price-card .btn-primary, .audit-hero .hero-actions .btn-primary').forEach(link => {
      link.textContent = link.closest('.audit-price-card') ? 'Choose My Audit & Pay' : 'Start My Audit';
      link.setAttribute('href', 'onboarding/');
    });

    const paymentNote = document.querySelector('.payment-note');
    if (paymentNote) {
      paymentNote.innerHTML = '<strong>Payment first, then intake</strong><span>Choose the $99 founding offer if a qualifying spot remains, or the regular $149 audit. After successful Stripe checkout, you will return to the RunYourAI onboarding page to complete the intake. Optional maintenance starts at $149/month and is separate from the one-time audit.</span>';
    }
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }
})();