function initResearch() {
    const btn = document.getElementById("view-pubs-btn");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
        e.preventDefault();
        const extraPubs = document.querySelectorAll(".pub--extra");
        let isShowing = false;

        extraPubs.forEach(pub => {
            if (pub.classList.contains("pub--hidden")) {
                pub.classList.remove("pub--hidden");
                isShowing = true;
            } else {
                pub.classList.add("pub--hidden");
            }
        });

        if (isShowing) {
            btn.textContent = "Show fewer publications ↑";
        } else {
            btn.textContent = "View all publications →";
        }
    });
}

fetch("./components/Research/Research.html")
    .then(response => response.text())
    .then(data => {
        const container = document.getElementById("Research");
        if (!container) return;
        container.innerHTML = data;
        initResearch();
    })
    .catch(error => {
        console.error("Error loading Research component:", error);
    });