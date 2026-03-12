// Casey's Chicago Death Tour — Application Logic
// Two modes: long-scroll article (default) and walking tour map (overlay)

(function () {
  'use strict';

  const THEME_COLORS = {
    intro:       '#0077b6',
    business:    '#9b2226',
    fire:        '#C60C30',
    military:    '#5c4033',
    exposition:  '#b5911a',
    maritime:    '#1d6b8a',
    environment: '#2d6a4f',
    outro:       '#0077b6'
  };

  // ─── Mode Switching ───────────────────────────────────────────────────────────
  let mapInitialized = false;

  window.openMapMode = function () {
    document.getElementById('scroll-view').classList.add('hidden');
    document.getElementById('map-view').classList.remove('hidden');
    document.body.classList.add('map-mode');
    if (!mapInitialized) { initMap(); mapInitialized = true; }
    else if (window._map) window._map.invalidateSize();
  };

  window.closeMapMode = function () {
    document.getElementById('map-view').classList.add('hidden');
    document.getElementById('scroll-view').classList.remove('hidden');
    document.body.classList.remove('map-mode');
  };

  // ─── Scroll Article ───────────────────────────────────────────────────────────
  function initScrollView() {
    renderArticle();
    buildChapterNav();
    initScrollObserver();
    initReadProgress();
    handleURLHash();
  }

  // Render all chapters from TOUR_STOPS
  function renderArticle() {
    const article = document.getElementById('article');
    TOUR_STOPS.forEach((stop, idx) => {
      if (stop.theme === 'intro') return; // welcome is the hero
      const totals = RUNNING_TOTALS[idx];
      const section = document.createElement('section');
      section.className = `chapter chapter--${stop.theme}`;
      section.id = `chapter-${stop.number}`;
      section.dataset.idx = idx;
      section.dataset.cumDeaths = totals.deaths;
      section.dataset.cumReforms = totals.reforms;
      section.dataset.title = stop.title;
      section.innerHTML = buildChapterHTML(stop, idx, totals);
      article.appendChild(section);
    });
  }

  function buildChapterHTML(stop, idx, totals) {
    const color = THEME_COLORS[stop.theme] || '#C60C30';
    const chapterNum = String(idx).padStart(2, '0'); // 01, 02, ...
    const isOutro = stop.theme === 'outro';

    // Image hero or color gradient hero
    const heroStyle = stop.image
      ? `background-image: url(${stop.image})`
      : `background: linear-gradient(135deg, ${color}22 0%, #080808 60%)`;

    const deathsBadge = stop.deaths !== null
      ? `<div class="ch-badge ch-badge--deaths">
           <svg viewBox="0 0 12 12" fill="currentColor" width="10" height="10">
             <circle cx="6" cy="6" r="5.5" fill="none" stroke="currentColor" stroke-width="1"/>
             <path d="M6 3v3.5l2 1.5" stroke="currentColor" stroke-width="1" fill="none"/>
           </svg>
           ${stop.deathsLabel}
         </div>`
      : '';

    const reformBadge = stop.reform !== null
      ? `<div class="ch-badge ch-badge--reform">
           <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1" width="10" height="10">
             <polyline points="2 6 5 9 10 3"/>
           </svg>
           ${stop.reformLabel}
         </div>`
      : '';

    const sourcesHTML = stop.sources && stop.sources.length
      ? `<div class="ch-sources">
           <span class="ch-sources-label">Sources & Further Reading</span>
           <div class="ch-sources-links">
             ${stop.sources.map(s =>
               `<a href="${s.url}" target="_blank" rel="noopener">${s.label} ↗</a>`
             ).join('')}
           </div>
         </div>`
      : '';

    // Walking directions link
    const mapsUrl = `https://maps.google.com/?q=${stop.lat},${stop.lng}`;
    const mapsLink = `<a href="${mapsUrl}" target="_blank" rel="noopener" class="ch-maps-link">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12">
        <path d="M8 1C5.2 1 3 3.2 3 6c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z"/>
        <circle cx="8" cy="6" r="1.5"/>
      </svg>
      ${stop.location}
    </a>`;

    const sectionsHTML = stop.sections.map(s => buildSectionHTML(s, color)).join('');

    return `
      <div class="ch-hero" style="${heroStyle}" data-color="${color}">
        <div class="ch-hero-overlay"></div>
        <div class="ch-hero-content">
          <div class="ch-meta">
            <span class="ch-num">${chapterNum}</span>
            <span class="ch-year">${stop.year}</span>
            <span class="ch-theme-dot" style="background:${color}"></span>
          </div>
          <h2 class="ch-title">${stop.title}</h2>
          <p class="ch-tagline">${stop.tagline}</p>
          <div class="ch-badges">${deathsBadge}${reformBadge}</div>
        </div>
      </div>
      <div class="ch-body" style="--chapter-color:${color}">
        <div class="ch-location-bar">
          ${mapsLink}
          <button class="ch-share-btn" onclick="shareChapter(${idx})" title="Share">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12">
              <circle cx="12" cy="3" r="1.5"/><circle cx="4" cy="8" r="1.5"/><circle cx="12" cy="13" r="1.5"/>
              <line x1="5.5" y1="9" x2="10.5" y2="12"/><line x1="10.5" y1="4" x2="5.5" y2="7"/>
            </svg>
            Share
          </button>
        </div>
        <div class="ch-sections">
          ${sectionsHTML}
        </div>
        ${buildTallyCard(totals, stop)}
        ${sourcesHTML}
      </div>`;
  }

  function buildSectionHTML(section, accentColor) {
    switch (section.type) {
      case 'narrative':
        return `
          <div class="sec-narrative">
            ${section.heading ? `<h3 class="sec-heading">${section.heading}</h3>` : ''}
            ${section.body.split('\n\n').map(p => `<p>${p}</p>`).join('')}
          </div>`;

      case 'quote':
        return `
          <blockquote class="sec-quote" style="border-color:${accentColor}">
            <p>"${section.text}"</p>
            <cite>— ${section.attribution}</cite>
          </blockquote>`;

      case 'photo':
        if (section.image) {
          return `
            <figure class="sec-photo">
              <img src="${section.image}" alt="${section.caption || ''}" loading="lazy">
              ${section.caption ? `<figcaption>${section.caption}</figcaption>` : ''}
            </figure>`;
        }
        return `
          <figure class="sec-photo sec-photo--placeholder">
            <div class="sec-photo-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="2" y="2" width="20" height="20" rx="2"/>
                <circle cx="8" cy="8" r="2"/><polyline points="22 14 16 8 4 22"/>
              </svg>
              <span>Historical photograph</span>
            </div>
            ${section.caption ? `<figcaption>${section.caption}</figcaption>` : ''}
          </figure>`;

      case 'stat': {
        const cls = { red: 'sec-stat--red', green: 'sec-stat--green', gold: 'sec-stat--gold' }[section.color] || 'sec-stat--red';
        return `
          <div class="sec-stat ${cls}">
            <div class="sec-stat-label">${section.label}</div>
            <div class="sec-stat-value">${section.value}</div>
          </div>`;
      }
      default: return '';
    }
  }

  function buildTallyCard(totals, stop) {
    if (stop.theme === 'intro' || stop.theme === 'outro') return '';
    const isZero = totals.deaths === 0;
    return `
      <div class="ch-tally-card">
        <div class="ch-tally-label">Tour total so far</div>
        <div class="ch-tally-nums">
          <span class="ch-tally-deaths">${isZero ? '—' : totals.deaths.toLocaleString() + ' lives lost'}</span>
          ${totals.reforms > 0 ? `<span class="ch-tally-sep">·</span><span class="ch-tally-reforms">${totals.reforms} reform${totals.reforms !== 1 ? 's' : ''}</span>` : ''}
        </div>
      </div>`;
  }

  // ─── Chapter Nav (sidebar dots) ───────────────────────────────────────────────
  function buildChapterNav() {
    const nav = document.getElementById('chapter-nav');
    const chapters = TOUR_STOPS.filter(s => s.theme !== 'intro');
    nav.innerHTML = chapters.map((stop, i) => {
      const color = THEME_COLORS[stop.theme] || '#C60C30';
      return `
        <button class="cnav-dot" data-chapter="${stop.number}"
                style="--dot-color:${color}"
                onclick="scrollToChapter(${stop.number})"
                title="${stop.title} (${stop.year})">
          <span class="cnav-dot-inner"></span>
          <span class="cnav-tooltip">${stop.title}</span>
        </button>`;
    }).join('');
  }

  window.scrollToChapter = function (num) {
    const el = document.getElementById(`chapter-${num}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.scrollToArticle = function () {
    document.getElementById('article').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ─── Intersection Observer — tally counter + header ──────────────────────────
  let currentDeaths = 0;
  let currentReforms = 0;
  let headerVisible = false;

  function initScrollObserver() {
    // Tally updates when chapters scroll into view
    const chapters = document.querySelectorAll('.chapter[data-cum-deaths]');
    const tallyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetDeaths = parseInt(el.dataset.cumDeaths) || 0;
          const targetReforms = parseInt(el.dataset.cumReforms) || 0;
          const title = el.dataset.title || '';

          // Update sticky header chapter label
          const label = document.getElementById('sh-chapter-label');
          if (label) label.textContent = title;

          // Animate counters
          animateCounter(
            document.getElementById('sh-deaths-num'),
            currentDeaths, targetDeaths, 900
          );
          animateCounter(
            document.getElementById('sh-reforms-num'),
            currentReforms, targetReforms, 900
          );
          currentDeaths = targetDeaths;
          currentReforms = targetReforms;

          // Highlight nav dot
          document.querySelectorAll('.cnav-dot').forEach(d => d.classList.remove('active'));
          const num = el.id.replace('chapter-', '');
          const dot = document.querySelector(`.cnav-dot[data-chapter="${num}"]`);
          if (dot) dot.classList.add('active');
        }
      });
    }, { threshold: 0.2, rootMargin: '-10% 0px -10% 0px' });

    chapters.forEach(ch => tallyObserver.observe(ch));

    // Show/hide sticky header after scrolling past hero
    const hero = document.getElementById('hero');
    if (hero) {
      const headerObserver = new IntersectionObserver(entries => {
        const header = document.getElementById('site-header');
        if (!header) return;
        if (entries[0].isIntersecting) {
          header.classList.remove('visible');
        } else {
          header.classList.add('visible');
        }
      }, { threshold: 0 });
      headerObserver.observe(hero);
    }
  }

  function animateCounter(el, from, to, duration) {
    if (!el || from === to) { if (el) el.textContent = to.toLocaleString(); return; }
    const start = performance.now();
    const delta = to - from;
    function update(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + delta * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ─── Reading progress bar ─────────────────────────────────────────────────────
  function initReadProgress() {
    const bar = document.getElementById('read-progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docH > 0 ? `${(scrollTop / docH) * 100}%` : '0%';
    }, { passive: true });
  }

  // ─── Share ────────────────────────────────────────────────────────────────────
  window.shareChapter = function (idx) {
    const stop = TOUR_STOPS[idx];
    const url = `${location.origin}${location.pathname}#chapter-${stop.number}`;
    if (navigator.share) {
      navigator.share({
        title: `Chicago Death Tour — ${stop.title}`,
        text: stop.tagline,
        url
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(showShareToast);
    } else {
      prompt('Copy this link:', url);
    }
  };

  function showShareToast() {
    const t = document.getElementById('share-toast');
    t.classList.remove('hidden');
    t.classList.add('visible');
    setTimeout(() => {
      t.classList.remove('visible');
      setTimeout(() => t.classList.add('hidden'), 300);
    }, 2200);
  }

  // ─── URL hash handling ────────────────────────────────────────────────────────
  function handleURLHash() {
    const hash = window.location.hash;
    if (!hash) return;
    // Support both #chapter-N (scroll view) and #stop-N (map view)
    if (hash.startsWith('#chapter-')) {
      setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    } else if (hash.startsWith('#stop-')) {
      const num = parseInt(hash.replace('#stop-', ''));
      openMapMode();
      const idx = TOUR_STOPS.findIndex(s => s.number === num);
      if (idx !== -1) setTimeout(() => openStop(idx), 400);
    }
  }

  // ─── MAP MODE ─────────────────────────────────────────────────────────────────
  let map;
  let markers = [];
  let activeStopIndex = null;
  let nearStopIndex = null;
  let gpsActive = false;
  let watchId = null;
  let userMarker = null;
  let swipeBound = false;

  function initMap() {
    map = window._map = L.map('map', {
      center: [41.8870, -87.6310],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 20
    }).addTo(map);

    L.control.attribution({ prefix: false, position: 'bottomright' })
      .addAttribution('&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>')
      .addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    drawRoute();
    addMarkers();
    buildStopList();
    bindGPSButton();
    bindSwipeNavigation();
  }

  function drawRoute() {
    const coords = TOUR_STOPS.map(s => [s.lat, s.lng]);
    L.polyline(coords, {
      color: '#C60C30', weight: 2, opacity: 0.4, dashArray: '6 10'
    }).addTo(map);
  }

  function addMarkers() {
    TOUR_STOPS.forEach((stop, idx) => {
      const marker = L.marker([stop.lat, stop.lng], {
        icon: createMarkerIcon(stop, false),
        title: stop.title
      }).addTo(map);
      marker.on('click', () => openStop(idx));
      markers.push(marker);
    });
  }

  function createMarkerIcon(stop, isActive) {
    const color = THEME_COLORS[stop.theme] || '#C60C30';
    return L.divIcon({
      html: `<div class="stop-marker ${isActive ? 'stop-marker--active' : ''}" style="--marker-color:${color}">
               <span>${stop.number}</span>
             </div>`,
      className: '', iconSize: [38, 38], iconAnchor: [19, 19]
    });
  }

  function refreshMarkers() {
    TOUR_STOPS.forEach((stop, idx) => {
      markers[idx].setIcon(createMarkerIcon(stop, idx === activeStopIndex));
    });
  }

  // ─── Stop List ────────────────────────────────────────────────────────────────
  function buildStopList() {
    const container = document.getElementById('stop-list-items');
    container.innerHTML = TOUR_STOPS.map((stop, idx) => `
      <div class="stop-list-item" onclick="openStopFromList(${idx})">
        <div class="stop-list-num" style="background:${THEME_COLORS[stop.theme] || '#C60C30'}">${stop.number}</div>
        <div class="stop-list-info">
          <div class="stop-list-title-text">${stop.title}</div>
          <div class="stop-list-location">${stop.location}</div>
        </div>
        <div class="stop-list-arrow">›</div>
      </div>
    `).join('');
  }

  window.openStopFromList = function (idx) {
    toggleStopList();
    openStop(idx);
  };

  window.toggleStopList = function () {
    document.getElementById('stop-list-overlay').classList.toggle('hidden');
  };

  // ─── Story Panel (map mode) ───────────────────────────────────────────────────
  function openStop(idx) {
    activeStopIndex = idx;
    const stop = TOUR_STOPS[idx];
    window.location.hash = `stop-${stop.number}`;
    map.flyTo([stop.lat, stop.lng], 17, { duration: 0.7 });
    refreshMarkers();
    updateMapProgress(idx);
    renderStoryPanel(stop, idx);
    showStoryPanel();
  }

  function renderStoryPanel(stop, idx) {
    const content = document.getElementById('story-content');
    const color = THEME_COLORS[stop.theme] || '#C60C30';

    const deathsBadge = stop.deaths !== null
      ? `<div class="stop-badge stop-badge--death">${stop.deathsLabel}</div>` : '';
    const reformBadge = stop.reform !== null
      ? `<div class="stop-badge stop-badge--reform">${stop.reformLabel}</div>` : '';

    const nextStop = TOUR_STOPS[idx + 1];
    const walkLink = nextStop
      ? `<a href="https://maps.google.com/maps?daddr=${nextStop.lat},${nextStop.lng}&dirflg=w"
            class="walk-next-link" target="_blank" rel="noopener">
           Walk to Stop ${nextStop.number}: ${nextStop.title} →
         </a>`
      : `<div class="tour-complete-note">You've reached the end. Long live Chicago.</div>`;

    const sectionsHTML = stop.sections.map(s => buildSectionHTML(s, color)).join('');
    const totals = RUNNING_TOTALS[idx];

    const sourcesHTML = stop.sources && stop.sources.length
      ? stop.sources.map(s =>
          `<a href="${s.url}" target="_blank" rel="noopener" class="map-source-link">${s.label} ↗</a>`
        ).join('')
      : '';

    content.innerHTML = `
      <div class="story-header" style="--stop-color:${color}">
        <div class="story-header-top">
          <div class="story-stop-number">Stop ${stop.number} of ${TOUR_STOPS.length}</div>
          <button class="share-btn" onclick="shareMapStop(${idx})" title="Share">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="3" r="1.5"/><circle cx="4" cy="8" r="1.5"/><circle cx="12" cy="13" r="1.5"/>
              <line x1="5.5" y1="9" x2="10.5" y2="12"/><line x1="10.5" y1="4" x2="5.5" y2="7"/>
            </svg>
          </button>
        </div>
        <h2 class="story-title">${stop.title}</h2>
        <div class="story-meta">
          <a href="https://maps.google.com/?q=${stop.lat},${stop.lng}" target="_blank" rel="noopener" class="story-location-link">
            <svg viewBox="0 0 12 12" fill="currentColor" width="10" height="10">
              <path d="M6 0C4 0 2.5 1.5 2.5 3.5c0 3 3.5 6.5 3.5 6.5s3.5-3.5 3.5-6.5C9.5 1.5 8 0 6 0zm0 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
            ${stop.location}
          </a>
          <span class="story-year-pill">${stop.year}</span>
        </div>
        <p class="story-tagline">${stop.tagline}</p>
        ${deathsBadge}${reformBadge}
      </div>
      <div class="story-sections">
        ${sectionsHTML}
      </div>
      <div class="running-total">
        <div class="running-total-label">Tour total so far</div>
        <div class="running-total-stats">
          <span class="rt-deaths">${totals.deaths.toLocaleString()} lives lost</span>
          <span class="rt-sep">·</span>
          <span class="rt-reforms">${totals.reforms} reforms</span>
        </div>
        ${walkLink}
        ${sourcesHTML ? `<div class="map-sources">${sourcesHTML}</div>` : ''}
      </div>`;

    content.scrollTop = 0;
    document.getElementById('btn-prev').disabled = idx === 0;
    document.getElementById('btn-next').disabled = idx === TOUR_STOPS.length - 1;
    document.getElementById('btn-next-label').textContent =
      idx === TOUR_STOPS.length - 1 ? 'Fin' : 'Next';
  }

  window.shareMapStop = function (idx) {
    const stop = TOUR_STOPS[idx];
    const url = `${location.origin}${location.pathname}#stop-${stop.number}`;
    if (navigator.share) {
      navigator.share({ title: `Chicago Death Tour — ${stop.title}`, text: stop.tagline, url })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(showShareToast);
    } else {
      prompt('Copy this link:', url);
    }
  };

  function showStoryPanel() {
    const panel = document.getElementById('story-panel');
    panel.classList.remove('hidden');
    requestAnimationFrame(() => {
      panel.classList.add('open');
      document.body.classList.add('panel-open');
      setTimeout(() => map.invalidateSize(), 320);
    });
  }

  window.closeStoryPanel = function () {
    const panel = document.getElementById('story-panel');
    panel.classList.remove('open');
    document.body.classList.remove('panel-open');
    setTimeout(() => { panel.classList.add('hidden'); map.invalidateSize(); }, 320);
    activeStopIndex = null;
    window.location.hash = '';
    refreshMarkers();
  };

  window.navigateStop = function (dir) {
    if (activeStopIndex === null) return;
    const next = activeStopIndex + dir;
    if (next >= 0 && next < TOUR_STOPS.length) openStop(next);
  };

  function updateMapProgress(idx) {
    const pct = ((idx + 1) / TOUR_STOPS.length) * 100;
    document.getElementById('progress-fill').style.width = `${pct}%`;
    const t = RUNNING_TOTALS[idx];
    document.getElementById('stat-deaths').textContent =
      t.deaths > 0 ? `${t.deaths.toLocaleString()} lives lost` : 'Tour begins';
    document.getElementById('stat-reforms').textContent =
      t.reforms > 0 ? `${t.reforms} reforms` : 'reforms ahead';
  }

  // ─── Swipe navigation (map mode story panel) ──────────────────────────────────
  function bindSwipeNavigation() {
    if (swipeBound) return;
    swipeBound = true;
    const content = document.getElementById('story-content');
    let sx = 0, sy = 0, sTop = 0;
    content.addEventListener('touchstart', e => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      sTop = content.scrollTop;
    }, { passive: true });
    content.addEventListener('touchend', e => {
      if (activeStopIndex === null || sTop > 60) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        dx < 0 ? navigateStop(1) : navigateStop(-1);
      }
    }, { passive: true });
  }

  // ─── GPS ──────────────────────────────────────────────────────────────────────
  function bindGPSButton() {
    document.getElementById('btn-gps').addEventListener('click', toggleGPS);
  }

  function toggleGPS() {
    if (!navigator.geolocation) {
      alert('Your device does not support geolocation.');
      return;
    }
    gpsActive ? stopGPS() : startGPS();
  }

  function startGPS() {
    gpsActive = true;
    document.getElementById('btn-gps').classList.add('gps-active');
    watchId = navigator.geolocation.watchPosition(onGPSSuccess, onGPSError, {
      enableHighAccuracy: true, maximumAge: 5000, timeout: 15000
    });
  }

  function stopGPS() {
    gpsActive = false;
    document.getElementById('btn-gps').classList.remove('gps-active');
    if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null; }
    if (userMarker) { map.removeLayer(userMarker); userMarker = null; }
    hideNearToast();
  }

  function onGPSSuccess(pos) {
    const { latitude: lat, longitude: lng } = pos.coords;
    if (!userMarker) {
      userMarker = L.circleMarker([lat, lng], {
        radius: 8, color: '#fff', fillColor: '#0077b6', fillOpacity: 1, weight: 2.5
      }).addTo(map);
    } else {
      userMarker.setLatLng([lat, lng]);
    }
    map.panTo([lat, lng], { animate: true });
    checkProximity(lat, lng);
  }

  function onGPSError(err) {
    if (err.code === 1) {
      alert('Location access denied. Enable location permissions to use walking mode.');
      stopGPS();
    }
  }

  function checkProximity(lat, lng) {
    let closest = null, closestDist = Infinity;
    TOUR_STOPS.forEach((stop, idx) => {
      const d = haversineMeters(lat, lng, stop.lat, stop.lng);
      if (d < closestDist) { closestDist = d; closest = idx; }
    });
    if (closestDist <= 100 && closest !== activeStopIndex) {
      if (nearStopIndex !== closest) { nearStopIndex = closest; showNearToast(closest); }
    } else { nearStopIndex = null; hideNearToast(); }
  }

  function showNearToast(idx) {
    const stop = TOUR_STOPS[idx];
    document.getElementById('near-toast-text').textContent =
      `Near Stop ${stop.number}: ${stop.title}`;
    const t = document.getElementById('near-toast');
    t.classList.remove('hidden');
    requestAnimationFrame(() => t.classList.add('visible'));
  }

  function hideNearToast() {
    const t = document.getElementById('near-toast');
    t.classList.remove('visible');
    setTimeout(() => t.classList.add('hidden'), 300);
  }

  window.openNearStop = function () {
    if (nearStopIndex !== null) { hideNearToast(); openStop(nearStopIndex); }
  };

  function haversineMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000, toRad = v => v * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ─── Keyboard ─────────────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (!document.body.classList.contains('map-mode')) return;
    if (activeStopIndex === null) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigateStop(1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigateStop(-1);
    if (e.key === 'Escape') closeStoryPanel();
  });

  // ─── Boot ─────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', initScrollView);

})();
