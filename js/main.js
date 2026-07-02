/* ==========================================================================
   Spoken English Class — Global Scripts
   Handles: navbar active state, scroll reveal animations, back-to-top button,
   contact form demo submission, and general UI interactions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Highlight active nav link ---------- */
  var page = window.location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('.navbar-custom .nav-link, .navbar-custom .dropdown-item').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.indexOf(page) !== -1 && page !== '') {
      link.classList.add('active');
      var parentToggle = link.closest('.dropdown');
      if (parentToggle) {
        var toggle = parentToggle.querySelector('.dropdown-toggle');
        if (toggle) toggle.classList.add('active');
      }
    }
  });

  /* ---------- Navbar shrink shadow on scroll ---------- */
  var navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 6px 24px rgba(22,25,43,0.10)';
      } else {
        navbar.style.boxShadow = '0 2px 10px rgba(22,25,43,0.06)';
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Back to top button ---------- */
  var backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) backBtn.classList.add('show');
      else backBtn.classList.remove('show');
    });
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Contact form demo handling ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var successBox = document.getElementById('contactSuccess');
      btn.disabled = true;
      btn.innerHTML = 'Sending...';
      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = 'Send Message';
        contactForm.reset();
        if (successBox) {
          successBox.classList.remove('d-none');
          successBox.classList.add('animate-fadeup');
          setTimeout(function () { successBox.classList.add('d-none'); }, 5000);
        }
      }, 900);
    });
  }

  /* ---------- Auto-collapse mobile navbar after link click ---------- */
  var navLinks = document.querySelectorAll('.navbar-collapse .nav-link:not(.dropdown-toggle), .navbar-collapse .dropdown-item');
  var navCollapseEl = document.querySelector('.navbar-collapse');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navCollapseEl && navCollapseEl.classList.contains('show')) {
        var bsCollapse = bootstrap.Collapse.getInstance(navCollapseEl) || new bootstrap.Collapse(navCollapseEl);
        bsCollapse.hide();
      }
    });
  });

});
