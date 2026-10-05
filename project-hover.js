(() => {
  const galleries = [
    ['prada', pradaPhotos], ['hublot', hublotPhotos],
    ['montblanc', montblancPhotos], ['mini', miniPhotos],
    ['sector', sectorPhotos], ['fabs', fabsPhotos],
    ['lenovo', lenovoPhotos], ['txt', txtPhotos]
  ];
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  galleries.forEach(([name, photos]) => {
    const button = document.querySelector(`.${name}-gallery-open`);
    const image = button?.querySelector('img');
    if (!image || photos.length < 2) return;
    let timer, active = false, index = -1, generation = 0, animation, overlay;
    function stop() {
      active = false;
      generation++;
      clearTimeout(timer);

    }
    function schedule() { timer = setTimeout(advance, 1300); }
    async function advance() {
      if (!active) return;
      const token = generation;
      const next = (index + 1) % photos.length;
      const photo = photos[next];
      const preload = new Image();
      preload.src = photo.src;
      try { await preload.decode(); } catch { if (active && token === generation) schedule(); return; }
      if (!active || token !== generation) return;
      // Keep the outgoing photo above the new one during the crossfade.
      animation?.cancel();
      overlay?.remove();
      overlay = image.cloneNode(false);
      overlay.alt = '';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.classList.add('project-fade-layer');
      button.append(overlay);
      const outgoing = overlay;
      index = next;
      image.src = photo.src;
      image.alt = photo.alt;
      animation = outgoing.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, easing: 'ease-in-out', fill: 'forwards' });
      animation.onfinish = () => { outgoing.remove(); if (overlay === outgoing) overlay = null; };
      schedule();
    }
    button.addEventListener('pointerenter', () => {
      if (!hover.matches || reduced.matches || active) return;
      active = true;
      generation++;
      timer = setTimeout(advance, 350);
    });
    button.addEventListener('pointerleave', stop);
    button.addEventListener('click', stop);
    button.addEventListener('pointercancel', stop);
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    reduced.addEventListener('change', stop);
    hover.addEventListener('change', stop);
  });
})();
