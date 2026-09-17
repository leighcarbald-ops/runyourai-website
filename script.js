(() => {
  // Site-wide visual polish and responsive navigation support.
  const polish = document.createElement('style');
  polish.textContent = `
    .gradient-text{background:linear-gradient(90deg,#b86cff 0%,#7c5cff 38%,#4b8cff 70%,#4dd7ff 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
    .nav-links a{white-space:nowrap}
    @media (min-width:761px){.nav-wrap{gap:16px}.brand-logo{width:190px}.nav-links{gap:14px}.nav-links a{font-size:.84rem}}
    @media (min-width:761px) and (max-width:1120px){.nav-wrap{min-height:68px}.brand-logo{width:180px;max-height:48px}.menu-toggle{display:block}.nav-links{position:absolute;top:68px;left:16px;right:16px;display:none;flex-direction:column;align-items:stretch;gap:0;background:#0d0d14;border:1px solid var(--line);border-radius:16px;padding:8px;box-shadow:var(--shadow)}.nav-links.open{display:flex}.nav-links a{padding:13px 12px;border-radius:10px;font-size:.95rem}.nav-cta{margin-top:5px;text-align:center}}
  `;
  document.head.appendChild(polish);

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) {
    if (!menuButton.getAttribute('aria-label')) menuButton.setAttribute('aria-label', 'Open navigation');
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

  // Demo URL convenience: accept a bare domain and normalize it before submission.
  if (window.location.pathname.includes('/ai-support-demo/')) {
    document.addEventListener('click', event => {
      if (!event.target || event.target.id !== 'buildDemo') return;
      const input = document.getElementById('businessUrl');
      if (!input) return;
      const value = input.value.trim();
      if (value && !/^https?:\/\//i.test(value)) input.value = 'https://' + value;
    }, true);
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
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }
})();