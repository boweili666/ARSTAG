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
