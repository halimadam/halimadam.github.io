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
  var pad = function (n) { return n < 10 ? '0' + n : String(n); };

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
  function T(s) { return isPh(s) ? h('span', { class: 'ph' }, s.trim().replace(/^✎\s+/, '✎ ')) : s; }
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
  function normImgs(list) {
    return (list || []).map(function (im) { return typeof im === 'string' ? { src: im, alt: '', caption: '' } : im; })
      .filter(function (im) { return im && has(im.src); });
  }
  function gallery(list) {
    var items = normImgs(list);
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

  /* The picture (or the placeholder frame) that sits opposite the text. The first picture in an
     entry's images list fills the frame; the rest go into a small gallery under the text. */
  var IMG_ICON = '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M4 18l5.5-5.5 4 4 2.5-2.5L20 18"/></svg>';
  var CHECK_ICON = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M7.8 12.4l3 3 5.4-6"/></svg>';
  function media(list, label, cls) {
    var im = normImgs(list)[0];
    var box = h('div', { class: 'feat-media reveal reveal-media ' + (cls || '') });
    function placeholder() {
      box.innerHTML = '';
      box.appendChild(h('div', { class: 'media-ph', role: 'img', 'aria-label': label, html: IMG_ICON }, h('span', null, label)));
    }
    if (im) {
      var img = h('img', { src: im.src, alt: im.alt || im.caption || '', loading: 'lazy' });
      img.addEventListener('error', function () { console.warn('[portfolio] Picture not found:', im.src); placeholder(); });
      box.appendChild(h('button', { type: 'button', class: 'thumb', 'aria-label': 'Enlarge picture' + (im.alt ? ': ' + im.alt : ''), onclick: function () { openLightbox(im); } }, img));
    } else placeholder();
    return box;
  }
  function rest(list) { return gallery(normImgs(list).slice(1)); }
  /* One text-and-picture row. Every second row is mirrored. */
  function feat(i, off, textKids, mediaBox) {
    var flip = (i + off) % 2 === 1;
    return h('article', { class: 'feat' + (flip ? ' flip' : '') },
      h('div', { class: 'feat-text reveal' }, h('p', { class: 'feat-no' }, pad(i + 1)), textKids),
      mediaBox);
  }

  /* ---------- section scaffolding ---------- */
  var NAV = [];
  function section(id, label, title) {
    var kids = Array.prototype.slice.call(arguments, 3);
    NAV.push({ id: id, label: label });
    var alt = NAV.length % 2 === 0;
    return h('section', { id: id, class: 'sec' + (alt ? ' alt' : ''), 'aria-labelledby': id + '-h' },
      h('div', { class: 'wrap' },
        h('div', { class: 'sec-head' },
          h('h2', { id: id + '-h', tabindex: '-1', class: 'slash' }, title),
          h('span', { class: 'pin', 'aria-hidden': 'true' })),
        kids));
  }

  /* ---------- HERO ---------- */
  function buildHero() {
    var photo = has(C.photo)
      ? h('img', { src: C.photo, alt: C.photoAlt || '' })
      : h('div', { class: 'photo-ph', 'aria-label': 'Space for a photo' }, h('span', null, 'photo soon'));
    var art = h('div', { class: 'hero-art', 'aria-hidden': 'true', html:
      '<div class="hero-glow"></div>' +
      '<div class="moon" data-speed="0.10">' +
        '<svg class="moon-spin" id="moon-spin" viewBox="0 0 200 200">' +
          '<defs><clipPath id="moon-clip"><circle cx="100" cy="100" r="100"/></clipPath></defs>' +
          '<g clip-path="url(#moon-clip)"><rect width="200" height="200" fill="#E6B78C"/>' +
          '<g fill="none" stroke="#2C3531" stroke-opacity=".85" stroke-width="3.6" stroke-linecap="round">' +
            '<path d="M100 -2V202"/><path d="M-2 100H202"/><path d="M34 22C70 64 70 136 34 178"/><path d="M166 22C130 64 130 136 166 178"/>' +
          '</g></g>' +
        '</svg><i class="moon-shade"></i></div>' });
    return h('section', { id: 'top', class: 'hero' },
      art,
      h('div', { class: 'photo', id: 'photo' }, photo),
      h('div', { class: 'hero-copy', id: 'hero-copy' },
        h('h1', { class: 'name', id: 'name', 'aria-label': C.first + ' ' + C.last },
          h('span', { 'aria-hidden': 'true' }, C.first), h('span', { class: 'name-2', 'aria-hidden': 'true' }, C.last)),
        h('p', { class: 'role' }, C.role),
        P(C.lede, 'lede'),
        h('p', { class: 'hero-links' },
          has(C.linkedin) ? h('a', { class: 'btn primary', href: C.linkedin, target: '_blank', rel: 'me noopener' }, 'LinkedIn') : null,
          has(C.github) ? h('a', { class: 'btn', href: C.github, target: '_blank', rel: 'noopener' }, 'GitHub') : null)
      )
    );
  }

  /* ---------- SECTIONS ---------- */
  function buildAbout() {
    var a = C.about || {};
    return section('about', 'About', a.title || 'About me',
      h('div', { class: 'feat' },
        h('div', { class: 'feat-text prose reveal' },
          (a.bio || []).map(function (p, i) { return P(p, i === 0 ? 'lead' : null); }),
          has(a.keySkills) ? [h('h3', { class: 'mini' }, 'Key skills'), chips(a.keySkills)] : null,
          has(a.careerInterests) ? [h('h3', { class: 'mini' }, 'Career interests'), h('ul', { class: 'plain' }, a.careerInterests.map(function (i) { return h('li', null, T(i)); }))] : null,
          has(C.cv) ? h('p', { style: 'margin-top:1.4em' }, h('a', { class: 'btn', href: C.cv, target: '_blank', rel: 'noopener' }, 'Download my CV')) : null
        ),
        media(has(a.image) ? [a.image] : [], 'A photo of you goes here', 'tall')));
  }

  function buildLearn() {
    var L = C.learn; if (!L) return null;
    return section('learn', 'Learn more', L.title || 'Learn more',
      P(L.intro, 'intro'),
      has(L.strengths) ? h('div', { class: 'statements' }, L.strengths.map(function (s, i) {
        return h('div', { class: 'statement reveal' }, h('span', { class: 'big-no' }, pad(i + 1)), h('h3', null, T(s.name)), P(s.note));
      })) : null,
      has(L.values) ? h('h3', { class: 'sub' }, 'Three values that guide me') : null,
      has(L.values) ? h('div', { class: 'value-rows' }, L.values.map(function (v, i) {
        return h('article', { class: 'value-row reveal' },
          h('div', null, h('span', { class: 'big-no' }, pad(i + 1)), h('h3', null, T(v.name))),
          h('div', null, field('Why it matters', v.why), field('How it shapes my teamwork', v.how), field('Where it shows', v.example)));
      })) : null,
      has(L.evidence) ? h('h3', { class: 'sub' }, 'Evidence') : null,
      has(L.evidence) ? h('div', { class: 'grid g2' }, L.evidence.map(function (e) { return h('article', { class: 'quote reveal' }, h('h3', null, T(e.title)), P(e.text)); })) : null
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
      has(K.skills) ? h('div', { class: 'skillrows' }, K.skills.map(function (g) {
        return h('div', { class: 'skillrow reveal' }, h('h3', null, T(g.group)), chips(g.items));
      })) : null,
      h('div', { class: 'grid g2 tl' },
        has(K.education) ? h('div', { class: 'reveal' }, h('h3', { class: 'sub' }, 'Education'), timeline(K.education)) : null,
        (has(K.experience) || has(K.certificates)) ? h('div', { class: 'reveal' }, h('h3', { class: 'sub' }, 'Experience'), has(K.experience) ? timeline(K.experience) : null,
          has(K.certificates) ? h('div', null, h('h3', { class: 'sub' }, 'Certificates'), timeline(K.certificates)) : null) : null
      ));
  }

  function buildProjects() {
    var Pj = C.projects; if (!Pj || !has(Pj.items)) return null;
    return section('projects', 'Projects', Pj.title || 'Projects', P(Pj.intro, 'intro'),
      h('div', { class: 'feats' }, Pj.items.map(function (p, i) {
        return feat(i, 0, [
          h('div', { class: 'card-top' }, h('h3', null, T(p.title)), has(p.status) ? h('span', { class: 'badge' }, p.status) : null),
          has(p.date) || has(p.context) ? h('p', { class: 'meta' }, [p.date, p.context].filter(has).join(', ')) : null,
          P(p.summary), field('What I built', p.mine), chips(p.tags, 'tags'), links(p.links), rest(p.images)
        ], media(p.images, 'Screenshot goes here'));
      })));
  }

  function buildTalks() {
    var Tk = C.talks; if (!Tk || !has(Tk.items)) return null;
    return section('talks', 'Talks', Tk.title || 'What I learned from others', P(Tk.intro, 'intro'),
      h('div', { class: 'talks' }, Tk.items.map(function (t, i) {
        return h('article', { class: 'talk' + (i % 2 ? ' flip' : '') },
          h('div', { class: 'talk-side reveal' },
            h('p', { class: 'feat-no' }, pad(i + 1)),
            h('h3', null, T(t.title)),
            h('p', { class: 'meta' }, [T(t.speaker), has(t.speakerRole) ? ', ' + t.speakerRole : '', has(t.date) ? ' | ' : '', has(t.date) ? T(t.date) : '']),
            media(t.images, 'Photo or slide from the talk')),
          h('div', { class: 'talk-body reveal' },
            has(t.notes) ? h('div', { class: 'notes' }, h('h4', null, 'Notes from the talk'), h('ul', null, t.notes.map(function (n) { return h('li', null, T(n)); }))) : null,
            h('div', { class: 'panel' }, h('div', { class: 'reflect' }, field('Key messages', t.keyMessage), field('What surprised me', t.surprise), field('What challenged my thinking', t.challenged), field('How it may shape my career', t.career))),
            rest(t.images),
            h('p', { class: 'links' }, has(t.slides) ? h('a', { href: t.slides, target: '_blank', rel: 'noopener' }, 'View the slides') : null, has(t.link) ? h('a', { href: t.link, target: '_blank', rel: 'noopener' }, 'Link') : null)));
      })));
  }

  function buildIndustry() {
    var I = C.industry; if (!I || !has(I.items)) return null;
    return section('industry', 'Industry', I.title || 'Engaging with industry', P(I.intro, 'intro'),
      h('div', { class: 'feats' }, I.items.map(function (e, i) {
        return feat(i, 1, [
          h('h3', null, T(e.title)), has(e.date) ? h('p', { class: 'meta' }, T(e.date)) : null,
          field('What I expected', e.expectations), field('What I learned about employers', e.learned), field('What stood out', e.stoodOut), field('What I will do next', e.actions),
          rest(e.images), links([{ label: 'Link', url: e.link }])
        ], media(e.images, 'Event photo goes here'));
      })));
  }

  function buildBeyond() {
    var B = C.beyond; if (!B || !has(B.items)) return null;
    return section('beyond', 'Beyond class', B.title || 'Beyond the classroom', P(B.intro, 'intro'),
      h('div', { class: 'feats' }, B.items.map(function (e, i) {
        return feat(i, 0, [
          h('h3', null, T(e.title)), has(e.role) || has(e.date) ? h('p', { class: 'meta' }, [T(e.role), has(e.date) ? ' | ' : '', has(e.date) ? T(e.date) : '']) : null,
          field('My contribution', e.contribution), field('Impact on others', e.impact), field('Impact on my development', e.growth),
          chips(e.skills, 'tags'), rest(e.images), links([{ label: 'Link', url: e.link }])
        ], media(e.images, 'Photo goes here', 'tall'));
      })));
  }

  function buildYear() {
    var Y = C.year; if (!Y) return null;
    return section('year', 'This year', Y.title || 'How I developed this year', P(Y.intro, 'intro'),
      has(Y.required) ? h('div', { class: 'grid g2' }, Y.required.map(function (r) {
        return h('article', { class: 'panel check reveal' }, h('span', { html: CHECK_ICON }),
          h('div', null, h('h3', null, T(r.title)), has(r.done) ? h('p', { class: 'meta' }, T(r.done)) : null, P(r.note), gallery(r.images)));
      })) : null,
      has(Y.items) ? h('div', { class: 'steps' }, Y.items.map(function (a) {
        return h('article', { class: 'step-row reveal' }, h('h3', null, T(a.title)),
          h('div', { class: 'step-cols' },
            [['Situation', a.situation], ['Learning', a.learning], ['Application', a.application], ['Next step', a.next]].map(function (s) {
              return has(s[1]) ? h('div', { class: 'step-col' }, h('h4', null, s[0]), h('p', null, T(s[1]))) : null;
            })),
          gallery(a.images));
      })) : null);
  }

  function buildNext() {
    var N = C.next; if (!N) return null;
    return section('next', 'Next steps', N.title || 'Where I\'m going next', P(N.intro, 'intro'),
      has(N.goals) ? h('h3', { class: 'sub', style: 'margin-top:0' }, 'Goals for the next 12 months') : null,
      has(N.goals) ? h('div', { class: 'grid g3' }, N.goals.map(function (g, i) {
        return h('article', { class: 'goal reveal' }, h('span', { class: 'big-no' }, pad(i + 1)), h('h3', null, T(g.goal)), field('Why it matters', g.why), field('What I will do', g.actions), field('Target date', g.target));
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
    return section('contact', 'Contact', K.title || 'Get in touch',
      h('div', { class: 'cta reveal' },
        P(K.text, 'intro'),
        h('ul', { class: 'contact' },
          has(C.linkedin) ? h('li', null, h('a', { class: 'btn primary', href: C.linkedin, target: '_blank', rel: 'me noopener' }, 'LinkedIn')) : null,
          has(C.github) ? h('li', null, h('a', { class: 'btn', href: C.github, target: '_blank', rel: 'noopener' }, 'GitHub')) : null,
          has(C.email) ? h('li', null, emailOk ? h('a', { class: 'btn', href: 'mailto:' + C.email }, C.email) : h('span', { class: 'ph' }, C.email)) : null)));
  }

  function buildFooter() {
    var f = $('#footer');
    f.className = 'foot';
    f.appendChild(h('div', { class: 'wrap' },
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
  var K = { state: 'rest', x: 0, y: 0, a: 78, s: 0.5, pin: null, raf: 0, stuckAngle: 24 };
  function setK(x, y, a, s) {
    K.x = x; K.y = y; K.a = a; K.s = s;
    kw.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + a.toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
  }
  /* The kunai waits in the bottom-left corner. Its tip is the origin, so the body trails off to the left. */
  function restPose() {
    var a = 78, s = 0.5, body = 110 * s;
    return { x: 28 + body * Math.sin(a * Math.PI / 180), y: innerHeight - 34, a: a, s: s };
  }
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

  /* Every jump is a fresh throw from the bottom-left corner. If the kunai is still stuck in the
     previous section it is first pulled free and carried back to the corner, so a jump between two
     nearby sections still reads as one clear throw instead of a wiggle on the spot. */
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

    var rest = restPose();
    var from = { x: K.x, y: K.y, a: K.a, s: K.s };
    var pullBack = (K.state === 'stuck' && K.y >= -20 && K.y <= innerHeight + 20) ? 300 : 0;
    var fly = clamp(580 + Math.abs(endY - startY) * 0.05, 720, 1050);
    var total = pullBack + fly;
    K.state = 'flying'; K.pin = null;
    kw.classList.remove('stuck', 'thud'); kw.classList.add('flying'); kw.style.opacity = '';
    if (!pullBack) setK(rest.x, rest.y, rest.a, rest.s);

    var dx = target.x - rest.x, dy = target.y - rest.y, dist = Math.hypot(dx, dy) || 1;
    var nx = -dy / dist, ny = dx / dist, bow = Math.min(190, dist * 0.2);
    var c = { x: (rest.x + target.x) / 2 + nx * bow, y: (rest.y + target.y) / 2 + ny * bow };
    var t0 = performance.now(), lastA = rest.a;

    function interrupt() { cancelFlight(); unlisten(); scrollTo(0, scrollY); land(pin, clamp(lastA, -40, 40)); done(); }
    function unlisten() { ['wheel', 'touchstart', 'keydown'].forEach(function (ev) { removeEventListener(ev, interrupt); }); }
    ['wheel', 'touchstart', 'keydown'].forEach(function (ev) { addEventListener(ev, interrupt, { passive: true, once: true }); });

    function frame(now) {
      var el = now - t0, t = clamp(el / total, 0, 1);
      scrollTo(0, startY + (endY - startY) * eIO(t));
      if (el < pullBack) {
        var r = eIO(el / pullBack);
        setK(lerp(from.x, rest.x, r), lerp(from.y, rest.y, r), lerpAngle(from.a, rest.a, r), lerp(from.s, rest.s, r));
        lastA = K.a;
      } else {
        var ft = clamp((el - pullBack) / fly, 0, 1);
        var k = eOut(ft), u = 1 - k;
        var x = u * u * rest.x + 2 * u * k * c.x + k * k * target.x;
        var y = u * u * rest.y + 2 * u * k * c.y + k * k * target.y;
        var tx = 2 * u * (c.x - rest.x) + 2 * k * (target.x - c.x);
        var ty = 2 * u * (c.y - rest.y) + 2 * k * (target.y - c.y);
        var tang = Math.atan2(tx, -ty) * 180 / Math.PI;
        var a = lerpAngle(rest.a, tang, clamp(ft / 0.22, 0, 1));
        lastA = a;
        setK(x, y, a, lerp(rest.s, 0.95, k));
      }
      if (t < 1) K.raf = requestAnimationFrame(frame);
      else { unlisten(); scrollTo(0, endY); land(pin, clamp(lastA, -40, 40)); done(); }
    }
    K.raf = requestAnimationFrame(frame);
  }

  /* ---------- the ball (spins against the scroll) ---------- */
  var moonSpin = $('#moon-spin'), moonAng = 0, moonTarget = 0, moonRaf = 0, moonLast = 0;
  function spinMoon(now) {
    var dt = moonLast ? Math.min(now - moonLast, 64) : 16;   /* time-based easing: same feel at any frame rate */
    moonLast = now;
    moonAng += (moonTarget - moonAng) * (1 - Math.exp(-dt / 110));
    moonSpin.style.transform = 'rotate(' + moonAng.toFixed(2) + 'deg)';
    if (Math.abs(moonTarget - moonAng) > 0.05) moonRaf = requestAnimationFrame(spinMoon);
    else { moonRaf = 0; moonLast = 0; }
  }

  /* ---------- the katana ----------
     Scroll position drives everything, so scrolling back up puts the sword back in its sheath.
     0 to about half: the blade slides out of the saya.
     Second half: the sword swings upright, the saya slips away to the left, and the blade ends
     embedded along the right edge. Units below are the sword's own drawing units. */
  var swordEl = $('#kt-sword'), sayaEl = $('#kt-saya'), glintEl = $('#kt-glint'), docked = false;
  function katanaFrame(y) {
    var W = innerWidth, vh = innerHeight;
    var u = clamp(y / (vh * 0.95), 0, 1), a, b;
    if (reduceMotion()) { a = u > 0.25 ? 1 : 0; b = u > 0.5 ? 1 : 0; }
    else { a = eIO(clamp(u / 0.52, 0, 1)); b = eIO(clamp((u - 0.5) / 0.5, 0, 1)); }

    var sx = Math.max(14, W * 0.03);
    var s0 = clamp((W * 0.94 - sx) / 1698, 0.3, 0.85);            /* scale while lying across the bottom */
    var sy = vh - Math.max(58, vh * 0.09);                          /* height of its centre line */
    var narrow = W < 900;                                           /* phones: slimmer, and half sunk into the edge so it never covers text */
    var sd = clamp((vh - 92 - 90) / 976, 0.28, narrow ? 0.4 : 0.62);   /* scale once embedded */
    var xD = narrow ? W - 2 : W - 10 - 26 * sd, yD = 92 + 976 * sd;    /* where the tip ends up */

    sayaEl.style.transform = 'translate3d(' + (sx - b * (sx + 780 * s0)).toFixed(1) + 'px,' + (sy + b * 40).toFixed(1) + 'px,0) scale(' + s0.toFixed(4) + ')';
    sayaEl.style.opacity = (1 - b).toFixed(3);
    sayaEl.style.visibility = b >= 1 ? 'hidden' : 'visible';

    var tipX = sx + 22 * s0 + a * 700 * s0;
    swordEl.style.transform = 'translate3d(' + lerp(tipX, xD, b).toFixed(1) + 'px,' + lerp(sy, yD, b).toFixed(1) + 'px,0) rotate(' + (-90 * b).toFixed(2) + 'deg) scale(' + lerp(s0, sd, b).toFixed(4) + ')';
    var glow = a * (1 - b);
    swordEl.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,.45))' + (glow > 0.01 ? ' drop-shadow(0 0 ' + (glow * 12).toFixed(1) + 'px rgba(255,203,154,' + (glow * 0.6).toFixed(2) + '))' : '');

    /* once embedded, a gold glint slides down the blade as the page scrolls */
    var max = doc.documentElement.scrollHeight - vh;
    var prog = max > 0 ? clamp(y / max, 0, 1) : 0;
    glintEl.setAttribute('opacity', b > 0.98 ? '1' : '0');
    glintEl.setAttribute('x', (600 * (1 - prog)).toFixed(1));

    if (b > 0.995 && !docked) {
      docked = true;
      swordEl.classList.remove('thud'); void swordEl.getBoundingClientRect(); swordEl.classList.add('thud');
    } else if (b < 0.9 && docked) { docked = false; swordEl.classList.remove('thud'); }
  }

  /* ---------- scroll-driven effects ---------- */
  var parts = $$('[data-speed]'), photoEl = $('#photo'), heroCopy = $('#hero-copy'), bar = $('#bar'), fill = $('#progress-fill');
  var lastY = scrollY, vel = 0, ticking = false;
  function onScroll() {
    var y = scrollY, vh = innerHeight;
    vel = vel * 0.8 + (y - lastY) * 0.2; lastY = y;
    if (!reduceMotion() && y < vh * 1.3) {
      parts.forEach(function (el) { el.style.transform = 'translate3d(0,' + (y * parseFloat(el.getAttribute('data-speed'))).toFixed(1) + 'px,0)'; });
      heroCopy.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
    }
    heroCopy.style.opacity = clamp(1 - (y - vh * 0.18) / (vh * 0.55), 0, 1).toFixed(3);
    if (!reduceMotion()) {
      moonTarget = -Math.min(y, vh * 1.6) * 0.4;                    /* down = anticlockwise, up = clockwise */
      if (!moonRaf) moonRaf = requestAnimationFrame(spinMoon);
    }
    var p = clamp(y / (vh * 0.42), 0, 1);
    photoEl.style.opacity = (1 - p).toFixed(3);
    photoEl.style.transform = 'translate3d(' + (-34 * p).toFixed(1) + 'px,' + (-70 * p - y * 0.05).toFixed(1) + 'px,0) rotate(' + (-5 - 9 * p).toFixed(2) + 'deg) scale(' + (1 - 0.22 * p).toFixed(3) + ')';
    photoEl.style.visibility = p >= 1 ? 'hidden' : 'visible';
    bar.classList.toggle('scrolled', y > vh * 0.45);
    var max = doc.documentElement.scrollHeight - vh;
    fill.style.transform = 'scaleY(' + (max > 0 ? clamp(y / max, 0, 1) : 0).toFixed(4) + ')';
    katanaFrame(y);
    follow();
    checkReveals();
    ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', function () { if (K.state === 'rest') toRest(); onScroll(); });

  /* reveal on enter + active section */
  doc.documentElement.classList.add('js');
  /* Reveal by position (an IntersectionObserver ignores fully clipped elements, so we check by hand). */
  var revealEls = $$('.reveal, .slash');
  function checkReveals() {
    var vh = innerHeight, limit = vh * 0.92;
    revealEls.forEach(function (el) {
      var top = el.getBoundingClientRect().top, shown = el.classList.contains('in');
      if (!shown && top < limit) el.classList.add('in');
      /* scrolled back up past it: put it back, so it plays again on the way down (gap avoids flicker) */
      else if (shown && top > vh + 60) el.classList.remove('in');
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
      a: 0.05 + Math.random() * 0.11, ph: Math.random() * 6.28, amp: 3 + Math.random() * 9, warm: Math.random() < 0.18
    });
  }
  function drawWind(move) {
    g.clearRect(0, 0, W, H);
    var boost = 1 + Math.min(Math.abs(vel), 40) * 0.12;
    streaks.forEach(function (s) {
      if (move) { s.x += s.sp * boost; s.ph += 0.01; if (s.x - s.len > W) { s.x = -s.len; s.y = Math.random() * H; } }
      var y = s.y, wob = Math.sin(s.ph) * s.amp;
      var grad = g.createLinearGradient(s.x - s.len, y, s.x, y);
      var col = s.warm ? '255,203,154' : '150,215,205';
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
  window.__portfolio = { jumpTo: jumpTo, state: function () { return K.state; }, kunai: function () { return { x: K.x, y: K.y, a: K.a }; } };
})();
