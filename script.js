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
  const onHomepage = path === '/' || path.endsWith('/index.html');

  if (onHomepage) {
    const readability = document.createElement('style');
    readability.textContent = `
      #products .product-card{display:flex;flex-direction:column}
      #products .product-card .card-actions{margin-top:auto;padding-top:8px}
      #products .product-card .feature-list{grid-template-columns:1fr;margin:20px 0}
      #products .product-card .feature-list li:nth-child(n+4){display:none}
      @media(max-width:760px){
        .eyebrow{font-size:.88rem;line-height:1.45}
        .fine-print,.price-panel small{font-size:.92rem;line-height:1.55}
        #products .product-card{padding:26px}
        #products .product-card h3{font-size:2rem}
        #products .product-card .card-lede{font-size:1.05rem}
      }
    `;
    document.head.appendChild(readability);

    if (nav) {
      const productsLink = nav.querySelector('a[href="#products"]');
      if (productsLink) productsLink.textContent = 'Solutions';

      const supportLink = nav.querySelector('a[href="#support-bot"]');
      if (supportLink) {
        supportLink.href = 'ai-support/';
        supportLink.textContent = 'AI Support';
      }

      let schedulerLink = nav.querySelector('a[href="#scheduler"]');
      if (!schedulerLink) {
        schedulerLink = document.createElement('a');
        const visibilityLink = nav.querySelector('a[href="#visibility-audit"], a[href="local-visibility-audit/"]');
        if (visibilityLink) nav.insertBefore(schedulerLink, visibilityLink);
        else nav.appendChild(schedulerLink);
      }
      schedulerLink.href = 'appointment-scheduler/';
      schedulerLink.textContent = 'Scheduler';

      const visibilityLink = nav.querySelector('a[href="#visibility-audit"]');
      if (visibilityLink) visibilityLink.href = 'local-visibility-audit/';

      if (!nav.querySelector('a[href="ai-support-demo/"]')) {
        const liveDemoLink = document.createElement('a');
        liveDemoLink.href = 'ai-support-demo/';
        liveDemoLink.textContent = 'Live Demo';
        const navCta = nav.querySelector('.nav-cta');
        if (navCta) nav.insertBefore(liveDemoLink, navCta);
        else nav.appendChild(liveDemoLink);
      }
    }

    const productsHeading = document.querySelector('#products .section-heading h2');
    if (productsHeading) productsHeading.textContent = 'Four practical ways to put RunYourAI to work.';
    const productsIntro = document.querySelector('#products .section-heading p');
    if (productsIntro) productsIntro.textContent = 'Start with the problem you want to solve. Each solution has its own page with the full details.';

    const support = document.getElementById('support-bot');
    if (support) {
      support.innerHTML = `
        <div class="card-topline"><span>Premium solution</span><span class="pill">AI Support</span></div>
        <h3>AI Customer Support System</h3>
        <p class="card-lede">A business-specific AI assistant that answers customer questions from knowledge you approve and captures requests, leads, and appointment interest.</p>
        <ul class="feature-list compact">
          <li>Answers from approved business knowledge</li>
          <li>Captures customer requests and contact information</li>
          <li>Expandable with the RunYourAI Appointment Scheduler</li>
        </ul>
        <div class="price-panel">
          <div><span>Setup</span><strong>$1,500</strong><small>$750 to start + $750 at delivery/go-live.</small></div>
          <div class="founding-price"><span>Founding Client setup</span><strong>$1,200</strong><small>First 5 qualifying clients.</small></div>
          <div><span>Monthly service</span><strong>Starting at $199/month</strong></div>
        </div>
        <div class="card-actions"><a class="btn btn-primary" href="ai-support/">Learn More</a><a class="btn btn-secondary" href="ai-support-demo/">Try the Live Demo</a></div>`;
    }

    const review = document.getElementById('review-funnel');
    if (review) {
      review.innerHTML = `
        <div class="card-topline"><span>Quick-win product</span><span class="pill">Reviews</span></div>
        <h3>Review Funnel QR</h3>
        <p class="card-lede">A simple QR-based review flow that makes it easier for customers to leave a public review or send private feedback.</p>
        <ul class="feature-list compact">
          <li>Free preview before purchase</li>
          <li>No monthly subscription for the base product</li>
          <li>Finished QR sign generated after purchase</li>
        </ul>
        <div class="launch-box"><span class="launch-kicker">Free preview before you pay.</span><div class="price-line"><span>Regular price</span><strong>$25 one-time</strong></div><div class="price-line special"><span>Launch special</span><strong>$15</strong></div><small>For the first 25 businesses.</small></div>
        <div class="card-actions"><a class="btn btn-primary wide" href="https://review.runyourai.pro/create">Create My Free Preview</a></div>`;
    }

    const visibility = document.getElementById('visibility-audit');
    if (visibility) {
      visibility.innerHTML = `
        <div class="card-topline"><span>Done-for-you service</span><span class="pill">Local Visibility</span></div>
        <h3>Local Visibility Audit</h3>
        <p class="card-lede">A professional review of your website and local visibility signals, with a score, prioritized findings, and a practical action plan.</p>
        <ul class="feature-list compact">
          <li>Overall Local Visibility Score</li>
          <li>Technical, on-page, local, content, and accessibility review</li>
          <li>Prioritized recommendations and 30-day action plan</li>
        </ul>
        <div class="price-panel"><div><span>Standard audit</span><strong>$149 one-time</strong></div><div class="founding-price"><span>Founding offer</span><strong>$99 one-time</strong><small>First 10 qualifying customers.</small></div><div><span>Optional maintenance</span><strong>Starting at $149/month</strong></div></div>
        <div class="card-actions"><a class="btn btn-primary" href="local-visibility-audit/">Learn More</a><a class="btn btn-secondary" href="local-visibility-audit/onboarding/">Start My Audit</a></div>`;
    }

    const productGrid = document.querySelector('#products .product-grid');
    if (productGrid && !document.getElementById('scheduler')) {
      const scheduler = document.createElement('article');
      scheduler.id = 'scheduler';
      scheduler.className = 'product-card featured reveal';
      scheduler.innerHTML = `
        <div class="card-topline"><span>Booking solution</span><span class="pill">Appointments</span></div>
        <h3>Appointment Scheduler</h3>
        <p class="card-lede">Flexible online booking for small businesses. Use it by itself or connect it to the AI Customer Support System for a complete support-and-booking experience.</p>
        <ul class="feature-list compact">
          <li>Service-based scheduling with custom appointment lengths</li>
          <li>Optional staff selection or automatic staff assignment</li>
          <li>Booking confirmations and 24-hour reminders</li>
        </ul>
        <div class="price-panel"><div><span>Standalone</span><strong>Available separately</strong><small>One-time setup plus monthly maintenance.</small></div><div class="founding-price"><span>With AI Support</span><strong>Premium add-on</strong><small>Customers can move directly from a conversation to booking.</small></div></div>
        <div class="card-actions"><a class="btn btn-primary" href="appointment-scheduler/">Learn More</a><a class="btn btn-secondary" href="mailto:Help@runyourai.pro?subject=RunYourAI%20Appointment%20Scheduler">Ask About It</a></div>`;
      productGrid.insertBefore(scheduler, visibility || null);
    }

    const finalCopy = document.querySelector('#contact .final-card p');
    if (finalCopy) finalCopy.textContent = 'Explore AI customer support, appointment scheduling, local visibility, or a simple review funnel—then choose the solution that fits your business.';
  }

  if (path.includes('/local-visibility-audit/') && !path.includes('/onboarding/')) {
    document.querySelectorAll('.audit-price-card .btn-primary, .audit-hero .hero-actions .btn-primary').forEach(link => {
      link.textContent = link.closest('.audit-price-card') ? 'Choose My Audit & Pay' : 'Start My Audit';
      link.setAttribute('href', 'onboarding/');
    });
    const paymentNote = document.querySelector('.payment-note');
    if (paymentNote) paymentNote.innerHTML = '<strong>Payment first, then intake</strong><span>Choose the $99 founding offer if a qualifying spot remains, or the regular $149 audit. After successful Stripe checkout, you will return to the RunYourAI onboarding page to complete the intake. Optional maintenance starts at $149/month and is separate from the one-time audit.</span>';
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