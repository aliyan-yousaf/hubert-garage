(function () {
  'use strict';

  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.menu');
  var overlay = document.querySelector('.overlay');
  var toTop = document.querySelector('.to-top');

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    burger.classList.remove('open');
    overlay.classList.remove('show');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openMenu() {
    menu.classList.add('open');
    burger.classList.add('open');
    overlay.classList.add('show');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  if (burger) {
    burger.addEventListener('click', function () {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) closeMenu(); });
  }

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (toTop) toTop.classList.toggle('show', y > 500);
  }, { passive: true });
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Counters
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, end = parseInt(el.getAttribute('data-count'), 10), suffix = el.getAttribute('data-suffix') || '';
        var start = null, dur = 1400;
        function step(t) {
          if (!start) start = t;
          var p = Math.min((t - start) / dur, 1);
          el.textContent = Math.floor(p * end) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  }

  // Contact form -> WhatsApp (no backend needed)
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var text =
        'Dzień dobry, piszę ze strony Hubert Garage.%0A' +
        'Imię: ' + encodeURIComponent(d.get('name')) + '%0A' +
        'Telefon: ' + encodeURIComponent(d.get('phone')) + '%0A' +
        'Samochód: ' + encodeURIComponent(d.get('car') || '-') + '%0A' +
        'Usługa: ' + encodeURIComponent(d.get('service')) + '%0A' +
        'Wiadomość: ' + encodeURIComponent(d.get('message') || '-');
      window.open('https://wa.me/48789738706?text=' + text, '_blank', 'noopener');
    });
  }


  // Hero slider
  var slider = document.querySelector('.slider');
  if (slider) {
    var slides = slider.querySelectorAll('.slide');
    var dots = slider.querySelectorAll('.s-dots button');
    var idx = 0, timer = null, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    }
    function play() { if (reduce) return; stop(); timer = setInterval(function () { show(idx + 1); }, 5000); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    slider.querySelector('.prev').addEventListener('click', function () { show(idx - 1); play(); });
    slider.querySelector('.next').addEventListener('click', function () { show(idx + 1); play(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); play(); }); });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', play);
    var sx = 0;
    slider.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; stop(); }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      play();
    }, { passive: true });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
    play();
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
