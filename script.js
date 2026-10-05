(() => {
  const nav = document.querySelector('.kinetic-nav');
  const button = document.querySelector('.menu-btn');
  const closeMenu = () => {
    nav.classList.remove('menu-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Apri menu');
  };
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
  });
  nav.querySelectorAll('nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('menu-open')) { closeMenu(); button.focus(); }
  });
  matchMedia('(max-width:900px)').addEventListener('change', closeMenu);
  // Original smooth circular project cursor, independent of GSAP.
  const cursor = document.querySelector('.cursor');
  const pointer = matchMedia('(min-width:901px) and (hover:hover) and (pointer:fine)');
  if (cursor) {
    const label = cursor.querySelector('span');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    let frame = 0;
    const hide = () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(0)';
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const follow = () => {
      cx += (tx - cx) * .16;
      cy += (ty - cy) * .16;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      frame = requestAnimationFrame(follow);
    };
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', e => {
        if (!pointer.matches) return;
        tx = e.clientX; ty = e.clientY;
        label.textContent = el.dataset.cursor;
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        if (!frame) follow();
      });
      el.addEventListener('mouseleave', hide);
    });
    pointer.addEventListener('change', hide);
    window.addEventListener('blur', hide);
    document.addEventListener('mouseleave', hide);
  }
  // Content remains visible without animation libraries and on small screens.
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const accent = document.querySelector('.accent-word');
  accent.innerHTML = [...accent.textContent.trim()].map(c => `<span class="brand-letter">${c}</span>`).join('');
  const mm = gsap.matchMedia();
  mm.add('(min-width:901px) and (prefers-reduced-motion:no-preference)', () => {
    gsap.from('.kinetic-brand, .kinetic-links', {opacity:0, duration:.6});
    gsap.from('.hero-title .line', {y:35, opacity:0, duration:1, stagger:.13, ease:'power3.out'});
    gsap.to('.hero-stamp', {rotation:360, duration:18, repeat:-1, ease:'none'});
    gsap.to('.hero-loop div', {xPercent:-33.333, duration:10, repeat:-1, ease:'none'});
    gsap.timeline({repeat:-1, repeatDelay:1.5, delay:1.4})
      .to('.brand-letter', {y:i=>i%2?-8:6,duration:.35,stagger:.04})
      .to('.brand-letter', {y:0,duration:.6,stagger:.04,ease:'power2.out'});
    gsap.utils.toArray('.reveal-text, .cutout-copy, .services-intro h2, .urban-copy h2, .design h2, .about-grid > *, .contact h2').forEach(el => {
      gsap.from(el,{y:32,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
    });
    gsap.utils.toArray('.cutout-visual').forEach(el => {
      gsap.from(el,{opacity:.5,duration:.8,scrollTrigger:{trigger:el,start:'top 95%',once:true}});
    });
    gsap.utils.toArray('.urban .card').forEach((el,i) => {
      gsap.to(el,{y:(i-1)*-45,ease:'none',scrollTrigger:{trigger:'.urban',start:'top bottom',end:'bottom top',scrub:1}});
    });
    // Re-measure after assets load; matchMedia reverts animations on mobile.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load',refresh,{once:true});
    return () => window.removeEventListener('load',refresh);
  });
})();
