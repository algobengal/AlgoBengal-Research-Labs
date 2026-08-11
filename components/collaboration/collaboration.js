fetch("./components/collaboration/collaboration.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("collaboration").innerHTML = data;
    })
    .catch(error => {
        console.error("Error loading collaboration component:", error);
    });