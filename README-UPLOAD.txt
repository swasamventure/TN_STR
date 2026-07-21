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

  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dots button')];
  let slideIndex = 0;
  const showSlide = i => {
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === slideIndex));
    dots.forEach((d, n) => d.classList.toggle('active', n === slideIndex));
  };
  dots.forEach((d, i) => d.addEventListener('click', () => showSlide(i)));
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => showSlide(slideIndex + 1), 6500);

  const filters = document.querySelectorAll('.gallery-filter button');
  const items = [...document.querySelectorAll('.gallery-item')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active')); button.classList.add('active');
    const filter = button.dataset.filter;
    items.forEach(item => item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter));
  }));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxText = lightbox.querySelector('p');
  const lightboxCount = lightbox.querySelector('.lightbox-count');
  let gallery = [...document.querySelectorAll('[data-image]')];
  let currentImage = 0;
  const renderLightbox = () => {
    const trigger = gallery[currentImage];
    lightboxImg.src = trigger.dataset.image;
    lightboxImg.alt = trigger.dataset.alt || '';
    lightboxText.textContent = trigger.dataset.alt || '';
    lightboxCount.textContent = `${currentImage + 1} / ${gallery.length}`;
  };
  gallery.forEach((el, i) => el.addEventListener('click', () => { currentImage = i; renderLightbox(); lightbox.showModal(); }));
  lightbox.querySelector('.prev').addEventListener('click', () => { currentImage = (currentImage - 1 + gallery.length) % gallery.length; renderLightbox(); });
  lightbox.querySelector('.next').addEventListener('click', () => { currentImage = (currentImage + 1) % gallery.length; renderLightbox(); });
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.open) return;
    if (e.key === 'Escape') lightbox.close();
    if (e.key === 'ArrowLeft') lightbox.querySelector('.prev').click();
    if (e.key === 'ArrowRight') lightbox.querySelector('.next').click();
  });

  const plans = {
    family: { title: 'Family adventure', steps: ['Start with a relaxed cabin breakfast.', 'Spend the day at Dollywood or The Island.', 'Return for dinner and a private hot-tub wind-down.'] },
    romantic: { title: 'Relaxing escape', steps: ['Enjoy a slow morning and coffee at the cabin.', 'Take a scenic drive or visit Gatlinburg.', 'End with dinner, mountain air, and a quiet soak.'] },
    outdoors: { title: 'Outdoor weekend', steps: ['Pack an early breakfast and head toward the national park.', 'Choose a waterfall trail or scenic drive.', 'Recover with a home-cooked meal and hot tub time.'] },
    dollywood: { title: 'Dollywood trip', steps: ['Leave after breakfast for a full park day.', 'Stay through the evening entertainment.', 'Return to a comfortable cabin instead of another hotel room.'] }
  };
  const plannerResult = document.getElementById('plannerResult');
  const renderPlan = key => {
    const p = plans[key];
    plannerResult.innerHTML = `<p class="eyebrow">Suggested itinerary</p><h3>${p.title}</h3><ol>${p.steps.map(s => `<li>${s}</li>`).join('')}</ol><a class="text-link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=Sevierville+TN+attractions">Explore nearby places ↗</a>`;
  };
  document.querySelectorAll('.planner-options button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.planner-options button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); renderPlan(btn.dataset.plan);
  }));
  renderPlan('family');

  const weatherCodes = {0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Cloudy',45:'Foggy',48:'Foggy',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Rain showers',82:'Heavy showers',95:'Thunderstorms'};
  fetch('https://api.open-meteo.com/v1/forecast?latitude=35.8681&longitude=-83.5618&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      document.getElementById('weatherTemp').textContent = `${Math.round(data.current.temperature_2m)}°F · ${weatherCodes[data.current.weather_code] || 'Current conditions'}`;
      document.getElementById('weatherDetail').textContent = 'Live conditions for Sevierville';
    }).catch(() => {
      document.getElementById('weatherTemp').textContent = 'Check local forecast';
      document.getElementById('weatherDetail').textContent = 'Weather data is temporarily unavailable';
    });
  const updateClock = () => {
    document.getElementById('localTime').textContent = new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit'}).format(new Date());
  };
  updateClock(); setInterval(updateClock, 60000);
  document.getElementById('year').textContent = new Date().getFullYear();
})();
