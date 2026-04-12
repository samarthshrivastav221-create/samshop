(function () {
      'use strict';

      /* ──────────────────────────────────────
         CUSTOM CURSOR
         ────────────────────────────────────── */
      const cursorDot = document.getElementById('cursorDot');
      const cursorRing = document.getElementById('cursorRing');
      let mouseX = 0, mouseY = 0;
      let ringX = 0, ringY = 0;

      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      if (!isTouchDevice) {
        document.addEventListener('mousemove', function (e) {
          mouseX = e.clientX;
          mouseY = e.clientY;
          cursorDot.style.left = mouseX + 'px';
          cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
          ringX += (mouseX - ringX) * 0.15;
          ringY += (mouseY - ringY) * 0.15;
          cursorRing.style.left = ringX + 'px';
          cursorRing.style.top = ringY + 'px';
          requestAnimationFrame(animateRing);
        }
        animateRing();

        var hoverTargets = document.querySelectorAll('a, button, input, .product-card, .category-tile, .feature-card, .testimonial-card, .trending-card, .lookbook-item, .process-step');
        hoverTargets.forEach(function (el) {
          el.addEventListener('mouseenter', function () {
            cursorDot.classList.add('hovering');
            cursorRing.classList.add('hovering');
          });
          el.addEventListener('mouseleave', function () {
            cursorDot.classList.remove('hovering');
            cursorRing.classList.remove('hovering');
          });
        });
      } else {
        cursorDot.style.display = 'none';
        cursorRing.style.display = 'none';
      }

      /* ──────────────────────────────────────
         NAVBAR SCROLL EFFECT
         ────────────────────────────────────── */
      var navbar = document.getElementById('navbar');

      function handleNavScroll() {
        var scrollY = window.scrollY || window.pageYOffset;
        if (scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      window.addEventListener('scroll', handleNavScroll, { passive: true });

      /* ──────────────────────────────────────
         MOBILE MENU TOGGLE
         ────────────────────────────────────── */
      var navToggle = document.getElementById('navToggle');
      var navLinksEl = document.getElementById('navLinks');

      navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navLinksEl.classList.toggle('active');
      });

      var navAnchors = navLinksEl.querySelectorAll('a');
      navAnchors.forEach(function (a) {
        a.addEventListener('click', function () {
          navToggle.classList.remove('active');
          navLinksEl.classList.remove('active');
        });
      });

      /* ──────────────────────────────────────
         SCROLL REVEAL (IntersectionObserver)
         ────────────────────────────────────── */
      var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate');

      if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(function (el) {
          revealObserver.observe(el);
        });
      } else {
        revealElements.forEach(function (el) {
          el.classList.add('visible');
        });
      }

      /* ──────────────────────────────────────
         COUNTER ANIMATION FOR STATS
         ────────────────────────────────────── */
      var statNumbers = document.querySelectorAll('.stat-number[data-count]');

      if ('IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var target = parseInt(el.getAttribute('data-count'));
              var suffix = el.getAttribute('data-suffix') || '';
              var duration = 2000;
              var startTime = null;

              function animateCount(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                var current = Math.floor(eased * target);
                el.textContent = current + suffix;
                if (progress < 1) {
                  requestAnimationFrame(animateCount);
                } else {
                  el.textContent = target + suffix;
                }
              }

              requestAnimationFrame(animateCount);
              counterObserver.unobserve(el);
            }
          });
        }, { threshold: 0.5 });

        statNumbers.forEach(function (el) {
          counterObserver.observe(el);
        });
      }

      /* ──────────────────────────────────────
         PARALLAX ON CATEGORY TILES
         ────────────────────────────────────── */
      var parallaxBgs = document.querySelectorAll('[data-parallax]');

      function handleParallax() {
        parallaxBgs.forEach(function (bg) {
          var tile = bg.closest('.category-tile');
          if (!tile) return;
          var rect = tile.getBoundingClientRect();
          var viewH = window.innerHeight;

          if (rect.top < viewH && rect.bottom > 0) {
            var progress = (viewH - rect.top) / (viewH + rect.height);
            var offset = (progress - 0.5) * 40;
            bg.style.transform = 'translateY(' + offset + 'px)';
          }
        });
      }

      window.addEventListener('scroll', handleParallax, { passive: true });

      /* ──────────────────────────────────────
         MAGNETIC CTA BUTTON
         ────────────────────────────────────── */
      var ctaBtn = document.getElementById('ctaBtn');

      if (!isTouchDevice && ctaBtn) {
        ctaBtn.addEventListener('mousemove', function (e) {
          var rect = ctaBtn.getBoundingClientRect();
          var x = e.clientX - rect.left - rect.width / 2;
          var y = e.clientY - rect.top - rect.height / 2;
          ctaBtn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
        });

        ctaBtn.addEventListener('mouseleave', function () {
          ctaBtn.style.transform = 'translate(0, 0)';
        });
      }

      /* ──────────────────────────────────────
         NEWSLETTER FORM
         ────────────────────────────────────── */
      var newsletterForm = document.getElementById('newsletterForm');
      var newsletterInput = document.getElementById('newsletterInput');

      newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = newsletterInput.value;
        if (email) {
          var btn = newsletterForm.querySelector('button');
          var originalText = btn.textContent;
          btn.textContent = 'Thank you!';
          btn.style.background = 'var(--warm-sand)';
          newsletterInput.value = '';
          setTimeout(function () {
            btn.textContent = originalText;
            btn.style.background = '';
          }, 2500);
        }
      });

      /* ──────────────────────────────────────
         SMOOTH SCROLL FOR ANCHOR LINKS
         ────────────────────────────────────── */
      document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
          var id = this.getAttribute('href');
          if (id === '#') return;
          var target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      /* ──────────────────────────────────────
         TRENDING SCROLL DRAG
         ────────────────────────────────────── */
      var trendingScroll = document.querySelector('.trending-scroll');
      if (trendingScroll) {
        var isDown = false;
        var startX;
        var scrollLeft;

        trendingScroll.addEventListener('mousedown', function (e) {
          isDown = true;
          startX = e.pageX - trendingScroll.offsetLeft;
          scrollLeft = trendingScroll.scrollLeft;
        });

        trendingScroll.addEventListener('mouseleave', function () { isDown = false; });
        trendingScroll.addEventListener('mouseup', function () { isDown = false; });

        trendingScroll.addEventListener('mousemove', function (e) {
          if (!isDown) return;
          e.preventDefault();
          var x = e.pageX - trendingScroll.offsetLeft;
          var walk = (x - startX) * 1.5;
          trendingScroll.scrollLeft = scrollLeft - walk;
        });
      }

    })();
