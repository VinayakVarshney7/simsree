/* ═══════════════════════════════════════════════════════════════════
   SIMSREE Wireframes — Shared Interactive Behaviors
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Hamburger toggle (mobile nav) ────────────────────────────── */
  function initBurger() {
    const burger = document.querySelector('.burger');
    const overlay = document.querySelector('.mnav-overlay');
    if (!burger || !overlay) return;
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      overlay.classList.toggle('open');
      document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    });
    const close = overlay.querySelector('.mnav-close');
    if (close) close.addEventListener('click', () => {
      burger.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
    // Close on link click
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ── Filter chips ─────────────────────────────────────────────── */
  function initChips() {
    document.querySelectorAll('[data-chip-group]').forEach(group => {
      const chips = group.querySelectorAll('.chip');
      const targetSel = group.getAttribute('data-chip-target');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('on'));
          chip.classList.add('on');
          const filter = chip.getAttribute('data-filter') || 'all';
          if (targetSel) {
            document.querySelectorAll(targetSel).forEach(item => {
              const cats = (item.getAttribute('data-cat') || '').split(' ');
              if (filter === 'all' || cats.includes(filter)) {
                item.classList.remove('chip-hidden');
                item.style.display = '';
              } else {
                item.classList.add('chip-hidden');
                item.style.display = 'none';
              }
            });
          }
        });
      });
    });
  }

  /* ── Accordion ────────────────────────────────────────────────── */
  function initAccordion() {
    document.querySelectorAll('.acc').forEach(acc => {
      const head = acc.querySelector('.acc-head');
      if (!head) return;
      head.addEventListener('click', () => {
        const isOpen = acc.classList.contains('open');
        // optional: close siblings
        if (acc.parentElement && acc.parentElement.hasAttribute('data-acc-single')) {
          acc.parentElement.querySelectorAll('.acc').forEach(a => a.classList.remove('open'));
        }
        acc.classList.toggle('open', !isOpen);
      });
    });
  }

  /* ── Tabs ─────────────────────────────────────────────────────── */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(container => {
      const tabs = container.querySelectorAll('.tab');
      const panels = container.querySelectorAll('.tab-panel');
      tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('on'));
          panels.forEach(p => p.classList.remove('on'));
          tab.classList.add('on');
          const target = tab.getAttribute('data-tab');
          const panel = target ? container.querySelector(`.tab-panel[data-panel="${target}"]`) : panels[i];
          if (panel) panel.classList.add('on');
        });
      });
    });
  }

  /* ── Modals ───────────────────────────────────────────────────── */
  function initModals() {
    document.querySelectorAll('[data-modal-open]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const id = trigger.getAttribute('data-modal-open');
        const modal = document.getElementById(id);
        if (modal) {
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    document.querySelectorAll('.modal-backdrop, .modal-shell').forEach(modal => {
      const close = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      };
      modal.querySelectorAll('.modal-close, [data-modal-close]').forEach(b => b.addEventListener('click', close));
      modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open, .modal-shell.open').forEach(m => {
          m.classList.remove('open');
          document.body.style.overflow = '';
        });
      }
    });
  }

  /* ── Form state machine ───────────────────────────────────────── */
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(form => {
      const wrap = form.closest('[data-form-states]') || form.parentElement;
      const idleEl = wrap.querySelector('.form-state.idle');
      const sendingEl = wrap.querySelector('.form-state.sending');
      const successEl = wrap.querySelector('.form-state.success');
      const failEl = wrap.querySelector('.form-state.fail');
      const showState = (which) => {
        ['idle', 'sending', 'success', 'fail'].forEach(s => {
          const el = wrap.querySelector('.form-state.' + s);
          if (el) el.classList.toggle('on', s === which);
        });
      };
      showState('idle');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        // basic validation: required fields
        const required = form.querySelectorAll('[required]');
        let valid = true;
        required.forEach(f => {
          if (!f.value.trim()) {
            f.style.borderColor = 'var(--red)';
            valid = false;
          } else {
            f.style.borderColor = '';
          }
        });
        if (!valid) {
          showToast('Please fill the required fields.', 'fail');
          return;
        }
        showState('sending');
        // simulate network
        const failFlag = form.hasAttribute('data-force-fail');
        setTimeout(() => {
          if (failFlag) {
            showState('fail');
          } else {
            showState('success');
            showToast('Message sent. We\'ll be in touch.', 'ok');
          }
        }, 1200);
      });
      // Retry button
      wrap.querySelectorAll('[data-form-retry]').forEach(btn => {
        btn.addEventListener('click', () => {
          form.removeAttribute('data-force-fail');
          showState('idle');
        });
      });
      // Force-fail demo toggle
      wrap.querySelectorAll('[data-force-fail-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
          if (form.hasAttribute('data-force-fail')) {
            form.removeAttribute('data-force-fail');
            btn.textContent = btn.getAttribute('data-on-text') || 'Demo: force fail';
          } else {
            form.setAttribute('data-force-fail', '');
            btn.textContent = btn.getAttribute('data-off-text') || 'Demo: fail mode ON';
          }
        });
      });
    });
  }

  /* ── Toast ────────────────────────────────────────────────────── */
  function ensureToast() {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    return t;
  }
  function showToast(message, kind) {
    const t = ensureToast();
    t.textContent = message;
    t.className = 'toast' + (kind ? ' ' + kind : '');
    requestAnimationFrame(() => t.classList.add('open'));
    setTimeout(() => t.classList.remove('open'), 3000);
  }
  window.showToast = showToast;

  /* ── Persona router (?persona=…) ─────────────────────────────── */
  function initPersonaRouter() {
    const params = new URLSearchParams(window.location.search);
    let persona = params.get('persona');
    if (persona) setPersona(persona);

    document.querySelectorAll('[data-persona-pick]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const p = card.getAttribute('data-persona-pick');
        setPersona(p);
        // update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('persona', p);
        window.history.replaceState({}, '', url);
        // mark active
        document.querySelectorAll('[data-persona-pick]').forEach(c => c.classList.toggle('active', c === card));
        // scroll to persona section if marked
        const target = document.querySelector('[data-persona-target]');
        if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
    // pre-set active on load
    if (persona) {
      const card = document.querySelector(`[data-persona-pick="${persona}"]`);
      if (card) card.classList.add('active');
    }
  }
  function setPersona(p) {
    document.body.classList.remove('persona-prospect','persona-recruiter','persona-alumnus','persona-press','persona-vendor');
    if (p) document.body.classList.add('persona-' + p);
  }

  /* ── Calendar (prev/next month) + dynamic upcoming panel ─────── */
  function initCalendar() {
    document.querySelectorAll('[data-calendar]').forEach(cal => {
      let cursor = new Date(); // start at current month
      const events = JSON.parse(cal.getAttribute('data-events') || '{}');
      const titleEl = cal.querySelector('.cal-title');
      const gridEl = cal.querySelector('.cal-grid');
      const prevBtn = cal.querySelector('[data-cal-prev]');
      const nextBtn = cal.querySelector('[data-cal-next]');
      const upcomingEl = document.querySelector('[data-upcoming-list]');

      function buildEventDetails(year, monthIdx, day, ev) {
        const monthAbbr = new Date(year, monthIdx, 1).toLocaleString('en-US', {month: 'short'});
        const body = ev.body || `Details for "${ev.label}" coming soon. RSVP to be added to the invite list.`;
        const speaker = ev.speaker || 'Speaker TBA';
        const cat = ev.cat || ev.kind || 'lecture';
        const org = ev.org || '';
        const seed = (ev.label || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14) || 'evt';
        return `<details class="expand-item" data-cat="${cat}" data-day="${day}" data-month="${monthAbbr}">
  <summary>
    <div class="ex-date"><strong>${day}</strong><small>${monthAbbr}</small></div>
    <div>
      <div class="ex-title">${ev.label}</div>
      <div class="ex-org">${org}</div>
    </div>
    <span></span>
  </summary>
  <div class="ex-detail">
    <div class="ex-thumb" style="background-image:linear-gradient(135deg,rgba(15,20,80,.3),rgba(43,143,214,.2)),url('https://picsum.photos/seed/${seed}/600/400');"></div>
    <div class="ex-body">
      <p>${body}</p>
      <div class="ex-meta">
        <span><strong>Speaker:</strong> ${speaker}</span>
        <span><strong>Format:</strong> In-person</span>
        <span><strong>RSVP:</strong> <a href="#" style="color:var(--accent);">link →</a></span>
      </div>
    </div>
  </div>
</details>`;
      }

      function renderUpcoming() {
        if (!upcomingEl) return;
        const year = cursor.getFullYear();
        const month = cursor.getMonth();
        const monthName = cursor.toLocaleString('en-US', {month: 'long'});
        const key = `${year}-${String(month + 1).padStart(2, '0')}`;
        const monthEvents = events[key] || {};
        const days = Object.keys(monthEvents).sort((a, b) => parseInt(a) - parseInt(b));
        const heading = `<div class="eyebrow">Upcoming</div>
        <h3 class="h3 mb-12">${days.length} events in ${monthName} ${year}</h3>`;
        if (days.length === 0) {
          upcomingEl.innerHTML = heading + `<div class="filter-empty"><h3>No events this month</h3><p>Use ← / → to browse other months, or subscribe for invites.</p></div>`;
          return;
        }
        const items = days.map(d => buildEventDetails(year, month, d, monthEvents[d])).join('');
        upcomingEl.innerHTML = heading + items;
      }
      const render = () => {
        const year = cursor.getFullYear();
        const month = cursor.getMonth();
        const monthName = cursor.toLocaleString('en-US', { month: 'long' });
        titleEl.textContent = `${monthName} ${year}`;
        // 1st of month
        const first = new Date(year, month, 1);
        const startDow = (first.getDay() + 6) % 7; // Monday=0
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        let html = '<div class="dow">M</div><div class="dow">T</div><div class="dow">W</div><div class="dow">T</div><div class="dow">F</div><div class="dow">S</div><div class="dow">S</div>';
        for (let i = startDow - 1; i >= 0; i--) {
          html += `<div class="day muted">${prevMonthDays - i}</div>`;
        }
        const today = new Date();
        const monthEvents = events[`${year}-${String(month + 1).padStart(2, '0')}`] || {};
        for (let d = 1; d <= daysInMonth; d++) {
          let cls = 'day';
          if (monthEvents[d]) cls += ' has-ev ' + (monthEvents[d].kind || '');
          if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) cls += ' today';
          html += `<div class="${cls}" data-day="${d}" title="${monthEvents[d]?.label || ''}">${d}</div>`;
        }
        // trailing
        const totalCells = startDow + daysInMonth;
        const remaining = (7 - (totalCells % 7)) % 7;
        for (let i = 1; i <= remaining; i++) {
          html += `<div class="day muted">${i}</div>`;
        }
        gridEl.innerHTML = html;
        // event clicks · highlight + move to top of upcoming list
        gridEl.querySelectorAll('.day.has-ev').forEach(d => {
          d.addEventListener('click', () => {
            const day = d.getAttribute('data-day');
            const monthAbbrev = new Date(year, month, 1).toLocaleString('en-US', {month: 'short'});

            // clear previous active state on calendar
            gridEl.querySelectorAll('.day.has-ev.active').forEach(x => x.classList.remove('active'));
            d.classList.add('active');

            if (!upcomingEl) return;

            // CLOSE all currently-open + clear highlight
            upcomingEl.querySelectorAll('details.expand-item').forEach(x => {
              x.removeAttribute('open');
              x.classList.remove('highlight');
            });

            // Find the matching expand-item by day + month
            const items = Array.from(upcomingEl.querySelectorAll('details.expand-item'));
            const matched = items.find(item => {
              return item.getAttribute('data-day') === String(day) &&
                     (item.getAttribute('data-month') || '').toLowerCase().startsWith(monthAbbrev.toLowerCase().slice(0,3));
            });
            if (!matched) return;

            // MOVE to top of its parent (right under the heading)
            const parent = matched.parentNode;
            const heading = parent.querySelector('h3.h3, h3.mb-12');
            if (heading && heading.nextSibling !== matched) {
              parent.insertBefore(matched, heading.nextSibling);
            }
            // OPEN it and highlight
            matched.open = true;
            matched.classList.add('highlight');
            // Scroll the matched item INTO VIEW only if it's not already visible.
            // Keep the calendar in view: scroll so calendar top stays visible.
            const calRect = cal.getBoundingClientRect();
            const matchedRect = matched.getBoundingClientRect();
            const viewportH = window.innerHeight;
            // Only scroll if matched is below the viewport OR way above
            if (matchedRect.bottom > viewportH || matchedRect.top < 80) {
              // Scroll to a position that keeps the calendar's top edge visible
              // Calculate target: scroll so that calendar top is ~120px from viewport top
              const calOffset = calRect.top + window.scrollY;
              window.scrollTo({top: Math.max(0, calOffset - 120), behavior: 'smooth'});
            }
            // Persist highlight (don't auto-remove — user wants it visible until next click)
          });
        });
      };
      if (prevBtn) prevBtn.addEventListener('click', () => { cursor.setMonth(cursor.getMonth() - 1); render(); renderUpcoming(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { cursor.setMonth(cursor.getMonth() + 1); render(); renderUpcoming(); });
      render();
      renderUpcoming();
    });
  }

  /* ── Cohort switcher (Batch Profile page) ────────────────────── */
  function initCohortSwitcher() {
    const switcher = document.querySelector('[data-cohort-switcher]');
    if (!switcher) return;
    const statsHost = document.querySelector('[data-cohort-stats]');
    if (!statsHost) return;
    let cohorts = {};
    try { cohorts = JSON.parse(statsHost.getAttribute('data-cohorts') || '{}'); } catch (e) {}

    function applyCohort(key) {
      const data = cohorts[key];
      if (!data) return;
      // Update stat cells
      document.querySelectorAll('[data-stat]').forEach(cell => {
        const k = cell.getAttribute('data-stat');
        const v = data[k];
        if (v === undefined) return;
        const n = cell.querySelector('.stat-n');
        if (n) {
          n.textContent = v;
          n.removeAttribute('data-target');     // disable count-up override
        }
      });
      // Update kv bars
      document.querySelectorAll('[data-kv-key]').forEach(labelEl => {
        const k = labelEl.getAttribute('data-kv-key');
        const v = data[k];
        if (v === undefined) return;
        // Find the parent .kv element and update fill + pct text
        const row = labelEl.closest('.kv');
        if (!row) return;
        const fill = row.querySelector('.kv-fill');
        const pctEl = row.querySelector('.kv-pct');
        if (typeof v === 'number') {
          // Percentage value
          if (fill) fill.style.width = v + '%';
          if (pctEl) pctEl.textContent = v + '%';
          row.style.setProperty('--pct', v + '%');
        } else {
          // String value (CET, GPA, etc.)
          if (pctEl) pctEl.textContent = v;
        }
      });
    }

    switcher.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        switcher.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
        chip.classList.add('on');
        const filter = chip.getAttribute('data-filter');
        applyCohort(filter);
      });
    });
    // Dropdown variant
    const input = switcher.querySelector('[data-cohort-input]');
    if (input) {
      input.addEventListener('change', () => applyCohort(input.value));
    }
    // Apply current cohort on load
    const initial = switcher.querySelector('.chip.on');
    if (initial) applyCohort(initial.getAttribute('data-filter'));
    else if (input) applyCohort(input.value);
  }
  // initCohortSwitcher() called via bootAll

  /* ── Smooth-scroll for in-page anchors ───────────────────────── */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = a.getAttribute('href');
        if (target.length < 2) return;
        const el = document.querySelector(target);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth', block:'start'});
        }
      });
    });
  }

  /* ── Bar-chart animation on scroll ───────────────────────────── */
  function initBarAnim() {
    const bars = document.querySelectorAll('.bar-fill');
    if (!bars.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const w = en.target.getAttribute('data-w') || en.target.style.width;
          en.target.style.width = '0%';
          requestAnimationFrame(() => {
            en.target.style.width = w;
          });
          obs.unobserve(en.target);
        }
      });
    }, {threshold: 0.4});
    bars.forEach(b => {
      const w = b.style.width;
      b.setAttribute('data-w', w);
      b.style.width = '0%';
      obs.observe(b);
    });
  }

  /* ── Count-up for stats ──────────────────────────────────────── */
  function initCountUp() {
    document.querySelectorAll('.stat-n[data-target]').forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 1200;
      let started = false;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting && !started) {
            started = true;
            const start = performance.now();
            const tick = (now) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              const value = target * eased;
              const display = target % 1 === 0 ? Math.floor(value) : value.toFixed(1);
              el.textContent = prefix + display + suffix;
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      }, {threshold: 0.3});
      obs.observe(el);
    });
  }

  /* ── Scroll-reveal (premium fade-up on enter) ────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          en.target.style.transitionDelay = (i % 6) * 60 + 'ms';
          en.target.classList.add('in');
          obs.unobserve(en.target);
        }
      });
    }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
    els.forEach(e => obs.observe(e));
  }

  /* ── Parallax hero photo ─────────────────────────────────────── */
  function initParallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    const onScroll = () => {
      const y = window.scrollY;
      els.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.18;
        el.style.transform = `translateY(${y * speed}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, {passive:true});
  }


  /* ── Scroll progress bar ─────────────────────────────────────── */
  function initScrollProgress() {
    let bar = document.querySelector('.scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      document.body.appendChild(bar);
    }
    const update = () => {
      const docEl = document.documentElement;
      const top = (window.scrollY || docEl.scrollTop);
      const max = (docEl.scrollHeight - docEl.clientHeight) || 1;
      bar.style.width = ((top / max) * 100) + '%';
    };
    window.addEventListener('scroll', update, {passive:true});
    update();
  }

  /* ── Scrollytelling chapter swap ─────────────────────────────── */
  function initScrolly() {
    const sections = document.querySelectorAll('[data-scrolly]');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    sections.forEach(section => {
      const steps = section.querySelectorAll('.scrolly-step[data-step], .pa-scrolly-step[data-step]');
      const host = section.querySelector('[data-visual-host]');
      if (!steps.length || !host) return;
      const visuals = host.querySelectorAll('[data-step]');
      function activate(stepKey){
        steps.forEach(function(s){
          var on = s.getAttribute('data-step') === stepKey;
          s.classList.toggle('on', on);
          s.classList.toggle('is-active', on);
        });
        visuals.forEach(function(v){ v.classList.toggle('on', v.getAttribute('data-step') === stepKey); });
      }
      const obs = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (en.isIntersecting) {
            activate(en.target.getAttribute('data-step'));
          }
        });
      }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
      steps.forEach(function(s){ obs.observe(s); });
      activate(steps[0].getAttribute('data-step'));
    });
  }

  /* ── Boot all initializers ──────────────────────────────────── */
  function bootAll() {
    try { initBurger();         } catch(e){}
    try { initChips();          } catch(e){}
    try { initAccordion();      } catch(e){}
    try { initTabs();           } catch(e){}
    try { initModals();         } catch(e){}
    try { initForms();          } catch(e){}
    try { initPersonaRouter();  } catch(e){}
    try { initCalendar();       } catch(e){}
    try { initAnchorScroll();   } catch(e){}
    try { initBarAnim();        } catch(e){}
    try { initCountUp();        } catch(e){}
    try { initReveal();         } catch(e){}
    try { initParallax();       } catch(e){}
    try { initScrollProgress(); } catch(e){}
    try { initCohortSwitcher(); } catch(e){}
    try { initScrolly();        } catch(e){}
    try { initTedxReveal();     } catch(e){}
    try { initSpotlight();      } catch(e){}
    try { initPfFlow();         } catch(e){}
    try { initTocScrollSpy();   } catch(e){}
  }

  /* ── Generic TOC scroll-spy · activates aside[data-toc] anchors ── */
  function initTocScrollSpy(){
    var tocs = document.querySelectorAll('aside[data-toc], nav[data-toc]');
    if (!tocs.length) return;
    tocs.forEach(function(toc){
      var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
      var targets = links.map(function(l){
        var id = l.getAttribute('href').slice(1);
        return id ? document.getElementById(id) : null;
      }).filter(Boolean);
      if (!targets.length) return;
      function update(){
        var trig = window.scrollY + 220;
        var active = targets[0];
        for (var i = 0; i < targets.length; i++){
          if (targets[i].offsetTop <= trig) active = targets[i];
        }
        var id = '#' + active.id;
        links.forEach(function(l){ l.classList.toggle('on', l.getAttribute('href') === id); });
      }
      window.addEventListener('scroll', update, {passive:true});
      window.addEventListener('resize', update, {passive:true});
      update();
    });
  }

  /* ── Placement-flow progress bar reveal on scroll ── */
  function initPfFlow(){
    var flow = document.querySelector('[data-pf-flow]');
    if (!flow || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          en.target.classList.add('is-revealed');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin:'0px 0px -10% 0px', threshold:0.1 });
    io.observe(flow);
  }

  /* ── Cursor-tracking spotlight on partner grid ── */
  function initSpotlight(){
    var section = document.querySelector('.pr-partners');
    var host = document.querySelector('[data-spotlight-host]');
    var halo = document.querySelector('[data-spotlight]');
    if (!section || !host || !halo) return;
    var tiles = host.querySelectorAll('.pr-tile');
    if (!tiles.length) return;

    var raf = null;
    var lastX = 0, lastY = 0;

    function onMove(e){
      var rect = section.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      if (raf) return;
      raf = requestAnimationFrame(update);
    }
    function update(){
      raf = null;
      halo.style.left = lastX + 'px';
      halo.style.top = lastY + 'px';
      tiles.forEach(function(t){
        var r = t.getBoundingClientRect();
        var sr = section.getBoundingClientRect();
        var tx = r.left - sr.left + r.width/2;
        var ty = r.top - sr.top + r.height/2;
        var dx = tx - lastX, dy = ty - lastY;
        var d = Math.sqrt(dx*dx + dy*dy);
        t.classList.remove('is-near','is-near-mid','is-near-far');
        if (d < 140) t.classList.add('is-near');
        else if (d < 240) t.classList.add('is-near-mid');
        else if (d < 360) t.classList.add('is-near-far');
      });
    }
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseenter', function(){
      section.classList.add('is-hovering');
      host.classList.add('is-hovering');
    });
    section.addEventListener('mouseleave', function(){
      section.classList.remove('is-hovering');
      host.classList.remove('is-hovering');
      tiles.forEach(function(t){ t.classList.remove('is-near','is-near-mid','is-near-far'); });
    });
  }

  /* ── TEDx scroll-driven reveal · IO fallback for non-scroll-timeline browsers ── */
  function initTedxReveal(){
    if (CSS.supports('animation-timeline: view()')) return; // native handles it
    var els = document.querySelectorAll('[data-tedx-reveal], .tedx-section-head, .tedx-what-card, .tedx-program-card, .tedx-spotlight-card, .tedx-speaker-card, .tedx-involve-card, .tedx-history-step, .tedx-impact-cell, .tedx-final-card, .tedx-who-text, .tedx-who-img');
    if (!els.length || !('IntersectionObserver' in window)) return;
    els.forEach(function(el){ el.setAttribute('data-tedx-reveal',''); });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          en.target.classList.add('is-revealed');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    els.forEach(function(el){ io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }
})();
;
/* Scroll-driven cover curtain (fallback for non-Chrome browsers) */
(function(){
  if (CSS.supports('animation-timeline: scroll()')) return;
  const cover = document.querySelector('.sim-cover');
  if (!cover) return;
  const wrap = cover.closest('[data-cover]');
  if (!wrap) return;
  function update(){
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const prog = Math.max(0, Math.min(1, -rect.top / vh));
    cover.style.transform = `translateY(${-prog * 32}%) scale(${1 + prog * 0.02})`;
    cover.style.opacity = String(Math.max(0, 1 - prog * 1.2));
    cover.style.filter = `blur(${prog * 6}px)`;
  }
  window.addEventListener('scroll', update, {passive:true});
  update();
})();
;
/* Cover-mode reveal */
(function(){
  if (!document.body.classList.contains('has-cover')) return;
  let lifted = false;
  function lift(){
    if (lifted) return;
    lifted = true;
    document.body.classList.add('cover-lifted');
    setTimeout(() => {
      window.scrollTo({top: window.innerHeight, behavior: 'smooth'});
    }, 200);
  }
  window.addEventListener('wheel',   () => lift(), {passive:true, once:true});
  window.addEventListener('touchmove', () => lift(), {passive:true, once:true});
  window.addEventListener('scroll',  () => { if (window.scrollY > 4) lift(); }, {passive:true});
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown','PageDown','Space','End'].includes(e.code)) lift();
  }, {once:true});
})();
