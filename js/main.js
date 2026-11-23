/* =====================================================================
   Portfolio engine. You do not need to edit this file.
   Content lives in ../content.js. Design lives in ../css/style.css.
   ===================================================================== */
(function () {
  'use strict';

  var C = window.SITE || {};
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var reduceMotion = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* ---------- tiny DOM helpers ---------- */
  function h(tag, attrs) {
    var e = doc.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v === true ? '' : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(e, arguments[i]);
    return e;
  }
  function append(parent, kid) {
    if (kid === null || kid === undefined || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { append(parent, k); }); return; }
    parent.appendChild(typeof kid === 'object' && kid.nodeType ? kid : doc.createTextNode(String(kid)));
  }
  function has(v) {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.trim() !== '';
    return v !== null && v !== undefined && v !== false;
  }
  function isPh(s) { return typeof s === 'string' && s.trim().indexOf('✎') === 0; }
  /* Text that may be a placeholder (starts with the pencil mark). */
  function T(s) { return isPh(s) ? h('span', { class: 'ph' }, s.trim().replace(/^\u270E\s+/, '\u270E\u00A0')) : s; }
  function P(s, cls) { return has(s) ? h('p', { class: cls || null }, T(s)) : null; }
  function field(label, value) {
    return has(value) ? h('div', { class: 'field' }, h('h4', null, label), h('p', null, T(value))) : null;
  }
  function chips(list, cls) {
    return has(list) ? h('ul', { class: 'chips ' + (cls || '') }, list.map(function (t) { return h('li', null, T(t)); })) : null;
  }
  function links(list) {
    if (!has(list)) return null;
    return h('p', { class: 'links' }, list.filter(function (l) { return l && has(l.url); }).map(function (l) {
      return h('a', { href: l.url, target: '_blank', rel: 'noopener' }, l.label || l.url);
    }));
  }
  function gallery(list) {
    if (!has(list)) return null;
    var items = list.map(function (im) { return typeof im === 'string' ? { src: im, alt: '', caption: '' } : im; })
      .filter(function (im) { return im && has(im.src); });
    if (!items.length) return null;
    return h('div', { class: 'gallery' }, items.map(function (im) {
      var img = h('img', { src: im.src, alt: im.alt || im.caption || '', loading: 'lazy' });
      var fig = h('figure', null,
        h('button', { type: 'button', class: 'thumb', 'aria-label': 'Enlarge picture' + (im.alt ? ': ' + im.alt : ''), onclick: function () { openLightbox(im); } }, img),
        has(im.caption) ? h('figcaption', null, im.caption) : null);
      img.addEventListener('error', function () { console.warn('[portfolio] Picture not found:', im.src); fig.remove(); });
      return fig;
    }));
  }
  function openLightbox(im) {
    var dlg = $('#lightbox');
    $('img', dlg).src = im.src; $('img', dlg).alt = im.alt || '';
    $('p', dlg).textContent = im.caption || '';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  $('#lightbox').addEventListener('click', function (e) { if (e.target === this) this.close(); });

  /* ---------- section scaffolding ---------- */
  var NAV = [];
  function section(id, label, title) {
    var kids = Array.prototype.slice.call(arguments, 3);
    NAV.push({ id: id, label: label });
    return h('section', { id: id, class: 'sec', 'aria-labelledby': id + '-h' },
      h('div', { class: 'wrap' },
        h('div', { class: 'sec-head' },
          h('h2', { id: id + '-h', tabindex: '-1', class: 'slash' }, title),
          h('span', { class: 'pin', 'aria-hidden': 'true' })),
        kids));
  }
  function card(cls) {
    var kids = Array.prototype.slice.call(arguments, 1);
    return h('article', { class: 'card reveal ' + (cls || '') }, kids);
  }

  /* ---------- HERO ---------- */
  function buildHero() {
    var photo = has(C.photo)
      ? h('img', { src: C.photo, alt: C.photoAlt || '' })
      : h('div', { class: 'photo-ph', 'aria-label': 'Space for a photo' }, h('span', null, 'photo soon'));
    var art = h('div', { class: 'hero-art', 'aria-hidden': 'true', html:
      '<div class="moon" data-speed="0.10"></div>' +
      '<svg class="ridge r1" data-speed="0.18" viewBox="0 0 1440 520" preserveAspectRatio="none"><path d="M0 250 L90 214 L180 240 L300 160 L400 226 L520 176 L640 250 L760 190 L880 238 L1010 170 L1140 244 L1260 196 L1440 250 L1440 520 L0 520Z" fill="#0d1527"/><path d="M0 250 L90 214 L180 240 L300 160 L400 226 L520 176 L640 250 L760 190 L880 238 L1010 170 L1140 244 L1260 196 L1440 250" fill="none" stroke="#3fd8e6" stroke-opacity=".3" stroke-width="1.4"/></svg>' +
      '<svg class="ridge r2" data-speed="0.3" viewBox="0 0 1440 520" preserveAspectRatio="none"><path d="M0 330 L140 270 L260 322 L380 250 L520 330 L660 262 L800 336 L940 268 L1090 330 L1230 274 L1440 336 L1440 520 L0 520Z" fill="#0a1020"/></svg>' +
      '<svg class="ridge r3" data-speed="0.46" viewBox="0 0 1440 520" preserveAspectRatio="none"><path d="M0 400 L120 360 L250 404 L420 340 L560 410 L720 350 L900 414 L1060 352 L1230 410 L1440 360 L1440 520 L0 520Z" fill="#070a12"/></svg>' });
    return h('section', { id: 'top', class: 'hero' },
      art,
      h('div', { class: 'photo', id: 'photo' }, photo),
      h('div', { class: 'hero-copy', id: 'hero-copy' },
        h('h1', { class: 'name', id: 'name', 'aria-label': C.first + ' ' + C.last },
          h('span', { 'aria-hidden': 'true' }, C.first), h('span', { class: 'name-2', 'aria-hidden': 'true' }, C.last)),
        h('p', { class: 'role' }, C.role),
        P(C.lede, 'lede'),
        h('p', { class: 'hero-links' },
          has(C.linkedin) ? h('a', { class: 'btn primary', href: C.linkedin, target: '_blank', rel: 'me noopener' }, 'LinkedIn profile') : null,
          has(C.github) ? h('a', { class: 'btn', href: C.github, target: '_blank', rel: 'noopener' }, 'GitHub') : null),
        h('p', { class: 'hint' }, 'Scroll down, or open the menu at the top right to jump to a section.')
      )
    );
  }

  /* ---------- SECTIONS ---------- */
  function buildAbout() {
    var a = C.about || {};
    return section('about', 'About', a.title || 'About me',
      h('div', { class: 'split' },
        h('div', { class: 'prose' }, (a.bio || []).map(function (p) { return P(p); })),
        h('div', { class: 'aside' },
          has(a.keySkills) ? h('div', null, h('h3', null, 'Key skills'), chips(a.keySkills)) : null,
          has(a.careerInterests) ? h('div', null, h('h3', null, 'Career interests'), h('ul', { class: 'plain' }, a.careerInterests.map(function (i) { return h('li', null, T(i)); }))) : null,
          has(C.cv) ? h('p', null, h('a', { class: 'btn', href: C.cv, target: '_blank', rel: 'noopener' }, 'Download my CV')) : null
        )));
  }

  function buildLearn() {
    var L = C.learn; if (!L) return null;
    return section('learn', 'Learn more', L.title || 'Learn more',
      P(L.intro, 'intro'),
      has(L.strengths) ? h('div', { class: 'grid g3' }, L.strengths.map(function (s) {
        return card('', h('h3', null, T(s.name)), P(s.note));
      })) : null,
      has(L.values) ? h('h3', { class: 'sub' }, 'Three values that guide me') : null,
      has(L.values) ? h('div', { class: 'grid g3' }, L.values.map(function (v) {
        return card('value', h('h3', null, T(v.name)), field('Why it matters', v.why), field('How it shapes my teamwork', v.how), field('Where it shows', v.example));
      })) : null,
      has(L.evidence) ? h('h3', { class: 'sub' }, 'Evidence') : null,
      has(L.evidence) ? h('div', { class: 'grid g2' }, L.evidence.map(function (e) { return card('', h('h3', null, T(e.title)), P(e.text)); })) : null
    );
  }

  function timeline(items) {
    return h('ol', { class: 'timeline' }, items.map(function (i) {
      return h('li', null, h('p', { class: 'when' }, T(i.when || '')), h('h4', null, T(i.title)), has(i.where) ? h('p', { class: 'where' }, T(i.where)) : null, P(i.note));
    }));
  }
  function buildKnow() {
    var K = C.know; if (!K) return null;
    return section('know', 'What I know', K.title || 'What I know',
      has(K.skills) ? h('div', { class: 'skillgrid' }, K.skills.map(function (g) {
        return h('div', { class: 'skillgroup reveal' }, h('h3', null, T(g.group)), chips(g.items));
      })) : null,
      h('div', { class: 'grid g2 tl' },
        has(K.education) ? h('div', null, h('h3', { class: 'sub' }, 'Education'), timeline(K.education)) : null,
        (has(K.experience) || has(K.certificates)) ? h('div', null, h('h3', { class: 'sub' }, 'Experience'), has(K.experience) ? timeline(K.experience) : null,
          has(K.certificates) ? h('div', null, h('h3', { class: 'sub' }, 'Certificates'), timeline(K.certificates)) : null) : null
      ));
  }

  function buildProjects() {
    var Pj = C.projects; if (!Pj || !has(Pj.items)) return null;
    return section('projects', 'Projects', Pj.title || 'Projects', P(Pj.intro, 'intro'),
      h('div', { class: 'stack' }, Pj.items.map(function (p) {
        return card('project',
          h('div', { class: 'card-top' }, h('h3', null, T(p.title)), has(p.status) ? h('span', { class: 'badge' }, p.status) : null),
          has(p.date) || has(p.context) ? h('p', { class: 'meta' }, [p.date, p.context].filter(has).join(', ')) : null,
          P(p.summary), field('What I built', p.mine), chips(p.tags, 'tags'), links(p.links), gallery(p.images));
      })));
  }

  function buildTalks() {
    var Tk = C.talks; if (!Tk || !has(Tk.items)) return null;
    return section('talks', 'Talks', Tk.title || 'What I learned from others', P(Tk.intro, 'intro'),
      h('div', { class: 'stack' }, Tk.items.map(function (t) {
        return card('talk',
          h('h3', null, T(t.title)),
          h('p', { class: 'meta' }, [T(t.speaker), has(t.speakerRole) ? ', ' + t.speakerRole : '', has(t.date) ? ' | ' : '', has(t.date) ? T(t.date) : ''].map(function (x) { return x; })),
          has(t.notes) ? h('div', { class: 'notes' }, h('h4', null, 'Notes from the talk'), h('ul', null, t.notes.map(function (n) { return h('li', null, T(n)); }))) : null,
          h('div', { class: 'reflect' }, field('Key messages', t.keyMessage), field('What surprised me', t.surprise), field('What challenged my thinking', t.challenged), field('How it may shape my career', t.career)),
          gallery(t.images),
          h('p', { class: 'links' }, has(t.slides) ? h('a', { href: t.slides, target: '_blank', rel: 'noopener' }, 'View the slides') : null, has(t.link) ? h('a', { href: t.link, target: '_blank', rel: 'noopener' }, 'Link') : null));
      })));
  }

  function buildIndustry() {
    var I = C.industry; if (!I || !has(I.items)) return null;
    return section('industry', 'Industry', I.title || 'Engaging with industry', P(I.intro, 'intro'),
      h('div', { class: 'stack' }, I.items.map(function (e) {
        return card('', h('h3', null, T(e.title)), has(e.date) ? h('p', { class: 'meta' }, T(e.date)) : null,
          h('div', { class: 'reflect' }, field('What I expected', e.expectations), field('What I learned about employers', e.learned), field('What stood out', e.stoodOut), field('What I will do next', e.actions)),
          gallery(e.images), links([{ label: 'Link', url: e.link }]));
      })));
  }

  function buildBeyond() {
    var B = C.beyond; if (!B || !has(B.items)) return null;
    return section('beyond', 'Beyond class', B.title || 'Beyond the classroom', P(B.intro, 'intro'),
      h('div', { class: 'stack' }, B.items.map(function (e) {
        return card('', h('h3', null, T(e.title)), has(e.role) || has(e.date) ? h('p', { class: 'meta' }, [T(e.role), has(e.date) ? ' | ' : '', has(e.date) ? T(e.date) : '']) : null,
          h('div', { class: 'reflect' }, field('My contribution', e.contribution), field('Impact on others', e.impact), field('Impact on my development', e.growth)),
          chips(e.skills, 'tags'), gallery(e.images), links([{ label: 'Link', url: e.link }]));
      })));
  }

  function buildYear() {
    var Y = C.year; if (!Y) return null;
    return section('year', 'This year', Y.title || 'How I developed this year', P(Y.intro, 'intro'),
      has(Y.required) ? h('div', { class: 'grid g2' }, Y.required.map(function (r) {
        return card('required', h('h3', null, T(r.title)), has(r.done) ? h('p', { class: 'meta' }, T(r.done)) : null, P(r.note), gallery(r.images));
      })) : null,
      has(Y.items) ? h('div', { class: 'stack' }, Y.items.map(function (a) {
        return card('', h('h3', null, T(a.title)),
          h('div', { class: 'reflect four' }, field('Situation', a.situation), field('Learning', a.learning), field('Application', a.application), field('Next step', a.next)),
          gallery(a.images));
      })) : null);
  }

  function buildNext() {
    var N = C.next; if (!N) return null;
    return section('next', 'Next steps', N.title || 'Where I\'m going next', P(N.intro, 'intro'),
      has(N.goals) ? h('h3', { class: 'sub' }, 'Goals for the next 12 months') : null,
      has(N.goals) ? h('div', { class: 'grid g3' }, N.goals.map(function (g) {
        return card('goal', h('h3', null, T(g.goal)), field('Why it matters', g.why), field('What I will do', g.actions), field('Target date', g.target));
      })) : null,
      has(N.reading) ? h('h3', { class: 'sub' }, 'Reading and resources') : null,
      has(N.reading) ? h('ul', { class: 'reading' }, N.reading.map(function (r) {
        var title = has(r.url) ? h('a', { href: r.url, target: '_blank', rel: 'noopener' }, T(r.title)) : T(r.title);
        return h('li', { class: 'reveal' }, h('p', { class: 'r-title' }, title, has(r.by) ? h('span', { class: 'by' }, ' by ', T(r.by)) : null),
          has(r.type) ? h('span', { class: 'badge' }, r.type) : null, P(r.note));
      })) : null);
  }

  function buildHobbies() {
    var Hb = C.hobbies; if (!Hb || !has(Hb.items)) return null;
    return section('hobbies', 'Hobbies', Hb.title || 'Away from the keyboard', P(Hb.intro, 'intro'),
      h('div', { class: 'tiles' }, Hb.items.map(function (x) {
        return h('div', { class: 'tile reveal' }, h('h3', null, T(x.name)), P(x.note), gallery(x.images));
      })));
  }

  function buildContact() {
    var K = C.contact; if (!K) return null;
    var emailOk = has(C.email) && !isPh(C.email);
    return section('contact', 'Contact', K.title || 'Get in touch', P(K.text, 'intro'),
      h('ul', { class: 'contact' },
        has(C.linkedin) ? h('li', null, h('a', { class: 'btn primary', href: C.linkedin, target: '_blank', rel: 'me noopener' }, 'LinkedIn')) : null,
        has(C.github) ? h('li', null, h('a', { class: 'btn', href: C.github, target: '_blank', rel: 'noopener' }, 'GitHub')) : null,
        has(C.email) ? h('li', null, emailOk ? h('a', { class: 'btn', href: 'mailto:' + C.email }, C.email) : h('span', { class: 'ph' }, C.email)) : null));
  }

  function buildFooter() {
    var D = C.declaration || {};
    var f = $('#footer');
    f.className = 'foot';
    f.appendChild(h('div', { class: 'wrap' },
      h('h2', { class: 'foot-h' }, D.aiTitle || 'Declaration of Generative AI and AI-assisted technologies'),
      h('p', null, h('strong', null, 'Tool used: '), T(D.aiTools || '')),
      h('p', null, h('strong', null, 'Reason: '), T(D.aiReason || '')),
      h('h2', { class: 'foot-h' }, 'Plagiarism declaration'),
      P(D.plagiarism),
      h('p', null, h('strong', null, 'Signed: '), T(D.signed || ''), '   ', h('strong', null, 'ID: '), T(D.studentId || '')),
      h('p', { class: 'fine' }, '© ', String(new Date().getFullYear()), ' ', C.first, ' ', C.last)
    ));
  }

  /* ---------- assemble ---------- */
  var main = $('#main');
  main.appendChild(buildHero());
  [buildAbout, buildLearn, buildKnow, buildProjects, buildTalks, buildIndustry, buildBeyond, buildYear, buildNext, buildHobbies, buildContact]
    .forEach(function (fn) { var s = fn(); if (s) main.appendChild(s); });
  buildFooter();

  doc.title = C.first + ' ' + C.last + ' | ' + (C.role ? C.role.split(' at ')[0] : 'Portfolio');
  $('#mark').textContent = C.first + ' ' + C.last;
  if (has(C.linkedin)) $('#li').href = C.linkedin; else $('#li').remove();

  var phCount = $$('.ph').length;
  console.info('[portfolio] ' + phCount + ' placeholder(s) left. Search for the pencil mark in content.js to find them.');

  /* ---------- menu ---------- */
  var menuList = $('#menu-list');
  NAV.forEach(function (n) {
    menuList.appendChild(h('li', null, h('a', { href: '#' + n.id, 'data-id': n.id }, n.label)));
  });
  var wrap = $('#menuwrap'), burger = $('#burger'), pinned = false, hoverTimer = null;
  function setOpen(open) {
    wrap.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close the section menu' : 'Open the section menu');
    if (!open) pinned = false;
  }
  wrap.addEventListener('pointerenter', function (e) {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(hoverTimer); setOpen(true);
  });
  wrap.addEventListener('pointerleave', function (e) {
    if (e.pointerType !== 'mouse' || pinned) return;
    hoverTimer = setTimeout(function () { setOpen(false); }, 260);
  });
  burger.addEventListener('click', function () {
    if (wrap.classList.contains('open') && !pinned) { pinned = true; return; }
    setOpen(!wrap.classList.contains('open'));
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); burger.focus(); } });
  doc.addEventListener('click', function (e) { if (!wrap.contains(e.target)) setOpen(false); });
  menuList.addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a) return;
    e.preventDefault(); setOpen(false); jumpTo(a.getAttribute('data-id'));
  });
  $('#mark').addEventListener('click', function (e) { e.preventDefault(); returnToRest(); smoothTo(0, 700); history.replaceState(null, '', location.pathname); });

  /* ---------- kunai ---------- */
  var kw = $('#kunai');
  var K = { state: 'rest', x: 0, y: 0, a: 80, s: 0.5, pin: null, raf: 0, stuckAngle: 24 };
  function setK(x, y, a, s) {
    K.x = x; K.y = y; K.a = a; K.s = s;
    kw.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + a.toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
  }
  function restPose() { return { x: Math.round(innerWidth / 2) + 34, y: innerHeight - 22, a: 80, s: 0.5 }; }
  function toRest() { var r = restPose(); setK(r.x, r.y, r.a, r.s); }
  function pinPoint(pin) { var r = pin.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  var eIO = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var eOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  function lerpAngle(a, b, t) { var d = ((b - a + 540) % 360) - 180; return a + d * t; }

  function cancelFlight() { if (K.raf) cancelAnimationFrame(K.raf); K.raf = 0; }
  function smoothTo(y, ms) {
    if (reduceMotion()) { scrollTo(0, y); return; }
    var y0 = scrollY, t0 = performance.now();
    (function step(now) {
      var t = clamp((now - t0) / ms, 0, 1);
      scrollTo(0, y0 + (y - y0) * eIO(t));
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }
  function returnToRest() {
    cancelFlight();
    if (K.state === 'rest') return;
    K.state = 'returning';
    kw.classList.remove('stuck', 'flying');
    kw.style.opacity = '0';
    setTimeout(function () {
      kw.style.transition = 'none'; toRest(); void kw.offsetWidth;
      kw.style.transition = ''; kw.style.opacity = '';
      K.state = 'rest'; K.pin = null;
    }, 260);
  }
  function land(pin, angle) {
    cancelFlight();
    K.state = 'stuck'; K.pin = pin; K.stuckAngle = angle;
    kw.classList.remove('flying'); kw.classList.add('stuck');
    kw.classList.remove('thud'); void kw.offsetWidth; kw.classList.add('thud');
    pin.classList.remove('hit'); void pin.offsetWidth; pin.classList.add('hit');
    follow();
  }
  function follow() {
    if (K.state !== 'stuck' || !K.pin) return;
    var p = pinPoint(K.pin);
    setK(p.x, p.y, K.stuckAngle, 0.95);
    if (p.y < -150 || p.y > innerHeight + 40) returnToRest();
  }

  function jumpTo(id) {
    var sec = doc.getElementById(id); if (!sec) return;
    var pin = $('.pin', sec);
    var maxY = doc.documentElement.scrollHeight - innerHeight;
    var startY = scrollY;
    var endY = clamp(sec.getBoundingClientRect().top + scrollY, 0, maxY);
    var heading = $('h2', sec);
    function done() {
      if (heading) heading.focus({ preventScroll: true });
      history.replaceState(null, '', '#' + id);
    }
    cancelFlight();
    var pr = pinPoint(pin);
    var target = { x: pr.x, y: pr.y + (startY - endY) };

    if (reduceMotion()) {
      scrollTo(0, endY); K.state = 'stuck'; kw.classList.add('stuck');
      requestAnimationFrame(function () { land(pin, 22); done(); }); return;
    }

    var start = (K.state === 'stuck') ? { x: K.x, y: K.y, a: K.a, s: K.s } : restPose();
    if (K.state === 'stuck' && (start.y < 0 || start.y > innerHeight)) start = restPose();
    K.state = 'flying'; K.pin = null;
    kw.classList.remove('stuck', 'thud'); kw.classList.add('flying'); kw.style.opacity = '';

    var dx = target.x - start.x, dy = target.y - start.y, dist = Math.hypot(dx, dy) || 1;
    var nx = -dy / dist, ny = dx / dist, bow = Math.min(160, dist * 0.18);
    var c = { x: (start.x + target.x) / 2 + nx * bow, y: (start.y + target.y) / 2 + ny * bow };
    var dur = clamp(520 + Math.abs(endY - startY) * 0.06, 640, 1000);
    var t0 = performance.now(), lastA = start.a;

    function interrupt() { cancelFlight(); unlisten(); scrollTo(0, scrollY); land(pin, clamp(lastA, -40, 40)); done(); }
    function unlisten() { ['wheel', 'touchstart', 'keydown'].forEach(function (ev) { removeEventListener(ev, interrupt); }); }
    ['wheel', 'touchstart', 'keydown'].forEach(function (ev) { addEventListener(ev, interrupt, { passive: true, once: true }); });

    function frame(now) {
      var t = clamp((now - t0) / dur, 0, 1);
      scrollTo(0, startY + (endY - startY) * eIO(t));
      var k = eOut(t), u = 1 - k;
      var x = u * u * start.x + 2 * u * k * c.x + k * k * target.x;
      var y = u * u * start.y + 2 * u * k * c.y + k * k * target.y;
      var tx = 2 * u * (c.x - start.x) + 2 * k * (target.x - c.x);
      var ty = 2 * u * (c.y - start.y) + 2 * k * (target.y - c.y);
      var tang = Math.atan2(tx, -ty) * 180 / Math.PI;
      var a = lerpAngle(start.a, tang, clamp(t / 0.22, 0, 1));
      lastA = a;
      setK(x, y, a, lerp(start.s, 0.95, k));
      if (t < 1) K.raf = requestAnimationFrame(frame);
      else { unlisten(); scrollTo(0, endY); land(pin, clamp(a, -40, 40)); done(); }
    }
    K.raf = requestAnimationFrame(frame);
  }

  /* ---------- scroll-driven effects ---------- */
  var moonEl = $('.moon'), parts = $$('[data-speed]'), photoEl = $('#photo'), heroCopy = $('#hero-copy'), nameEl = $('#name'), bar = $('#bar'), fill = $('#progress-fill');
  var lastY = scrollY, vel = 0, ticking = false;
  function onScroll() {
    var y = scrollY, vh = innerHeight;
    vel = vel * 0.8 + (y - lastY) * 0.2; lastY = y;
    if (!reduceMotion() && y < vh * 1.3) {
      parts.forEach(function (el) { el.style.transform = 'translate3d(0,' + (y * parseFloat(el.getAttribute('data-speed'))).toFixed(1) + 'px,0)'; });
      heroCopy.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
    }
    var p = clamp(y / (vh * 0.42), 0, 1);
    photoEl.style.opacity = (1 - p).toFixed(3);
    photoEl.style.transform = 'translate3d(' + (-34 * p).toFixed(1) + 'px,' + (-70 * p - y * 0.05).toFixed(1) + 'px,0) rotate(' + (-5 - 9 * p).toFixed(2) + 'deg) scale(' + (1 - 0.22 * p).toFixed(3) + ')';
    photoEl.style.visibility = p >= 1 ? 'hidden' : 'visible';
    bar.classList.toggle('scrolled', y > vh * 0.45);
    var max = doc.documentElement.scrollHeight - vh;
    fill.style.transform = 'scaleY(' + (max > 0 ? clamp(y / max, 0, 1) : 0).toFixed(4) + ')';
    follow();
    checkReveals();
    ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', function () { if (K.state === 'rest') toRest(); follow(); });

  /* reveal on enter + active section */
  doc.documentElement.classList.add('js');
  /* Reveal by position (an IntersectionObserver ignores fully clipped elements, so we check by hand). */
  var pending = $$('.reveal, .slash');
  function checkReveals() {
    if (!pending.length) return;
    var limit = innerHeight * 0.92;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) { el.classList.add('in'); return false; }
      return true;
    });
  }
  if ('IntersectionObserver' in window) {
    var current = null;
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        current = e.target.id;
        $$('#menu-list a').forEach(function (a) { if (a.getAttribute('data-id') === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.sec').forEach(function (s) { io2.observe(s); });
  }

  /* ---------- wind streaks (canvas) ---------- */
  var cv = $('#wind'), g = cv.getContext('2d'), streaks = [], W = 0, H = 0;
  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = clamp(Math.round(W * H / 30000), 14, 44);
    streaks = [];
    for (var i = 0; i < n; i++) streaks.push({
      x: Math.random() * W, y: Math.random() * H, len: 80 + Math.random() * 220, sp: 0.25 + Math.random() * 0.75,
      a: 0.05 + Math.random() * 0.11, ph: Math.random() * 6.28, amp: 3 + Math.random() * 9, warm: Math.random() < 0.14
    });
  }
  function drawWind(move) {
    g.clearRect(0, 0, W, H);
    var boost = 1 + Math.min(Math.abs(vel), 40) * 0.12;
    streaks.forEach(function (s) {
      if (move) { s.x += s.sp * boost; s.ph += 0.01; if (s.x - s.len > W) { s.x = -s.len; s.y = Math.random() * H; } }
      var y = s.y, wob = Math.sin(s.ph) * s.amp;
      var grad = g.createLinearGradient(s.x - s.len, y, s.x, y);
      var col = s.warm ? '255,107,134' : '110,220,235';
      grad.addColorStop(0, 'rgba(' + col + ',0)'); grad.addColorStop(0.7, 'rgba(' + col + ',' + s.a + ')'); grad.addColorStop(1, 'rgba(' + col + ',0)');
      g.strokeStyle = grad; g.lineWidth = 1;
      g.beginPath(); g.moveTo(s.x - s.len, y); g.quadraticCurveTo(s.x - s.len / 2, y + wob, s.x, y + wob * 0.3); g.stroke();
    });
  }
  function windLoop() { drawWind(true); vel *= 0.96; requestAnimationFrame(windLoop); }
  sizeCanvas();
  addEventListener('resize', function () { sizeCanvas(); if (reduceMotion()) drawWind(false); });
  if (reduceMotion()) drawWind(false); else requestAnimationFrame(windLoop);

  /* ---------- ambient wind sound (synthesised, off by default) ---------- */
  var soundBtn = $('#sound'), audio = null, soundOn = false;
  function buildAudio() {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    var ctx = new AC(), len = ctx.sampleRate * 6, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch), last = 0;
      for (var i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.2; }
    }
    var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 0.6;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1900;
    var gain = ctx.createGain(); gain.gain.value = 0;
    var lfo = ctx.createOscillator(); lfo.frequency.value = 0.07; var lfoG = ctx.createGain(); lfoG.gain.value = 260;
    lfo.connect(lfoG); lfoG.connect(bp.frequency);
    var lfo2 = ctx.createOscillator(); lfo2.frequency.value = 0.045; var lfo2G = ctx.createGain(); lfo2G.gain.value = 0.07;
    lfo2.connect(lfo2G); lfo2G.connect(gain.gain);
    src.connect(bp); bp.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
    src.start(); lfo.start(); lfo2.start();
    return { ctx: ctx, gain: gain, bp: bp };
  }
  function setSound(on) {
    soundOn = on;
    soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    soundBtn.setAttribute('aria-label', 'Wind sound, currently ' + (on ? 'on' : 'off'));
    soundBtn.classList.toggle('on', on);
    if (on) {
      if (!audio) audio = buildAudio();
      if (!audio) return;
      audio.ctx.resume();
      audio.gain.gain.cancelScheduledValues(audio.ctx.currentTime);
      audio.gain.gain.setTargetAtTime(0.16, audio.ctx.currentTime, 1.2);
    } else if (audio) {
      audio.gain.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.4);
      setTimeout(function () { if (!soundOn && audio) audio.ctx.suspend(); }, 1600);
    }
  }
  soundBtn.addEventListener('click', function () { setSound(!soundOn); });

  /* ---------- start ---------- */
  toRest(); onScroll();
  if (location.hash && doc.getElementById(location.hash.slice(1))) {
    var id = location.hash.slice(1);
    requestAnimationFrame(function () { var s = doc.getElementById(id); if (s && s.classList.contains('sec')) { scrollTo(0, s.getBoundingClientRect().top + scrollY); onScroll(); } });
  }
  window.__portfolio = { jumpTo: jumpTo, state: function () { return K.state; } };
})();
