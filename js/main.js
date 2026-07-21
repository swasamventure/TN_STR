(() => {
  const header = document.getElementById('siteHeader');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mainNav');
  const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 35);
  setHeader(); window.addEventListener('scroll', setHeader, { passive: true });
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    header.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); header.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded', 'false');
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const filters = document.querySelectorAll('.gallery-filter button');
  const items = document.querySelectorAll('.gallery-item');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active')); button.classList.add('active');
    const filter = button.dataset.filter;
    items.forEach(item => item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter));
  }));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxText = lightbox.querySelector('p');
  const openLightbox = trigger => {
    lightboxImg.src = trigger.dataset.image;
    lightboxImg.alt = trigger.dataset.alt || '';
    lightboxText.textContent = trigger.dataset.alt || '';
    lightbox.showModal();
  };
  document.querySelectorAll('[data-image]').forEach(el => el.addEventListener('click', () => openLightbox(el)));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.open) lightbox.close(); });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
