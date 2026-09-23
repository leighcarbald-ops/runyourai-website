(() => {
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open navigation');
    }));
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  const getEasternParts = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', weekday: 'short', hour: 'numeric',
      minute: '2-digit', hour12: false
    });
    return Object.fromEntries(formatter.formatToParts(new Date()).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  };

  const statusEl = document.getElementById('liveStatus');
  if (statusEl) {
    const p = getEasternParts();
    const dayIndex = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday);
    const hour = Number(p.hour === '24' ? '0' : p.hour);
    const minute = Number(p.minute);
    const nowMinutes = hour * 60 + minute;
    const isOpenDay = dayIndex >= 1 && dayIndex <= 6;
    const isOpen = isOpenDay && nowMinutes >= 9 * 60 && nowMinutes < 19 * 60;
    const text = statusEl.querySelector('span');
    if (isOpen) {
      text.textContent = 'Open now · until 7 PM ET';
    } else {
      statusEl.classList.add('closed');
      if (dayIndex === 0 || (dayIndex === 6 && nowMinutes >= 19 * 60)) {
        text.textContent = 'Closed · opens Monday at 9 AM ET';
      } else if (isOpenDay && nowMinutes < 9 * 60) {
        text.textContent = 'Closed · opens today at 9 AM ET';
      } else {
        text.textContent = 'Closed · opens tomorrow at 9 AM ET';
      }
    }
  }

  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(value);
        showToast('Copied to clipboard');
      } catch {
        const ta = document.createElement('textarea');
        ta.value = value; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove(); showToast('Copied to clipboard');
      }
    });
  });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const v = id => document.getElementById(id).value.trim();
      const subject = 'RunYourAI Business Consultation — ' + v('business');
      const body = [
        'Name: ' + v('name'),
        'Business or nonprofit: ' + v('business'),
        'Email: ' + v('email'),
        'Phone: ' + (v('phone') || 'Not provided'),
        '',
        'What I would like help with:',
        v('help')
      ].join('\n');
      const status = document.getElementById('formStatus');
      if (status) status.textContent = 'Opening your email app…';
      window.location.href = 'mailto:Help@runyourai.pro?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 }) : null;
  document.querySelectorAll('.reveal').forEach(el => {
    if (observer) observer.observe(el); else el.classList.add('visible');
  });
})();