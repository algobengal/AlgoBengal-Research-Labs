fetch("./components/projects/projects.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("projects").innerHTML = data;
    })
    .catch(error => {
        console.error("Error loading Projects component:", error);
    });