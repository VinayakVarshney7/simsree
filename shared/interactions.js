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
                item.style.display = '';
              } else {
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
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      const close = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      };
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) closeBtn.addEventListener('click', close);
      modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => {
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

  /* ── Calendar (prev/next month) ──────────────────────────────── */
  function initCalendar() {
    document.querySelectorAll('[data-calendar]').forEach(cal => {
      let cursor = new Date(); // start at current month
      const events = JSON.parse(cal.getAttribute('data-events') || '{}');
      const titleEl = cal.querySelector('.cal-title');
      const gridEl = cal.querySelector('.cal-grid');
      const prevBtn = cal.querySelector('[data-cal-prev]');
      const nextBtn = cal.querySelector('[data-cal-next]');
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
        // event clicks
        gridEl.querySelectorAll('.day.has-ev').forEach(d => {
          d.addEventListener('click', () => {
            const day = d.getAttribute('data-day');
            const ev = monthEvents[day];
            showToast(`${ev.label} · ${monthName} ${day}`, 'ok');
          });
        });
      };
      if (prevBtn) prevBtn.addEventListener('click', () => { cursor.setMonth(cursor.getMonth() - 1); render(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { cursor.setMonth(cursor.getMonth() + 1); render(); });
      render();
    });
  }

  /* ── Cohort/year selector (chip group on Batch Profile) ──────── */
  // handled by initChips with data-chip-target if needed.

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
      const h = document.documentElement;
      const scrolled = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      bar.style.transform = `scaleX(${scrolled})`;
    };
    update();
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
  }

  /* ── Carousel / testimonials auto-cycle ──────────────────────── */
  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(car => {
      const slides = car.querySelectorAll('[data-slide]');
      const dots = car.querySelectorAll('[data-dot]');
      const interval = parseInt(car.getAttribute('data-interval')) || 5000;
      let idx = 0;
      let timer;
      const show = (i) => {
        slides.forEach((s, k) => s.classList.toggle('on', k === i));
        dots.forEach((d, k) => d.classList.toggle('on', k === i));
        idx = i;
      };
      const next = () => show((idx + 1) % slides.length);
      const start = () => { timer = setInterval(next, interval); };
      const stop = () => clearInterval(timer);
      dots.forEach((d, i) => d.addEventListener('click', () => { show(i); stop(); start(); }));
      car.addEventListener('mouseenter', stop);
      car.addEventListener('mouseleave', start);
      show(0); start();
    });
  }

  /* ── Logo strip auto-scroll ──────────────────────────────────── */
  function initLogoStrip() {
    document.querySelectorAll('[data-logo-strip]').forEach(strip => {
      // duplicate children for seamless loop
      const inner = strip.querySelector('.logo-strip-inner');
      if (!inner) return;
      inner.innerHTML += inner.innerHTML;
    });
  }

  /* ── Sticky in-page nav (TOC) ────────────────────────────────── */
  function initStickyToc() {
    document.querySelectorAll('[data-toc]').forEach(toc => {
      const links = toc.querySelectorAll('a[href^="#"]');
      const targets = Array.from(links).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
      const onScroll = () => {
        let active = -1;
        targets.forEach((t, i) => {
          if (t && t.getBoundingClientRect().top < 120) active = i;
        });
        links.forEach((l, i) => l.classList.toggle('on', i === active));
      };
      window.addEventListener('scroll', onScroll, {passive:true});
      onScroll();
    });
  }

  /* ── Init all ────────────────────────────────────────────────── */
  function init() {
    initBurger();
    initChips();
    initAccordion();
    initTabs();
    initModals();
    initForms();
    initPersonaRouter();
    initCalendar();
    initAnchorScroll();
    initBarAnim();
    initCountUp();
    initReveal();
    initParallax();
    initScrollProgress();
    initCarousels();
    initLogoStrip();
    initStickyToc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
