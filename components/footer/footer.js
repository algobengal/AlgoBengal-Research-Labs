fetch("components/footer/footer.html")
  .then(response => response.text())
  .then(data => {
    const footerElem = document.getElementById("footer");
    if (footerElem) footerElem.innerHTML = data;
  })
  .catch(err => console.error("Error loading footer component:", err));
