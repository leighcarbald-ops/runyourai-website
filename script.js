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
    if (nav && !nav.querySelector('a[href="#scheduler"]')) {
      const schedulerLink = document.createElement('a');
      schedulerLink.href = '#scheduler';
      schedulerLink.textContent = 'Appointment Scheduler';
      const visibilityLink = nav.querySelector('a[href="#visibility-audit"], a[href="local-visibility-audit/"]');
      if (visibilityLink) nav.insertBefore(schedulerLink, visibilityLink);
      else {
        const navCta = nav.querySelector('.nav-cta');
        if (navCta) nav.insertBefore(schedulerLink, navCta);
        else nav.appendChild(schedulerLink);
      }
    }

    if (nav && !nav.querySelector('a[href="ai-support-demo/"]')) {
      const liveDemoLink = document.createElement('a');
      liveDemoLink.href = 'ai-support-demo/';
      liveDemoLink.textContent = 'Live Demo';
      const navCta = nav.querySelector('.nav-cta');
      if (navCta) nav.insertBefore(liveDemoLink, navCta);
      else nav.appendChild(liveDemoLink);
    }

    const productsHeading = document.querySelector('#products .section-heading h2');
    if (productsHeading) productsHeading.textContent = 'Four practical ways to put RunYourAI to work now.';

    const productGrid = document.querySelector('#products .product-grid');
    if (productGrid && !document.getElementById('scheduler')) {
      const schedulerCard = document.createElement('article');
      schedulerCard.id = 'scheduler';
      schedulerCard.className = 'product-card featured reveal';
      schedulerCard.innerHTML = `
        <div class="card-topline"><span>Booking solution</span><span class="pill">Appointments</span></div>
        <h3>RunYourAI Appointment Scheduler</h3>
        <p class="card-lede">A flexible appointment-booking system for local businesses. Sell it as a standalone scheduling solution or add it to the RunYourAI AI Customer Support System for a more complete customer experience.</p>
        <ul class="feature-list">
          <li>Works for salons, auto shops, dog groomers, tattoo shops, and custom business types</li>
          <li>Service-based scheduling with configurable appointment durations</li>
          <li>Optional staff selection for staff-based businesses</li>
          <li>Automatic staff assignment for service-only businesses</li>
          <li>Recurring staff hours and real-time availability</li>
          <li>Optional service pricing display</li>
          <li>Customer booking confirmations and 24-hour reminders</li>
          <li>Can launch directly from the AI Customer Support System</li>
        </ul>
        <div class="price-panel">
          <div><span>Standalone option</span><strong>Available separately</strong><small>One-time setup plus monthly maintenance.</small></div>
          <div class="founding-price"><span>AI Support System add-on</span><strong>Premium add-on</strong><small>Can be integrated with the chatbot so customers can move directly from questions to booking.</small></div>
          <div><span>Pricing</span><strong>Ask for current quote</strong><small>Exact standalone setup and monthly maintenance pricing has not yet been published on the site.</small></div>
        </div>
        <div class="card-actions">
          <a class="btn btn-primary" href="mailto:Help@runyourai.pro?subject=RunYourAI%20Appointment%20Scheduler">Ask About the Scheduler</a>
          <a class="btn btn-secondary" href="ai-support-demo/">See the AI Support Demo</a>
        </div>`;

      const visibilityCard = document.getElementById('visibility-audit');
      if (visibilityCard) productGrid.insertBefore(schedulerCard, visibilityCard);
      else productGrid.appendChild(schedulerCard);
    }

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