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