(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  function initMenu() {
    var menuToggle = document.querySelector('.menu-toggle');
    var mainNav = document.querySelector('#main-nav');
    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 950) {
          mainNav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.textContent = '☰';
        }
      });
    });
  }

  function initHeroMouseTilt() {
    if (prefersReducedMotion) return;

    var heroImages = document.querySelector('.hero-app-images');
    var screens = document.querySelectorAll('.hero-screen');
    if (!heroImages || !screens.length) return;

    heroImages.addEventListener('mousemove', function (event) {
      var rect = heroImages.getBoundingClientRect();
      var offsetX = (event.clientX - rect.left - rect.width / 2) / rect.width;
      var offsetY = (event.clientY - rect.top - rect.height / 2) / rect.height;

      screens.forEach(function (screen, index) {
        var factor = (index + 1) * 3;
        screen.style.setProperty(
          '--tilt-x',
          offsetX * factor + 'px'
        );
        screen.style.setProperty(
          '--tilt-y',
          offsetY * factor + 'px'
        );
      });
    });

    heroImages.addEventListener('mouseleave', function () {
      screens.forEach(function (screen) {
        screen.style.setProperty('--tilt-x', '0px');
        screen.style.setProperty('--tilt-y', '0px');
      });
    });
  }

  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-on-scroll').forEach(function (el) {
        el.classList.add('is-visible');
      });
      document
        .querySelectorAll('.reveal-stagger > .reveal-item')
        .forEach(function (el) {
          el.classList.add('is-visible');
        });
      return;
    }

    var staggerObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var container = entry.target;
          var items = container.querySelectorAll('.reveal-item');
          items.forEach(function (item, i) {
            window.setTimeout(function () {
              item.classList.add('is-visible');
            }, i * 70);
          });
          staggerObserver.unobserve(container);
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    document.querySelectorAll('.reveal-stagger').forEach(function (el) {
      staggerObserver.observe(el);
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );

    document.querySelectorAll('.reveal, .reveal-on-scroll').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  function initHeroScrollParallax() {
    if (prefersReducedMotion) return;

    var hero = document.querySelector('.hero');
    var heroImages = document.querySelector('.hero-app-images');
    if (!hero || !heroImages) return;

    var ticking = false;

    function update() {
      ticking = false;
      var rect = hero.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      var progress = 1 - (rect.bottom / (vh + rect.height));
      progress = Math.max(0, Math.min(1, progress));
      var shift = (progress - 0.35) * 42;
      heroImages.style.setProperty('--scroll-parallax', shift.toFixed(2) + 'px');
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function initImageParallax() {
    if (prefersReducedMotion) return;

    var blocks = document.querySelectorAll('[data-parallax-img]');
    if (!blocks.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight || 1;
      blocks.forEach(function (wrap) {
        var img = wrap.querySelector('img');
        if (!img) return;
        var rect = wrap.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var norm = (center - vh / 2) / vh;
        norm = Math.max(-1, Math.min(1, norm));
        var amount = parseFloat(wrap.getAttribute('data-parallax-img') || '12');
        img.style.setProperty(
          '--img-parallax',
          (norm * amount * -1).toFixed(2) + 'px'
        );
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  initMenu();
  initHeroMouseTilt();
  initScrollReveal();
  initHeroScrollParallax();
  initImageParallax();
})();
