// Casey's Chicago Death Tour — Application Logic

(function () {
  'use strict';

  // ─── State ───────────────────────────────────────────────────────────────────
  let map;
  let markers = [];
  let routeLine;
  let userMarker = null;
  let watchId = null;
  let activeStopIndex = null;
  let nearStopIndex = null;
  let gpsActive = false;
  let swipeBound = false;

  // ─── Splash Screen ────────────────────────────────────────────────────────────
  window.startTour = function () {
    closeSplashEl();
    // Brief pause so the fade-out looks intentional
    setTimeout(() => openStop(0), 150);
  };

  window.closeSplash = closeSplashEl;

  function closeSplashEl() {
    const splash = document.getElementById('splash');
    if (!splash) return;
    splash.classList.add('splash-out');
    setTimeout(() => splash.remove(), 500);
  }

  // ─── Map Init ─────────────────────────────────────────────────────────────────
  function initMap() {
    map = L.map('map', {
      center: [41.8865, -87.6310],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // CartoDB dark tiles — no API key needed
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    L.control.attribution({ prefix: false, position: 'bottomright' })
      .addAttribution('&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>')
      .addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    drawRoute();
    addMarkers();
    buildStopList();
    handleURLHash();
    bindGPSButton();
    bindSwipeNavigation();
  }

  // ─── Route Line ───────────────────────────────────────────────────────────────
  function drawRoute() {
    const coords = TOUR_STOPS.map(s => [s.lat, s.lng]);
    routeLine = L.polyline(coords, {
      color: '#C60C30',
      weight: 2.5,
      opacity: 0.5,
      dashArray: '6 10'
    }).addTo(map);
  }

  // ─── Markers ─────────────────────────────────────────────────────────────────
  const THEME_COLORS = {
    intro:       '#0077b6',
    business:    '#9b2226',
    fire:        '#C60C30',
    military:    '#6b4226',
    exposition:  '#b5911a',
    maritime:    '#1d6b8a',
    environment: '#2d6a4f',
    outro:       '#0077b6'
  };

  function createMarkerIcon(stop, isActive) {
    const color = THEME_COLORS[stop.theme] || '#C60C30';
    return L.divIcon({
      html: `
        <div class="stop-marker ${isActive ? 'stop-marker--active' : ''}"
             style="--marker-color: ${color}">
          <span>${stop.number}</span>
        </div>`,
      className: '',
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -22]
    });
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

  function refreshMarkers() {
    TOUR_STOPS.forEach((stop, idx) => {
      markers[idx].setIcon(createMarkerIcon(stop, idx === activeStopIndex));
    });
  }

  // ─── Stop List ───────────────────────────────────────────────────────────────
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
    const overlay = document.getElementById('stop-list-overlay');
    overlay.classList.toggle('hidden');
  };

  // ─── Story Panel ─────────────────────────────────────────────────────────────
  function openStop(idx) {
    activeStopIndex = idx;
    const stop = TOUR_STOPS[idx];

    window.location.hash = `stop-${stop.number}`;
    map.flyTo([stop.lat, stop.lng], 17, { duration: 0.7 });

    refreshMarkers();
    updateProgressBar(idx);
    renderStoryPanel(stop, idx);
    showStoryPanel();
  }

  function renderStoryPanel(stop, idx) {
    const content = document.getElementById('story-content');
    const sectionsHTML = stop.sections.map(buildSectionHTML).join('');

    const deathsBadge = stop.deaths !== null
      ? `<div class="stop-badge stop-badge--death">
           <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
           ${stop.deathsLabel}
         </div>`
      : '';

    const reformBadge = stop.reform !== null
      ? `<div class="stop-badge stop-badge--reform">
           <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
           ${stop.reformLabel}
         </div>`
      : '';

    const mapsUrl = `https://maps.google.com/?q=${stop.lat},${stop.lng}`;

    content.innerHTML = `
      <div class="story-header">
        <div class="story-header-top">
          <div class="story-stop-number">Stop ${stop.number} of ${TOUR_STOPS.length}</div>
          <button class="share-btn" onclick="shareStop(${idx})" title="Share this stop" aria-label="Share">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
        <h2 class="story-title">${stop.title}</h2>
        <div class="story-meta">
          <a href="${mapsUrl}" target="_blank" rel="noopener" class="story-location-link" title="Open in Maps">
            <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
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
      ${buildFooter(idx)}
    `;

    content.scrollTop = 0;

    // Update nav buttons (target the label span, not the whole button)
    document.getElementById('btn-prev').disabled = idx === 0;
    document.getElementById('btn-next').disabled = idx === TOUR_STOPS.length - 1;
    document.getElementById('btn-next-label').textContent =
      idx === TOUR_STOPS.length - 1 ? 'Fin' : 'Next';
  }

  function buildSectionHTML(section) {
    switch (section.type) {
      case 'narrative':
        return `
          <div class="section-narrative">
            ${section.heading ? `<h3 class="section-heading">${section.heading}</h3>` : ''}
            ${section.body.split('\n\n').map(p => `<p>${p}</p>`).join('')}
          </div>`;

      case 'quote':
        return `
          <blockquote class="section-quote">
            <p>"${section.text}"</p>
            <cite>— ${section.attribution}</cite>
          </blockquote>`;

      case 'photo':
        if (section.image) {
          return `
            <figure class="section-photo">
              <img src="${section.image}" alt="${section.caption || ''}" loading="lazy">
              ${section.caption ? `<figcaption class="photo-caption">${section.caption}</figcaption>` : ''}
            </figure>`;
        }
        return `
          <figure class="section-photo section-photo--placeholder">
            <div class="photo-placeholder-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Historical photo</span>
            </div>
            ${section.caption ? `<figcaption class="photo-caption">${section.caption}</figcaption>` : ''}
          </figure>`;

      case 'stat': {
        const colorClass = { red: 'stat--red', green: 'stat--green', gold: 'stat--gold' }[section.color] || 'stat--red';
        return `
          <div class="section-stat ${colorClass}">
            <div class="stat-label">${section.label}</div>
            <div class="stat-value">${section.value}</div>
          </div>`;
      }

      default:
        return '';
    }
  }

  function buildFooter(idx) {
    const totals = RUNNING_TOTALS[idx];
    const nextStop = TOUR_STOPS[idx + 1];
    const walkLink = nextStop
      ? `<a href="https://maps.google.com/maps?daddr=${nextStop.lat},${nextStop.lng}&dirflg=w"
            target="_blank" rel="noopener" class="walk-next-link">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
             <path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0M6 20l3-6 2 2 2-5 4 9M9 12l-1-4 3-1 2 3-4 2z"/>
           </svg>
           Walk to Stop ${nextStop.number}: ${nextStop.title}
         </a>`
      : `<div class="tour-complete-note">You've reached the end of the tour. Long live Chicago.</div>`;

    return `
      <div class="running-total">
        <div class="running-total-label">Tour total so far</div>
        <div class="running-total-stats">
          <span class="rt-deaths">${totals.deaths.toLocaleString()} lives lost</span>
          <span class="rt-sep">·</span>
          <span class="rt-reforms">${totals.reforms} reforms</span>
        </div>
        ${walkLink}
      </div>`;
  }

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
    setTimeout(() => {
      panel.classList.add('hidden');
      map.invalidateSize();
    }, 320);
    activeStopIndex = null;
    window.location.hash = '';
    refreshMarkers();
  };

  window.navigateStop = function (direction) {
    if (activeStopIndex === null) return;
    const next = activeStopIndex + direction;
    if (next >= 0 && next < TOUR_STOPS.length) openStop(next);
  };

  // ─── Share ───────────────────────────────────────────────────────────────────
  window.shareStop = function (idx) {
    const stop = TOUR_STOPS[idx];
    const url = `${location.origin}${location.pathname}#stop-${stop.number}`;

    if (navigator.share) {
      navigator.share({
        title: `Chicago Death Tour — Stop ${stop.number}: ${stop.title}`,
        text: stop.tagline,
        url
      }).catch(() => {}); // user cancelled — no action needed
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showShareToast());
    } else {
      // Fallback
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
    }, 2000);
  }

  // ─── Swipe Navigation ────────────────────────────────────────────────────────
  function bindSwipeNavigation() {
    if (swipeBound) return;
    swipeBound = true;

    const content = document.getElementById('story-content');
    let startX = 0, startY = 0, startScrollTop = 0;

    content.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startScrollTop = content.scrollTop;
    }, { passive: true });

    content.addEventListener('touchend', e => {
      if (activeStopIndex === null) return;
      // Only trigger swipe when near the top of the content (not mid-scroll)
      if (startScrollTop > 60) return;

      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) navigateStop(1);   // swipe left → next stop
        else navigateStop(-1);          // swipe right → prev stop
      }
    }, { passive: true });
  }

  // ─── Progress Bar ─────────────────────────────────────────────────────────────
  function updateProgressBar(idx) {
    const pct = ((idx + 1) / TOUR_STOPS.length) * 100;
    document.getElementById('progress-fill').style.width = `${pct}%`;

    const totals = RUNNING_TOTALS[idx];
    document.getElementById('stat-deaths').textContent =
      totals.deaths > 0 ? `${totals.deaths.toLocaleString()} lives lost` : 'Tour begins';
    document.getElementById('stat-reforms').textContent =
      totals.reforms > 0 ? `${totals.reforms} reforms` : 'reforms coming';
  }

  // ─── GPS ─────────────────────────────────────────────────────────────────────
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
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000
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
        radius: 8,
        color: '#fff',
        fillColor: '#0077b6',
        fillOpacity: 1,
        weight: 2.5
      }).addTo(map);
    } else {
      userMarker.setLatLng([lat, lng]);
    }

    map.panTo([lat, lng], { animate: true });
    checkProximity(lat, lng);
  }

  function onGPSError(err) {
    if (err.code === 1) {
      alert('Location access was denied. Enable location permissions to use walking mode.');
      stopGPS();
    }
  }

  function checkProximity(lat, lng) {
    let closest = null;
    let closestDist = Infinity;

    TOUR_STOPS.forEach((stop, idx) => {
      const dist = haversineMeters(lat, lng, stop.lat, stop.lng);
      if (dist < closestDist) { closestDist = dist; closest = idx; }
    });

    if (closestDist <= 100 && closest !== activeStopIndex) {
      if (nearStopIndex !== closest) {
        nearStopIndex = closest;
        showNearToast(closest);
      }
    } else {
      nearStopIndex = null;
      hideNearToast();
    }
  }

  function showNearToast(idx) {
    const stop = TOUR_STOPS[idx];
    document.getElementById('near-toast-text').textContent =
      `Near Stop ${stop.number}: ${stop.title}`;
    const toast = document.getElementById('near-toast');
    toast.classList.remove('hidden');
    requestAnimationFrame(() => toast.classList.add('visible'));
  }

  function hideNearToast() {
    const toast = document.getElementById('near-toast');
    toast.classList.remove('visible');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }

  window.openNearStop = function () {
    if (nearStopIndex !== null) { hideNearToast(); openStop(nearStopIndex); }
  };

  function haversineMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ─── URL Hash ─────────────────────────────────────────────────────────────────
  function handleURLHash() {
    const match = window.location.hash.match(/^#stop-(\d+)$/);
    if (match) {
      const idx = TOUR_STOPS.findIndex(s => s.number === parseInt(match[1], 10));
      if (idx !== -1) {
        closeSplashEl();
        setTimeout(() => openStop(idx), 350);
      }
    }
  }

  // ─── Keyboard Navigation ──────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (activeStopIndex === null) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigateStop(1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigateStop(-1);
    if (e.key === 'Escape') closeStoryPanel();
  });

  // ─── Boot ────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', initMap);

})();
