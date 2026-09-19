(() => {
  const demos = [...document.querySelectorAll('.demo')];
  const button = document.querySelector('#toggle-demos');
  const section = document.querySelector('.demo-grid');
  const projectVideo = document.querySelector('#project-video');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = !reducedMotion.matches;
  let visible = false;
  button.hidden = false;
  const updateLabel = () => {
    button.textContent = enabled ? 'Pause demos' : 'Play demos';
    button.setAttribute('aria-pressed', String(enabled));
  };
  const sync = () => {
    const play = enabled && visible && !document.hidden && projectVideo.paused;
    demos.forEach(video => {
      if (!play) { video.pause(); return; }
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.play().catch(() => { video.controls = true; });
    });
    updateLabel();
  };
  button.addEventListener('click', () => { enabled = !enabled; sync(); });
  document.addEventListener('visibilitychange', sync);
  projectVideo.addEventListener('play', sync);
  projectVideo.addEventListener('pause', sync);
  reducedMotion.addEventListener('change', event => { enabled = !event.matches; sync(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(section);
  } else { visible = true; sync(); }
  updateLabel();
})();

// Load demonstration media only near the viewport; pause hidden galleries.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mainVideo = document.querySelector('#project-video');
  const groups = [...document.querySelectorAll('[data-gallery]')].map(grid => {
    const toggle = grid.closest('.demo-section').querySelector('.gallery-toggle');
    const state = {grid, toggle, videos:[...grid.querySelectorAll('video')], visible:false, enabled:grid.dataset.autoplay === 'true' && !reduce.matches};
    toggle.hidden = false;
    toggle.addEventListener('click', () => {state.enabled = !state.enabled; sync(state);});
    if (grid.dataset.pageSize) {
      const section = grid.closest('.demo-section');
      const size = Number(grid.dataset.pageSize);
      const cards = [...grid.querySelectorAll('[data-layout]')];
      const pages = [...section.querySelectorAll('.gallery-page')];
      pages.forEach(pageButton => pageButton.addEventListener('click', () => {
        const page = Number(pageButton.dataset.page);
        cards.forEach((card, index) => {card.hidden = index < page * size || index >= (page + 1) * size;});
        pages.forEach(button => button.setAttribute('aria-pressed', String(button === pageButton)));
        section.querySelector('.gallery-page-label').textContent = `Scenes ${page * size + 1}–${Math.min((page + 1) * size, cards.length)} of ${cards.length}`;
        sync(state);
      }));
    }
    return state;
  });
  function sync(state) {
    const shouldPlay = state.visible && state.enabled && !document.hidden && mainVideo.paused;
    state.toggle.textContent = state.enabled ? 'Pause demos' : 'Play demos';
    state.toggle.setAttribute('aria-pressed',String(state.enabled));
    state.videos.forEach(video => {
      const selected = !video.closest('[hidden]');
      if (state.visible && selected && !video.getAttribute('src')) {video.src=video.dataset.src; video.preload='metadata';}
      if (shouldPlay && selected) video.play().catch(() => {});
      else video.pause();
    });
  }
  const syncAll = () => groups.forEach(sync);
  groups.forEach(state => {
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {state.visible=entries[0].isIntersecting;sync(state);},{threshold:0.05}).observe(state.grid);
    else {state.visible=true;sync(state);}
    state.toggle.textContent = state.enabled ? 'Pause demos' : 'Play demos';
  });
  document.addEventListener('visibilitychange',syncAll);
  mainVideo.addEventListener('play',syncAll);mainVideo.addEventListener('pause',syncAll);
  reduce.addEventListener('change',event => {if(event.matches) groups.forEach(s => s.enabled=false);syncAll();});
})();
