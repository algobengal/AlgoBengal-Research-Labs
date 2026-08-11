// Cipher text reveal helper for elements with id 'cipher'

function animateSplashToNavbar() {
  const splash = document.getElementById("splash-screen");
  const splashLogo = document.getElementById("splashLogo");
  const navLogo = document.querySelector(".brand img") || document.querySelector(".image_size img");

  if (!splash || !splashLogo || !navLogo) {
    if (splash) splash.classList.add("fade-out");
    return;
  }

  const splashRect = splashLogo.getBoundingClientRect();
  const navRect = navLogo.getBoundingClientRect();

  const deltaX = navRect.left - splashRect.left;
  const deltaY = navRect.top - splashRect.top;
  const scale = navRect.width / splashRect.width;

  // 1. Move logo to navbar position while screen remains solid white
  splashLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;

  // 2. Fade out white screen after logo completes flight to navbar (850ms)
  setTimeout(function () {
    splash.classList.add("fade-out");
  }, 850);
}

window.addEventListener("load", function () {
  setTimeout(animateSplashToNavbar, 800);
});

document.addEventListener("DOMContentLoaded", function () {
  var el = document.getElementById('cipher');
  if (!el) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#%&";
  var parts = [];
  el.childNodes.forEach(function (n) {
    if (n.nodeType === 3) {
      parts.push({ node: n, text: n.textContent, scramble: true });
    } else {
      parts.push({ node: n, text: n.textContent, scramble: false });
    }
  });
  var frame = 0, total = 18;
  function tick() {
    frame++;
    parts.forEach(function (p) {
      if (!p.scramble) return;
      var out = "";
      for (var i = 0; i < p.text.length; i++) {
        var reveal = (i / p.text.length) < (frame / total);
        out += reveal ? p.text[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      p.node.textContent = out;
    });
    if (frame < total) { setTimeout(tick, 45); }
    else { parts.forEach(function (p) { if (p.scramble) p.node.textContent = p.text; }); }
  }
  setTimeout(tick, 250);
});
