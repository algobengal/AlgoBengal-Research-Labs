function initNavbar() {
  var pillLinks = document.querySelectorAll('.nav__pill-link');
  var targets = [];
  var isClickScrolling = false;
  var clickScrollTimeout = null;
  var lastClickedId = null;

  pillLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      targets.push({ link: link, id: href.substring(1) });
    }
  });

  // Reset lastClickedId on manual user interaction
  var resetInteraction = function () {
    lastClickedId = null;
  };
  window.addEventListener('wheel', resetInteraction, { passive: true });
  window.addEventListener('touchstart', resetInteraction, { passive: true });
  window.addEventListener('pointerdown', resetInteraction, { passive: true });
  window.addEventListener('keydown', resetInteraction, { passive: true });

  // Handle click-based navigation with lock on scroll-spy to prevent bottom-clipping active state jumps
  pillLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var targetId = href.substring(1);
        lastClickedId = targetId; // Track the last clicked target to preserve highlight at bottom

        var scrollTargetId = targetId;
        if (scrollTargetId === 'collaboration') {
          scrollTargetId = 'collaborations';
        }
        var targetEl = document.getElementById(scrollTargetId);
        if (targetEl) {
          e.preventDefault();
          isClickScrolling = true;

          // Force highlight immediately
          pillLinks.forEach(function (l) {
            if (l === link) {
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });

          // Smooth scroll
          targetEl.scrollIntoView({ behavior: 'smooth' });

          // Release lock after animation finishes
          clearTimeout(clickScrollTimeout);
          clickScrollTimeout = setTimeout(function () {
            isClickScrolling = false;
            updateActiveSection();
          }, 800);
        }
      }
    });
  });

  function updateActiveSection() {
    if (isClickScrolling) return;

    var scrollY = window.scrollY;
    var scrollPos = scrollY + window.innerHeight * 0.35;

    // Resolve target elements dynamically to avoid race conditions with lazy loading components
    var sectionElements = [];
    targets.forEach(function (item) {
      var targetId = item.id;
      if (targetId === 'collaboration') {
        targetId = 'collaborations';
      }
      var el = document.getElementById(targetId) || document.getElementById(item.id);
      if (el) {
        sectionElements.push({ link: item.link, id: item.id, el: el });
      }
    });

    // Map and sort sections by their current top offset to handle arbitrary navbar link order
    var sortedSections = sectionElements.map(function (item) {
      return {
        link: item.link,
        id: item.id,
        top: item.el.getBoundingClientRect().top + window.scrollY
      };
    }).sort(function (a, b) {
      return a.top - b.top;
    });

    var current = null;
    var isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 15;

    if (isAtBottom && sortedSections.length > 0) {
      // If we clicked a specific target and scrolled to the bottom, honor that target
      if (lastClickedId) {
        var match = sortedSections.find(function (s) { return s.id === lastClickedId; });
        if (match) {
          current = match;
        }
      }
      // If no target was clicked (manual scroll), default to the last section (Contact)
      if (!current) {
        current = sortedSections[sortedSections.length - 1];
      }
    } else {
      for (var i = 0; i < sortedSections.length; i++) {
        if (scrollPos >= sortedSections[i].top - 120) {
          current = sortedSections[i];
        }
      }
    }

    targets.forEach(function (t) {
      if (current && t.link === current.link) {
        t.link.classList.add('active');
      } else {
        t.link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  setTimeout(updateActiveSection, 500);
  updateActiveSection();
}

fetch("components/navbar/navbar.html")
  .then(response => response.text())
  .then(data => {
    const navElem = document.getElementById("navbar");
    if (navElem) {
      navElem.innerHTML = data;
      initNavbar();
    }
  })
  .catch(err => console.error("Error loading navbar component:", err));