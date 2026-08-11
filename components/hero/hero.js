fetch("components/hero/hero.html")
  .then(response => response.text())
  .then(data => {
    const heroElem = document.getElementById("hero");
    if (heroElem) {
      heroElem.innerHTML = data;
    }
  })
  .catch(err => console.error("Error loading hero component:", err));