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
      'Inspiration image: ' + (() => {
        const fileInput = document.getElementById('inspirationImage');
        return fileInput && fileInput.files && fileInput.files[0]
          ? fileInput.files[0].name + ' (attach this photo when you message)'
          : 'None selected';
      })(),
      'Other details: ' + (value('notes') || 'None yet'),
      '',
      'Can you let me know availability and pricing?'
    ].join('\n');

    const updatePreview = () => {
      preview.textContent = buildText();
      preview.classList.add('show');
    };

    form.addEventListener('input', updatePreview);

    const inspirationInput = document.getElementById('inspirationImage');
    const inspirationPreview = document.getElementById('inspirationPreview');
    const inspirationPreviewImage = document.getElementById('inspirationPreviewImage');
    const inspirationFileName = document.getElementById('inspirationFileName');
    const removeInspiration = document.getElementById('removeInspiration');
    let inspirationObjectUrl = '';

    const clearInspiration = () => {
      if (inspirationObjectUrl) URL.revokeObjectURL(inspirationObjectUrl);
      inspirationObjectUrl = '';
      if (inspirationInput) inspirationInput.value = '';
      if (inspirationPreviewImage) inspirationPreviewImage.removeAttribute('src');
      if (inspirationFileName) inspirationFileName.textContent = '';
      if (inspirationPreview) inspirationPreview.hidden = true;
      updatePreview();
    };

    if (inspirationInput && inspirationPreview && inspirationPreviewImage && inspirationFileName) {
      inspirationInput.addEventListener('change', () => {
        const file = inspirationInput.files && inspirationInput.files[0];
        if (!file) {
          clearInspiration();
          return;
        }
        const allowed = ['image/jpeg','image/png','image/webp'];
        if (!allowed.includes(file.type)) {
          showToast('Please choose a JPG, PNG, or WebP image.');
          clearInspiration();
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          showToast('Please choose an image smaller than 5 MB.');
          clearInspiration();
          return;
        }
        if (inspirationObjectUrl) URL.revokeObjectURL(inspirationObjectUrl);
        inspirationObjectUrl = URL.createObjectURL(file);
        inspirationPreviewImage.src = inspirationObjectUrl;
        inspirationFileName.textContent = file.name;
        inspirationPreview.hidden = false;
        updatePreview();
      });
    }

    if (removeInspiration) removeInspiration.addEventListener('click', clearInspiration);

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

  // Click/tap any portfolio image to open a larger lightbox view.
  const lightboxImages = document.querySelectorAll(
    '.photo-collage img, .gallery img, .bento img, .treat-card img, .editorial-media img'
  );

  if (lightboxImages.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Expanded image">
        <button class="lightbox-close" type="button" aria-label="Close enlarged image">&times;</button>
        <div class="lightbox-inner">
          <img class="lightbox-image" src="" alt="">
          <div class="lightbox-caption"></div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const expandedImage = overlay.querySelector('.lightbox-image');
    const caption = overlay.querySelector('.lightbox-caption');
    const closeButton = overlay.querySelector('.lightbox-close');
    let lastTrigger = null;

    const closeLightbox = () => {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      expandedImage.removeAttribute('src');
      expandedImage.alt = '';
      caption.textContent = '';
      if (lastTrigger) lastTrigger.focus({preventScroll:true});
    };

    const openLightbox = img => {
      lastTrigger = img;
      expandedImage.src = img.currentSrc || img.src;
      expandedImage.alt = img.alt || 'Lamb\'s Cakes creation';
      caption.textContent = img.alt || '';
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    };

    lightboxImages.forEach(img => {
      img.classList.add('lightbox-trigger');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', (img.alt ? img.alt + '. ' : '') + 'Open larger image');
      img.addEventListener('click', () => openLightbox(img));
      img.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(img);
        }
      });
    });

    closeButton.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', event => {
      if (event.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && overlay.classList.contains('is-open')) closeLightbox();
    });
  }

})();