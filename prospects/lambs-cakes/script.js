(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label','Open navigation');
    }));
  }

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.08}) : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));

  const toast = document.getElementById('toast');
  let timer;
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  const form = document.getElementById('orderPlanner');
  const preview = document.getElementById('orderPreview');
  if (form && preview) {
    const value = id => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };
    const buildText = () => [
      "Hi Lamb's Cakes! I'd like to ask about an order.",
      '',
      'Date needed: ' + (value('orderDate') || 'Not entered yet'),
      'Treat: ' + (value('orderType') || 'Not entered yet'),
      'Quantity / servings: ' + (value('quantity') || 'Not entered yet'),
      'Theme / colors: ' + (value('theme') || 'Not entered yet'),
      'Flavor ideas: ' + (value('flavor') || 'Not entered yet'),
      'Other details: ' + (value('notes') || 'None yet'),
      '',
      'Can you let me know availability and pricing?'
    ].join('\n');

    const updatePreview = () => {
      preview.textContent = buildText();
      preview.classList.add('show');
    };

    form.addEventListener('input', updatePreview);
    updatePreview();

    const copyBtn = document.getElementById('copyOrder');
    if (copyBtn) copyBtn.addEventListener('click', async () => {
      const text = buildText();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast('Order details copied — paste them into Facebook.');
    });
  }
})();