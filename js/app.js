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

  // ─── Map Init ─────────────────────────────────────────────────────────────────
  function initMap() {
    map = L.map('map', {
      center: [41.8860, -87.6310],
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    // CartoDB dark tiles — no API key needed
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Attribution — small, bottom right
    L.control.attribution({ prefix: false, position: 'bottomright' })
      .addAttribution('&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>')
      .addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    drawRoute();
    addMarkers();
    buildStopList();
    handleURLHash();
    bindGPSButton();
  }

  // ─── Route Line ───────────────────────────────────────────────────────────────
  function drawRoute() {
    const coords = TOUR_STOPS.map(s => [s.lat, s.lng]);
    routeLine = L.polyline(coords, {
      color: '#C60C30',
      weight: 2,
      opacity: 0.45,
      dashArray: '6 10'
    }).addTo(map);
  }

  // ─── Markers ─────────────────────────────────────────────────────────────────
  function createMarkerIcon(stop, isActive) {
    const themeColors = {
      intro:       '#0077b6',
      business:    '#9b2226',
      fire:        '#C60C30',
      military:    '#6b4226',
      exposition:  '#b5911a',
      maritime:    '#1d6b8a',
      environment: '#2d6a4f',
      outro:       '#0077b6'
    };
    const color = themeColors[stop.theme] || '#C60C30';

    return L.divIcon({
      html: `
        <div class="stop-marker ${isActive ? 'stop-marker--active' : ''}"
             style="--marker-color: ${color}">
          <span>${stop.number}</span>
        </div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });
  }

  function addMarkers() {
    TOUR_STOPS.forEach((stop, idx) => {
      const marker = L.marker([stop.lat, stop.lng], {
        icon: createMarkerIcon(stop, false),
        title: stop.title,
        zIndexOffset: idx === 0 ? 1000 : 0
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
        <div class="stop-list-num" style="background:${getThemeColor(stop.theme)}">${stop.number}</div>
        <div class="stop-list-info">
          <div class="stop-list-title-text">${stop.title}</div>
          <div class="stop-list-location">${stop.location}</div>
        </div>
        <div class="stop-list-year">${stop.year}</div>
      </div>
    `).join('');
  }

  function getThemeColor(theme) {
    const map = {
      intro: '#0077b6', business: '#9b2226', fire: '#C60C30',
      military: '#6b4226', exposition: '#b5911a', maritime: '#1d6b8a',
      environment: '#2d6a4f', outro: '#0077b6'
    };
    return map[theme] || '#C60C30';
  }

  // Exposed to HTML onclick
  window.openStopFromList = function(idx) {
    toggleStopList();
    openStop(idx);
  };

  window.toggleStopList = function() {
    const overlay = document.getElementById('stop-list-overlay');
    overlay.classList.toggle('hidden');
  };

  // ─── Story Panel ─────────────────────────────────────────────────────────────
  function openStop(idx) {
    activeStopIndex = idx;
    const stop = TOUR_STOPS[idx];

    // Update URL hash for shareability
    window.location.hash = `stop-${stop.number}`;

    // Fly map to stop
    map.flyTo([stop.lat, stop.lng], 17, { duration: 0.8 });

    refreshMarkers();
    updateProgressBar(idx);
    renderStoryPanel(stop, idx);
    showStoryPanel();
  }

  function renderStoryPanel(stop, idx) {
    const content = document.getElementById('story-content');

    // Build sections HTML
    const sectionsHTML = stop.sections.map(section => buildSectionHTML(section)).join('');

    // Build stat badges
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

    content.innerHTML = `
      <div class="story-header">
        <div class="story-stop-number">${stop.number} of ${TOUR_STOPS.length}</div>
        <h2 class="story-title">${stop.title}</h2>
        <div class="story-location">
          <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          ${stop.location}
        </div>
        <div class="story-year">${stop.year}</div>
        <p class="story-tagline">${stop.tagline}</p>
        ${deathsBadge}${reformBadge}
      </div>
      <div class="story-sections">
        ${sectionsHTML}
      </div>
      ${buildRunningTotal(idx)}
    `;

    // Scroll to top of content
    content.scrollTop = 0;

    // Update prev/next buttons
    document.getElementById('btn-prev').disabled = idx === 0;
    document.getElementById('btn-next').disabled = idx === TOUR_STOPS.length - 1;
    document.getElementById('btn-next').textContent = idx === TOUR_STOPS.length - 1
      ? 'Fin' : 'Next →';
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
            <div class="section-photo">
              <img src="${section.image}" alt="${section.caption || ''}" loading="lazy">
              ${section.caption ? `<p class="photo-caption">${section.caption}</p>` : ''}
            </div>`;
        } else {
          return `
            <div class="section-photo section-photo--placeholder">
              <div class="photo-placeholder-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>Historical photo</span>
              </div>
              ${section.caption ? `<p class="photo-caption">${section.caption}</p>` : ''}
            </div>`;
        }

      case 'stat':
        const colorClass = {
          red: 'stat--red', green: 'stat--green', gold: 'stat--gold'
        }[section.color] || 'stat--red';
        return `
          <div class="section-stat ${colorClass}">
            <div class="stat-label">${section.label}</div>
            <div class="stat-value">${section.value}</div>
          </div>`;

      default:
        return '';
    }
  }

  function buildRunningTotal(idx) {
    const totals = RUNNING_TOTALS[idx];
    return `
      <div class="running-total">
        <div class="running-total-label">Tour total so far</div>
        <div class="running-total-stats">
          <span class="rt-deaths">${totals.deaths.toLocaleString()} lives lost</span>
          <span class="rt-sep">·</span>
          <span class="rt-reforms">${totals.reforms} reforms</span>
        </div>
      </div>`;
  }

  function showStoryPanel() {
    const panel = document.getElementById('story-panel');
    panel.classList.remove('hidden');
    // Small delay to trigger CSS transition
    requestAnimationFrame(() => {
      panel.classList.add('open');
      document.body.classList.add('panel-open');
      // Let the CSS transition run, then refit the map
      setTimeout(() => map.invalidateSize(), 320);
    });
  }

  window.closeStoryPanel = function() {
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

  window.navigateStop = function(direction) {
    if (activeStopIndex === null) return;
    const next = activeStopIndex + direction;
    if (next >= 0 && next < TOUR_STOPS.length) {
      openStop(next);
    }
  };

  // ─── Progress Bar ─────────────────────────────────────────────────────────────
  function updateProgressBar(idx) {
    const fill = document.getElementById('progress-fill');
    const statDeaths = document.getElementById('stat-deaths');
    const statReforms = document.getElementById('stat-reforms');

    const pct = ((idx + 1) / TOUR_STOPS.length) * 100;
    fill.style.width = `${pct}%`;

    const totals = RUNNING_TOTALS[idx];
    statDeaths.textContent = `${totals.deaths.toLocaleString()} lives lost`;
    statReforms.textContent = `${totals.reforms} reforms`;
  }

  // ─── GPS ─────────────────────────────────────────────────────────────────────
  function bindGPSButton() {
    const btn = document.getElementById('btn-gps');
    btn.addEventListener('click', toggleGPS);
  }

  function toggleGPS() {
    if (!navigator.geolocation) {
      alert('Your browser or device does not support geolocation.');
      return;
    }

    if (gpsActive) {
      stopGPS();
    } else {
      startGPS();
    }
  }

  function startGPS() {
    gpsActive = true;
    document.getElementById('btn-gps').classList.add('gps-active');

    watchId = navigator.geolocation.watchPosition(
      onGPSSuccess,
      onGPSError,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }

  function stopGPS() {
    gpsActive = false;
    document.getElementById('btn-gps').classList.remove('gps-active');

    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    if (userMarker) {
      map.removeLayer(userMarker);
      userMarker = null;
    }
    hideNearToast();
  }

  function onGPSSuccess(position) {
    const { latitude, longitude } = position.coords;

    // Draw/update user location dot
    if (!userMarker) {
      userMarker = L.circleMarker([latitude, longitude], {
        radius: 8,
        color: '#fff',
        fillColor: '#0077b6',
        fillOpacity: 1,
        weight: 2
      }).addTo(map);
    } else {
      userMarker.setLatLng([latitude, longitude]);
    }

    map.panTo([latitude, longitude], { animate: true });

    // Check proximity to stops
    checkProximity(latitude, longitude);
  }

  function onGPSError(err) {
    console.warn('GPS error:', err.message);
    if (err.code === 1) {
      alert('Location access was denied. Enable location permissions to use walking mode.');
      stopGPS();
    }
  }

  function checkProximity(lat, lng) {
    let closest = null;
    let closestDist = Infinity;

    TOUR_STOPS.forEach((stop, idx) => {
      const dist = haversineDistance(lat, lng, stop.lat, stop.lng);
      if (dist < closestDist) {
        closestDist = dist;
        closest = idx;
      }
    });

    // Within 100 meters
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
      `You're near Stop ${stop.number}: ${stop.title}`;
    document.getElementById('near-toast').classList.remove('hidden');
    document.getElementById('near-toast').classList.add('visible');
  }

  function hideNearToast() {
    const toast = document.getElementById('near-toast');
    toast.classList.remove('visible');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }

  window.openNearStop = function() {
    if (nearStopIndex !== null) {
      hideNearToast();
      openStop(nearStopIndex);
    }
  };

  // Haversine distance in meters
  function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const dPhi = (lat2 - lat1) * Math.PI / 180;
    const dLambda = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dPhi / 2) ** 2 +
              Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ─── URL Hash / Deep Linking ──────────────────────────────────────────────────
  function handleURLHash() {
    const hash = window.location.hash;
    if (!hash) return;
    const match = hash.match(/^#stop-(\d+)$/);
    if (match) {
      const stopNum = parseInt(match[1], 10);
      const idx = TOUR_STOPS.findIndex(s => s.number === stopNum);
      if (idx !== -1) {
        // Brief delay to let map fully initialize
        setTimeout(() => openStop(idx), 300);
      }
    }
  }

  // ─── Keyboard Navigation ──────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (activeStopIndex === null) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigateStop(1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigateStop(-1);
    if (e.key === 'Escape') closeStoryPanel();
  });

  // ─── Boot ────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', initMap);

})();
